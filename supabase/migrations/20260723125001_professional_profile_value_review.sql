-- Make professional relevance and review feedback explicit without changing the
-- existing ownership, publication or booking model.

ALTER TABLE public.professional_profiles
  ADD COLUMN IF NOT EXISTS experience_summary TEXT,
  ADD COLUMN IF NOT EXISTS relevant_situations TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS expected_outcomes TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS review_feedback TEXT;

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_experience_summary_length;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_experience_summary_length
  CHECK (experience_summary IS NULL OR char_length(experience_summary) <= 600);

CREATE OR REPLACE FUNCTION public.text_array_items_within(
  values_to_check TEXT[],
  maximum_items INTEGER,
  maximum_length INTEGER
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
SET search_path = ''
AS $$
  SELECT cardinality(values_to_check) <= maximum_items
    AND COALESCE(bool_and(item IS NOT NULL AND char_length(btrim(item)) BETWEEN 1 AND maximum_length), TRUE)
  FROM unnest(values_to_check) AS item;
$$;

REVOKE ALL ON FUNCTION public.text_array_items_within(TEXT[], INTEGER, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.text_array_items_within(TEXT[], INTEGER, INTEGER) TO authenticated, service_role;

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_relevant_situations_count;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_relevant_situations_count
  CHECK (public.text_array_items_within(relevant_situations, 3, 180));

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_expected_outcomes_count;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_expected_outcomes_count
  CHECK (public.text_array_items_within(expected_outcomes, 3, 180));

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_review_feedback_length;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_review_feedback_length
  CHECK (review_feedback IS NULL OR char_length(review_feedback) <= 600);

COMMENT ON COLUMN public.professional_profiles.experience_summary IS
  'Concise explanation of the direct experience that makes this professional relevant.';
COMMENT ON COLUMN public.professional_profiles.relevant_situations IS
  'Up to three concrete candidate situations where the professional is relevant.';
COMMENT ON COLUMN public.professional_profiles.expected_outcomes IS
  'Up to three realistic outcomes a candidate can take away from a session.';
COMMENT ON COLUMN public.professional_profiles.review_feedback IS
  'Concise private profile-review feedback shared between Naetwork admins and the profile owner.';

-- Require both row ownership and an active professional product role. The
-- original ownership policy only matched profile_id, so a candidate could
-- create a professional profile by calling the Data API directly.
DROP POLICY IF EXISTS "professional_profiles: own all" ON public.professional_profiles;
CREATE POLICY "professional_profiles: active professional owns profile"
  ON public.professional_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles owner_profile
      WHERE owner_profile.id = professional_profiles.profile_id
        AND owner_profile.auth_user_id = (SELECT auth.uid())
        AND owner_profile.role = 'professional'
        AND owner_profile.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles owner_profile
      WHERE owner_profile.id = professional_profiles.profile_id
        AND owner_profile.auth_user_id = (SELECT auth.uid())
        AND owner_profile.role = 'professional'
        AND owner_profile.status = 'active'
    )
  );

CREATE OR REPLACE FUNCTION public.reset_professional_review_on_edit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_admin_context BOOLEAN :=
    COALESCE(auth.jwt() ->> 'role' = 'service_role', FALSE)
    OR public.is_admin();
BEGIN
  IF has_admin_context THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.review_status := 'pending';
    NEW.approved_at := NULL;
    NEW.review_feedback := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Owners cannot write admin feedback through the Data API. Feedback stays
    -- visible while a rejected profile is edited as a draft and is cleared only
    -- when the owner explicitly sends the profile back for review.
    NEW.review_feedback := OLD.review_feedback;
    NEW.approved_at := OLD.approved_at;
    IF NEW.visibility = 'published' AND OLD.visibility IS DISTINCT FROM 'published' THEN
      NEW.review_feedback := NULL;
    END IF;

    IF NEW.title IS DISTINCT FROM OLD.title OR
      NEW.company IS DISTINCT FROM OLD.company OR
      NEW.bio IS DISTINCT FROM OLD.bio OR
      NEW.industries IS DISTINCT FROM OLD.industries OR
      NEW.focus_areas IS DISTINCT FROM OLD.focus_areas OR
      NEW.languages IS DISTINCT FROM OLD.languages OR
      NEW.seniority IS DISTINCT FROM OLD.seniority OR
      NEW.years_experience IS DISTINCT FROM OLD.years_experience OR
      NEW.response_time_hours IS DISTINCT FROM OLD.response_time_hours OR
      NEW.price_dkk IS DISTINCT FROM OLD.price_dkk OR
      NEW.linkedin_url IS DISTINCT FROM OLD.linkedin_url OR
      NEW.contribution_percent IS DISTINCT FROM OLD.contribution_percent OR
      NEW.payout_preference IS DISTINCT FROM OLD.payout_preference OR
      NEW.experience_summary IS DISTINCT FROM OLD.experience_summary OR
      NEW.relevant_situations IS DISTINCT FROM OLD.relevant_situations OR
      NEW.expected_outcomes IS DISTINCT FROM OLD.expected_outcomes OR
      NEW.visibility IS DISTINCT FROM OLD.visibility OR
      NEW.review_status IS DISTINCT FROM OLD.review_status
    THEN
      NEW.review_status := 'pending';
      NEW.approved_at := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

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
  experience_summary TEXT,
  relevant_situations TEXT[],
  expected_outcomes TEXT[],
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
    professional.experience_summary,
    professional.relevant_situations,
    professional.expected_outcomes,
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
