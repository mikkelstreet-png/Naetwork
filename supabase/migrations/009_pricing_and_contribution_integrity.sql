-- Lock the four contribution choices and snapshot session economics at booking time.

UPDATE public.professional_profiles
SET contribution_percent = CASE
  WHEN contribution_percent <= 50 THEN 40
  WHEN contribution_percent <= 70 THEN 60
  WHEN contribution_percent <= 85 THEN 80
  ELSE 90
END
WHERE contribution_percent NOT IN (40, 60, 80, 90);

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_contribution_percent_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_contribution_percent_check
  CHECK (contribution_percent IN (40, 60, 80, 90));

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS price_ex_vat_dkk INTEGER,
  ADD COLUMN IF NOT EXISTS vat_dkk INTEGER,
  ADD COLUMN IF NOT EXISTS contribution_percent INTEGER,
  ADD COLUMN IF NOT EXISTS contribution_dkk INTEGER,
  ADD COLUMN IF NOT EXISTS platform_fee_dkk INTEGER,
  ADD COLUMN IF NOT EXISTS professional_payout_dkk INTEGER;

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_contribution_percent_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_contribution_percent_check
  CHECK (contribution_percent IS NULL OR contribution_percent IN (40, 60, 80, 90));

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_economics_non_negative_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_economics_non_negative_check
  CHECK (
    (price_ex_vat_dkk IS NULL OR price_ex_vat_dkk >= 0) AND
    (vat_dkk IS NULL OR vat_dkk >= 0) AND
    (contribution_dkk IS NULL OR contribution_dkk >= 0) AND
    (platform_fee_dkk IS NULL OR platform_fee_dkk >= 0) AND
    (professional_payout_dkk IS NULL OR professional_payout_dkk >= 0)
  );

COMMENT ON COLUMN public.bookings.price_ex_vat_dkk IS 'Session price excluding VAT, snapshotted when the request is created.';
COMMENT ON COLUMN public.bookings.contribution_dkk IS 'Charitable contribution calculated from the session price excluding VAT.';
COMMENT ON COLUMN public.bookings.platform_fee_dkk IS 'Platform and payment fee snapshotted at booking time.';
COMMENT ON COLUMN public.bookings.professional_payout_dkk IS 'Expected payout before the professional''s own tax obligations.';
