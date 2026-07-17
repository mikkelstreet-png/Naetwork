-- Persist a candidate's professional situation and make the professional's
-- optional donation of their 70% share explicit and auditable.

ALTER TABLE public.professional_profiles
  ADD COLUMN IF NOT EXISTS payout_preference TEXT NOT NULL DEFAULT 'receive';

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_payout_preference_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_payout_preference_check
  CHECK (payout_preference IN ('receive', 'donate'));

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payout_preference TEXT NOT NULL DEFAULT 'receive',
  ADD COLUMN IF NOT EXISTS minimum_contribution_dkk INTEGER,
  ADD COLUMN IF NOT EXISTS professional_donation_dkk INTEGER NOT NULL DEFAULT 0;

UPDATE public.bookings
SET
  minimum_contribution_dkk = COALESCE(minimum_contribution_dkk, contribution_dkk),
  professional_donation_dkk = COALESCE(professional_donation_dkk, 0)
WHERE minimum_contribution_dkk IS NULL
  OR professional_donation_dkk IS NULL;

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_payout_preference_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_payout_preference_check
  CHECK (payout_preference IN ('receive', 'donate'));

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_optional_donation_amounts_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_optional_donation_amounts_check CHECK (
    minimum_contribution_dkk IS NULL
    OR contribution_dkk IS NULL
    OR professional_payout_dkk IS NULL
    OR (
      minimum_contribution_dkk >= 0
      AND professional_donation_dkk >= 0
      AND contribution_dkk = minimum_contribution_dkk + professional_donation_dkk
      AND (
        (payout_preference = 'receive' AND professional_donation_dkk = 0)
        OR
        (payout_preference = 'donate' AND professional_payout_dkk = 0)
      )
    )
  );

COMMENT ON COLUMN public.professional_profiles.payout_preference IS
  'Professional choice for future bookings: receive the 70% share or donate it in addition to the fixed 10% contribution.';
COMMENT ON COLUMN public.bookings.payout_preference IS
  'Immutable snapshot of the professional payout preference when the booking request was created.';
COMMENT ON COLUMN public.bookings.minimum_contribution_dkk IS
  'Fixed 10% contribution to Kræftens Bekæmpelse from the VAT-exclusive session price.';
COMMENT ON COLUMN public.bookings.professional_donation_dkk IS
  'Optional donated 70% professional share. Zero when payout_preference is receive.';
COMMENT ON COLUMN public.bookings.contribution_dkk IS
  'Total contribution to Kræftens Bekæmpelse, including an optional donated professional share.';

CREATE TABLE IF NOT EXISTS public.career_situations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  category TEXT NOT NULL CHECK (category IN ('Consulting', 'Finance', 'Legal')),
  session_type TEXT NOT NULL CHECK (session_type IN (
    'cv-review',
    'application-feedback',
    'interview-training',
    'case-interview-preparation',
    'career-clarity',
    'graduate-internship',
    'industry-company-insight'
  )),
  stage TEXT NOT NULL DEFAULT 'preparing' CHECK (stage IN (
    'exploring', 'preparing', 'applying', 'interviewing', 'deciding'
  )),
  deadline DATE,
  next_action TEXT CHECK (next_action IS NULL OR char_length(next_action) <= 300),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS career_situations_one_active_per_profile_idx
  ON public.career_situations (profile_id)
  WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS career_situations_profile_updated_idx
  ON public.career_situations (profile_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.saved_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  career_situation_id UUID REFERENCES public.career_situations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, professional_profile_id)
);

CREATE INDEX IF NOT EXISTS saved_professionals_profile_created_idx
  ON public.saved_professionals (profile_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.availability_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, professional_profile_id)
);

CREATE INDEX IF NOT EXISTS availability_alerts_active_professional_idx
  ON public.availability_alerts (professional_profile_id, created_at)
  WHERE is_active = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_outcome_participants_idx
  ON public.bookings (id, candidate_profile_id, professional_profile_id);

CREATE TABLE IF NOT EXISTS public.session_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE,
  candidate_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL CHECK (char_length(summary) BETWEEN 10 AND 1000),
  priorities TEXT[] NOT NULL DEFAULT '{}'::TEXT[] CHECK (cardinality(priorities) BETWEEN 1 AND 3),
  next_action TEXT NOT NULL CHECK (char_length(next_action) BETWEEN 3 AND 300),
  next_action_due_at DATE,
  candidate_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT session_outcomes_booking_participants_fk
    FOREIGN KEY (booking_id, candidate_profile_id, professional_profile_id)
    REFERENCES public.bookings (id, candidate_profile_id, professional_profile_id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS session_outcomes_candidate_updated_idx
  ON public.session_outcomes (candidate_profile_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS session_outcomes_professional_updated_idx
  ON public.session_outcomes (professional_profile_id, updated_at DESC);

ALTER TABLE public.career_situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_outcomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "career_situations: own select" ON public.career_situations;
CREATE POLICY "career_situations: own select" ON public.career_situations
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = profile_id
      AND profile.auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "career_situations: own insert" ON public.career_situations;
CREATE POLICY "career_situations: own insert" ON public.career_situations
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = profile_id
      AND profile.auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "career_situations: own update" ON public.career_situations;
CREATE POLICY "career_situations: own update" ON public.career_situations
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = profile_id
      AND profile.auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = profile_id
      AND profile.auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "career_situations: own delete" ON public.career_situations;
CREATE POLICY "career_situations: own delete" ON public.career_situations
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = profile_id
      AND profile.auth_user_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "saved_professionals: own all" ON public.saved_professionals;
CREATE POLICY "saved_professionals: own all" ON public.saved_professionals
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = profile_id
      AND profile.auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles profile
      WHERE profile.id = profile_id
        AND profile.auth_user_id = (SELECT auth.uid())
    )
    AND EXISTS (
      SELECT 1 FROM public.professional_profiles professional
      WHERE professional.id = professional_profile_id
        AND professional.visibility = 'published'
        AND professional.review_status = 'approved'
    )
  );

