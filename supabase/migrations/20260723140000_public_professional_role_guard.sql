-- Keep public visibility tied to an active professional account even if an
-- administrator later changes the owning account's primary product role.

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
    AND profile.role = 'professional'
    AND (requested_id IS NULL OR professional.id = requested_id)
  GROUP BY professional.id, profile.name
  ORDER BY MIN(slot.starts_at) FILTER (WHERE slot.is_available = TRUE AND slot.starts_at > NOW()) ASC NULLS LAST,
    professional.approved_at DESC NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.get_public_professionals(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_professionals(UUID) TO anon, authenticated;
