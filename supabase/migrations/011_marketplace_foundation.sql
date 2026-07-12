-- Marketplace foundation: real availability, explicit lifecycle states and auditable integrations.

ALTER TABLE public.professional_profiles
  ADD COLUMN IF NOT EXISTS languages TEXT[] NOT NULL DEFAULT ARRAY['da', 'en']::TEXT[],
  ADD COLUMN IF NOT EXISTS seniority TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS response_time_hours INTEGER NOT NULL DEFAULT 48,
  ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_seniority_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_seniority_check
  CHECK (seniority IS NULL OR seniority IN ('specialist', 'manager', 'director', 'executive'));

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_years_experience_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_years_experience_check
  CHECK (years_experience IS NULL OR years_experience BETWEEN 1 AND 50);

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_response_time_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_response_time_check
  CHECK (response_time_hours IN (24, 48, 72));

ALTER TABLE public.availability_slots
  ADD COLUMN IF NOT EXISTS time_zone TEXT NOT NULL DEFAULT 'Europe/Copenhagen',
  ADD COLUMN IF NOT EXISTS meeting_mode TEXT NOT NULL DEFAULT 'video',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.availability_slots
  DROP CONSTRAINT IF EXISTS availability_slots_valid_range;
ALTER TABLE public.availability_slots
  ADD CONSTRAINT availability_slots_valid_range CHECK (
    ends_at > starts_at AND ends_at <= starts_at + INTERVAL '60 minutes'
  );

ALTER TABLE public.availability_slots
  DROP CONSTRAINT IF EXISTS availability_slots_meeting_mode_check;
ALTER TABLE public.availability_slots
  ADD CONSTRAINT availability_slots_meeting_mode_check
  CHECK (meeting_mode IN ('video', 'phone', 'in_person'));

