-- Replace the variable contribution model with one fixed split of the VAT-exclusive price:
-- 20% Naetwork, 30% Kræftens Bekæmpelse and 50% the professional.

UPDATE public.professional_profiles
SET contribution_percent = 30
WHERE contribution_percent IS DISTINCT FROM 30;

ALTER TABLE public.professional_profiles
  ALTER COLUMN contribution_percent SET DEFAULT 30;

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_contribution_percent_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_contribution_percent_check
  CHECK (contribution_percent = 30);

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS platform_share_percent INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS professional_share_percent INTEGER DEFAULT 50,
  ALTER COLUMN contribution_percent SET DEFAULT 30;

WITH recalculated AS (
  SELECT
    id,
    ROUND(price_dkk / 1.25)::INTEGER AS net_price
  FROM public.bookings
  WHERE price_dkk IS NOT NULL
)
UPDATE public.bookings AS booking
SET
  price_ex_vat_dkk = recalculated.net_price,
  vat_dkk = booking.price_dkk - recalculated.net_price,
  contribution_percent = 30,
  contribution_dkk = ROUND(recalculated.net_price * 0.30)::INTEGER,
  platform_share_percent = 20,
  platform_fee_dkk = ROUND(recalculated.net_price * 0.20)::INTEGER,
  professional_share_percent = 50,
  professional_payout_dkk = recalculated.net_price
    - ROUND(recalculated.net_price * 0.30)::INTEGER
    - ROUND(recalculated.net_price * 0.20)::INTEGER
FROM recalculated
WHERE booking.id = recalculated.id;

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_contribution_percent_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_contribution_percent_check
  CHECK (contribution_percent IS NULL OR contribution_percent = 30);

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_fixed_split_percent_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_fixed_split_percent_check
  CHECK (
    (platform_share_percent IS NULL OR platform_share_percent = 20) AND
    (professional_share_percent IS NULL OR professional_share_percent = 50)
  );

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_economics_balance_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_economics_balance_check
  CHECK (
    price_ex_vat_dkk IS NULL OR
    contribution_dkk IS NULL OR
    platform_fee_dkk IS NULL OR
    professional_payout_dkk IS NULL OR
    price_ex_vat_dkk = contribution_dkk + platform_fee_dkk + professional_payout_dkk
  );

COMMENT ON COLUMN public.professional_profiles.contribution_percent IS 'Fixed charitable share of the VAT-exclusive session price. Must be 30.';
COMMENT ON COLUMN public.bookings.contribution_percent IS 'Charitable share percentage snapshotted at booking time. Fixed at 30.';
COMMENT ON COLUMN public.bookings.platform_share_percent IS 'Naetwork share percentage snapshotted at booking time. Fixed at 20.';
COMMENT ON COLUMN public.bookings.professional_share_percent IS 'Professional share percentage snapshotted at booking time. Fixed at 50.';
COMMENT ON COLUMN public.bookings.platform_fee_dkk IS 'Naetwork''s 20% share of the VAT-exclusive session price, snapshotted at booking time.';