DROP POLICY IF EXISTS "availability_alerts: own all" ON public.availability_alerts;
CREATE POLICY "availability_alerts: own all" ON public.availability_alerts
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles profile
    WHERE profile.id = profile_id
      AND profile.auth_user_id = (SELECT auth.uid())
  ))
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles profile
      WHERE profile.id = profile_id
        AND profile.auth_user_id = (SELECT auth.uid())
    )
    AND EXISTS (
      SELECT 1 FROM public.professional_profiles professional
      WHERE professional.id = professional_profile_id
        AND professional.visibility = 'published'
        AND professional.review_status = 'approved'
    )
  );

DROP POLICY IF EXISTS "session_outcomes: participant select" ON public.session_outcomes;
CREATE POLICY "session_outcomes: participant select" ON public.session_outcomes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles candidate
      WHERE candidate.id = candidate_profile_id
        AND candidate.auth_user_id = (SELECT auth.uid())
    )
    OR EXISTS (
      SELECT 1
      FROM public.professional_profiles professional
      JOIN public.profiles owner ON owner.id = professional.profile_id
      WHERE professional.id = professional_profile_id
        AND owner.auth_user_id = (SELECT auth.uid())
    )
  );

DROP TRIGGER IF EXISTS career_situations_updated_at ON public.career_situations;
CREATE TRIGGER career_situations_updated_at
  BEFORE UPDATE ON public.career_situations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS availability_alerts_updated_at ON public.availability_alerts;
CREATE TRIGGER availability_alerts_updated_at
  BEFORE UPDATE ON public.availability_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS session_outcomes_updated_at ON public.session_outcomes;
CREATE TRIGGER session_outcomes_updated_at
  BEFORE UPDATE ON public.session_outcomes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

REVOKE ALL ON TABLE public.career_situations FROM anon;
REVOKE ALL ON TABLE public.saved_professionals FROM anon;
REVOKE ALL ON TABLE public.availability_alerts FROM anon;
REVOKE ALL ON TABLE public.session_outcomes FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.career_situations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.saved_professionals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.availability_alerts TO authenticated;
GRANT SELECT ON TABLE public.session_outcomes TO authenticated;
GRANT ALL ON TABLE public.career_situations TO service_role;
GRANT ALL ON TABLE public.saved_professionals TO service_role;
GRANT ALL ON TABLE public.availability_alerts TO service_role;
GRANT ALL ON TABLE public.session_outcomes TO service_role;

COMMENT ON TABLE public.career_situations IS
  'A candidate-owned, persistent professional situation used to continue the journey between visits.';
COMMENT ON TABLE public.saved_professionals IS
  'Candidate shortlist linked to an optional active career situation.';
COMMENT ON TABLE public.availability_alerts IS
  'Explicit opt-in to receive a notification when a selected professional opens availability.';
COMMENT ON TABLE public.session_outcomes IS
  'Structured post-session result and next action shared only with booking participants.';

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
  payout_preference TEXT,
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
    professional.id,
    professional.profile_id,
    profile.name,
    professional.title,
    professional.company,
    professional.bio,
    professional.industries,
    professional.focus_areas,
    professional.languages,
    professional.seniority,
    professional.years_experience,
    professional.response_time_hours,
    professional.price_dkk,
    professional.contribution_percent,
    professional.payout_preference,
    MIN(slot.starts_at) FILTER (WHERE slot.is_available = TRUE AND slot.starts_at > NOW()) AS next_available_at,
    COUNT(DISTINCT review.id) FILTER (WHERE review.moderation_status = 'published') AS review_count,
    ROUND(AVG(review.rating) FILTER (WHERE review.moderation_status = 'published'), 1) AS average_rating
  FROM public.professional_profiles professional
  JOIN public.profiles profile ON profile.id = professional.profile_id
  LEFT JOIN public.availability_slots slot ON slot.professional_profile_id = professional.id
  LEFT JOIN public.reviews review ON review.professional_profile_id = professional.id
  WHERE professional.visibility = 'published'
    AND professional.review_status = 'approved'
    AND profile.status = 'active'
    AND (requested_id IS NULL OR professional.id = requested_id)
  GROUP BY professional.id, profile.name
  ORDER BY MIN(slot.starts_at) FILTER (WHERE slot.is_available = TRUE AND slot.starts_at > NOW()) ASC NULLS LAST,
    professional.approved_at DESC NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.get_public_professionals(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_professionals(UUID) TO anon, authenticated;