CREATE INDEX IF NOT EXISTS availability_slots_public_lookup_idx
  ON public.availability_slots (professional_profile_id, starts_at)
  WHERE is_available = TRUE;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS focus_area TEXT,
  ADD COLUMN IF NOT EXISTS goal TEXT,
  ADD COLUMN IF NOT EXISTS material_url TEXT,
  ADD COLUMN IF NOT EXISTS time_zone TEXT NOT NULL DEFAULT 'Europe/Copenhagen',
  ADD COLUMN IF NOT EXISTS meeting_mode TEXT NOT NULL DEFAULT 'video',
  ADD COLUMN IF NOT EXISTS meeting_url TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT,
  ADD COLUMN IF NOT EXISTS refund_status TEXT NOT NULL DEFAULT 'not_requested';

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_refund_status_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_refund_status_check CHECK (
    refund_status IN ('not_requested', 'requested', 'processing', 'succeeded', 'failed', 'rejected')
  );

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_payment_status_check CHECK (
    payment_status IN ('pending', 'requires_payment', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded', 'waived')
  );

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_meeting_mode_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_meeting_mode_check
  CHECK (meeting_mode IN ('video', 'phone', 'in_person'));

CREATE UNIQUE INDEX IF NOT EXISTS bookings_one_active_request_per_slot_idx
  ON public.bookings (slot_id)
  WHERE slot_id IS NOT NULL AND status IN ('requested', 'pending', 'confirmed', 'rescheduled');

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  candidate_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  professional_profile_id UUID REFERENCES public.professional_profiles(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT CHECK (char_length(feedback) <= 1000),
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'published', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('received', 'processed', 'ignored', 'failed')),
  amount_dkk INTEGER,
  error_message TEXT,
  payload_digest TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.email_delivery_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  recipient_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  template_key TEXT NOT NULL,
  provider_message_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'delivered', 'bounced', 'complained', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  anonymous_id TEXT,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  professional_profile_id UUID REFERENCES public.professional_profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  properties JSONB NOT NULL DEFAULT '{}'::JSONB,
  consent_level TEXT NOT NULL DEFAULT 'necessary' CHECK (consent_level IN ('necessary', 'analytics')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_delivery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews: published read" ON public.reviews;
CREATE POLICY "reviews: published read" ON public.reviews
  FOR SELECT USING (moderation_status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "reviews: admin update" ON public.reviews;
CREATE POLICY "reviews: admin update" ON public.reviews
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "reviews: candidate insert completed booking" ON public.reviews;
CREATE POLICY "reviews: candidate insert completed booking" ON public.reviews
  FOR INSERT WITH CHECK (
    candidate_profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
        AND b.candidate_profile_id = candidate_profile_id
        AND b.professional_profile_id = professional_profile_id
        AND b.status = 'completed'
    )
  );

DROP POLICY IF EXISTS "payment_events: admin read" ON public.payment_events;
CREATE POLICY "payment_events: admin read" ON public.payment_events
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "email_events: admin read" ON public.email_delivery_events;
CREATE POLICY "email_events: admin read" ON public.email_delivery_events
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "analytics_events: admin read" ON public.analytics_events;
CREATE POLICY "analytics_events: admin read" ON public.analytics_events
  FOR SELECT USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.protect_professional_integration_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NOT public.is_admin() THEN
    NEW.stripe_account_id := OLD.stripe_account_id;
    NEW.stripe_onboarding_complete := OLD.stripe_onboarding_complete;
  ELSIF TG_OP = 'INSERT' AND NOT public.is_admin() THEN
    NEW.stripe_account_id := NULL;
    NEW.stripe_onboarding_complete := FALSE;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS professional_profiles_protect_integrations ON public.professional_profiles;
CREATE TRIGGER professional_profiles_protect_integrations
  BEFORE INSERT OR UPDATE ON public.professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_professional_integration_fields();

DROP FUNCTION IF EXISTS public.get_public_professionals(UUID);
CREATE FUNCTION public.get_public_professionals(requested_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  profile_id UUID,
  name TEXT,
  title TEXT,
  company TEXT,
  bio TEXT,
  industries TEXT[],
  focus_areas TEXT[],
  languages TEXT[],
  seniority TEXT,
  years_experience INTEGER,
  response_time_hours INTEGER,
  price_dkk INTEGER,
  contribution_percent INTEGER,
  next_available_at TIMESTAMPTZ,
  review_count BIGINT,
  average_rating NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pp.id,
    pp.profile_id,
    p.name,
    pp.title,
    pp.company,
    pp.bio,
    pp.industries,
    pp.focus_areas,
    pp.languages,
    pp.seniority,
    pp.years_experience,
    pp.response_time_hours,
    pp.price_dkk,
    pp.contribution_percent,
    MIN(a.starts_at) FILTER (WHERE a.is_available = TRUE AND a.starts_at > NOW()) AS next_available_at,
    COUNT(DISTINCT r.id) FILTER (WHERE r.moderation_status = 'published') AS review_count,
    ROUND(AVG(r.rating) FILTER (WHERE r.moderation_status = 'published'), 1) AS average_rating
  FROM public.professional_profiles pp
  JOIN public.profiles p ON p.id = pp.profile_id
  LEFT JOIN public.availability_slots a ON a.professional_profile_id = pp.id
  LEFT JOIN public.reviews r ON r.professional_profile_id = pp.id
  WHERE pp.visibility = 'published'
    AND pp.review_status = 'approved'
    AND p.status = 'active'
    AND (requested_id IS NULL OR pp.id = requested_id)
  GROUP BY pp.id, p.name
  ORDER BY MIN(a.starts_at) FILTER (WHERE a.is_available = TRUE AND a.starts_at > NOW()) ASC NULLS LAST,
    pp.approved_at DESC NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.get_public_professionals(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_professionals(UUID) TO anon, authenticated;

COMMENT ON TABLE public.payment_events IS 'Immutable processing ledger for verified Stripe webhook events. Never store full payment payloads.';
COMMENT ON TABLE public.email_delivery_events IS 'Auditable delivery state for transactional email templates.';
COMMENT ON TABLE public.analytics_events IS 'First-party, data-minimised product events. Analytics events require the matching consent level.';
