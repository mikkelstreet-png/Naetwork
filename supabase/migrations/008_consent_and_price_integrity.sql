-- Persist legal acknowledgements and make the public four-price model enforceable.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS terms_version TEXT,
  ADD COLUMN IF NOT EXISTS privacy_noticed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS privacy_version TEXT;

UPDATE public.professional_profiles
SET price_dkk = CASE
  WHEN price_dkk <= 750 THEN 600
  WHEN price_dkk <= 1050 THEN 900
  WHEN price_dkk <= 1500 THEN 1200
  ELSE 1800
END
WHERE price_dkk NOT IN (600, 900, 1200, 1800);

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_price_dkk_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_price_dkk_check
  CHECK (price_dkk IN (600, 900, 1200, 1800));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    auth_user_id,
    name,
    email,
    role,
    terms_accepted_at,
    terms_version,
    privacy_noticed_at,
    privacy_version
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    CASE WHEN NEW.raw_user_meta_data->>'role' = 'professional' THEN 'professional' ELSE 'candidate' END,
    NULLIF(NEW.raw_user_meta_data->>'termsAcceptedAt', '')::TIMESTAMPTZ,
    NULLIF(NEW.raw_user_meta_data->>'termsVersion', ''),
    NULLIF(NEW.raw_user_meta_data->>'privacyNoticedAt', '')::TIMESTAMPTZ,
    NULLIF(NEW.raw_user_meta_data->>'privacyVersion', '')
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    role = CASE WHEN public.profiles.role = 'admin' THEN 'admin' ELSE EXCLUDED.role END,
    terms_accepted_at = COALESCE(public.profiles.terms_accepted_at, EXCLUDED.terms_accepted_at),
    terms_version = COALESCE(public.profiles.terms_version, EXCLUDED.terms_version),
    privacy_noticed_at = COALESCE(public.profiles.privacy_noticed_at, EXCLUDED.privacy_noticed_at),
    privacy_version = COALESCE(public.profiles.privacy_version, EXCLUDED.privacy_version),
    updated_at = NOW();
  RETURN NEW;
END;
$$;
