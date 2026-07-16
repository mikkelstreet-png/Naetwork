-- Make the public product contract explicit in the data model:
-- seven concrete session types and a fixed 10/20/70 split of the VAT-exclusive price.

UPDATE public.professional_profiles
SET contribution_percent = 10
WHERE contribution_percent IS DISTINCT FROM 10;

ALTER TABLE public.professional_profiles
  ALTER COLUMN contribution_percent SET DEFAULT 10;

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_contribution_percent_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_contribution_percent_check
  CHECK (contribution_percent = 10);

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS session_type TEXT,
  ALTER COLUMN contribution_percent SET DEFAULT 10,
  ALTER COLUMN platform_share_percent SET DEFAULT 20,
  ALTER COLUMN professional_share_percent SET DEFAULT 70;

UPDATE public.bookings
SET session_type = CASE
  WHEN focus_area IN ('cv_linkedin', 'cv_review') THEN 'cv-review'
  WHEN focus_area = 'application_review' THEN 'application-feedback'
  WHEN focus_area IN ('interview_prep', 'mock_interview') THEN 'interview-training'
  WHEN focus_area IN ('case_prep', 'consulting_cases', 'banking_technicals', 'pe_investment_case') THEN 'case-interview-preparation'
  WHEN focus_area = 'graduate_internship' THEN 'graduate-internship'
  WHEN focus_area IN ('industry_insight', 'informal_chat') THEN 'industry-company-insight'
  ELSE 'career-clarity'
END
WHERE session_type IS NULL;

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
  contribution_percent = 10,
  contribution_dkk = ROUND(recalculated.net_price * 0.10)::INTEGER,
  platform_share_percent = 20,
  platform_fee_dkk = ROUND(recalculated.net_price * 0.20)::INTEGER,
  professional_share_percent = 70,
  professional_payout_dkk = recalculated.net_price
    - ROUND(recalculated.net_price * 0.10)::INTEGER
    - ROUND(recalculated.net_price * 0.20)::INTEGER
FROM recalculated
WHERE booking.id = recalculated.id;

UPDATE public.bookings
SET
  contribution_percent = 10,
  platform_share_percent = 20,
  professional_share_percent = 70
WHERE price_dkk IS NULL;

ALTER TABLE public.bookings
  ALTER COLUMN session_type SET NOT NULL,
  ALTER COLUMN contribution_percent SET NOT NULL,
  ALTER COLUMN platform_share_percent SET NOT NULL,
  ALTER COLUMN professional_share_percent SET NOT NULL;

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_session_type_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_session_type_check CHECK (
    session_type IN (
      'cv-review',
      'application-feedback',
      'interview-training',
      'case-interview-preparation',
      'career-clarity',
      'graduate-internship',
      'industry-company-insight'
    )
  );

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_contribution_percent_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_contribution_percent_check
  CHECK (contribution_percent = 10);

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_fixed_split_percent_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_fixed_split_percent_check CHECK (
    platform_share_percent = 20
    AND professional_share_percent = 70
  );

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_economics_balance_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_economics_balance_check CHECK (
    price_ex_vat_dkk IS NULL OR
    contribution_dkk IS NULL OR
    platform_fee_dkk IS NULL OR
    professional_payout_dkk IS NULL OR
    price_ex_vat_dkk = contribution_dkk + platform_fee_dkk + professional_payout_dkk
  );

CREATE INDEX IF NOT EXISTS bookings_session_type_starts_at_idx
  ON public.bookings (session_type, starts_at DESC);

COMMENT ON COLUMN public.professional_profiles.contribution_percent IS 'Fixed charitable share of the VAT-exclusive session price. Must be 10.';
COMMENT ON COLUMN public.bookings.session_type IS 'Concrete 60-minute career session selected by the candidate.';
COMMENT ON COLUMN public.bookings.contribution_percent IS 'Kræftens Bekæmpelse share snapshotted at booking time. Fixed at 10.';
COMMENT ON COLUMN public.bookings.platform_share_percent IS 'Naetwork platform share snapshotted at booking time. Fixed at 20.';
COMMENT ON COLUMN public.bookings.professional_share_percent IS 'Professional share snapshotted at booking time. Fixed at 70.';
COMMENT ON COLUMN public.bookings.platform_fee_dkk IS 'Naetwork''s 20% share of the VAT-exclusive session price, snapshotted at booking time.';
