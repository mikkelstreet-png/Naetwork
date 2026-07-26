-- Make post-session feedback structured, attributable to one completed
-- booking and immutable after submission. Existing reviews remain valid
-- legacy rows; every new review must use schema version 2.

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS feedback_schema_version SMALLINT,
  ADD COLUMN IF NOT EXISTS goal_achieved TEXT,
  ADD COLUMN IF NOT EXISTS professional_relevance SMALLINT,
  ADD COLUMN IF NOT EXISTS professional_preparedness SMALLINT,
  ADD COLUMN IF NOT EXISTS greater_clarity SMALLINT,
  ADD COLUMN IF NOT EXISTS concrete_next_steps SMALLINT;

UPDATE public.reviews
SET feedback_schema_version = 1
WHERE feedback_schema_version IS NULL;

ALTER TABLE public.reviews
  ALTER COLUMN feedback_schema_version SET DEFAULT 2,
  ALTER COLUMN feedback_schema_version SET NOT NULL;

ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_feedback_schema_version_check,
  DROP CONSTRAINT IF EXISTS reviews_goal_achieved_check,
  DROP CONSTRAINT IF EXISTS reviews_professional_relevance_check,
  DROP CONSTRAINT IF EXISTS reviews_professional_preparedness_check,
  DROP CONSTRAINT IF EXISTS reviews_greater_clarity_check,
  DROP CONSTRAINT IF EXISTS reviews_concrete_next_steps_check,
  DROP CONSTRAINT IF EXISTS reviews_structured_feedback_complete_check;

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_feedback_schema_version_check
    CHECK (feedback_schema_version IN (1, 2)) NOT VALID,
  ADD CONSTRAINT reviews_goal_achieved_check
    CHECK (
      goal_achieved IS NULL
      OR goal_achieved IN ('achieved', 'partially_achieved', 'not_achieved')
    ) NOT VALID,
  ADD CONSTRAINT reviews_professional_relevance_check
    CHECK (
      professional_relevance IS NULL
      OR professional_relevance BETWEEN 1 AND 5
    ) NOT VALID,
  ADD CONSTRAINT reviews_professional_preparedness_check
    CHECK (
      professional_preparedness IS NULL
      OR professional_preparedness BETWEEN 1 AND 5
    ) NOT VALID,
  ADD CONSTRAINT reviews_greater_clarity_check
    CHECK (
      greater_clarity IS NULL
      OR greater_clarity BETWEEN 1 AND 5
    ) NOT VALID,
  ADD CONSTRAINT reviews_concrete_next_steps_check
    CHECK (
      concrete_next_steps IS NULL
      OR concrete_next_steps BETWEEN 1 AND 5
    ) NOT VALID,
  ADD CONSTRAINT reviews_structured_feedback_complete_check
    CHECK (
      feedback_schema_version = 1
      OR (
        feedback_schema_version = 2
        AND candidate_profile_id IS NOT NULL
        AND professional_profile_id IS NOT NULL
        AND goal_achieved IS NOT NULL
        AND professional_relevance IS NOT NULL
        AND professional_preparedness IS NOT NULL
        AND greater_clarity IS NOT NULL
        AND concrete_next_steps IS NOT NULL
      )
    ) NOT VALID;

ALTER TABLE public.reviews
  VALIDATE CONSTRAINT reviews_feedback_schema_version_check;
ALTER TABLE public.reviews
  VALIDATE CONSTRAINT reviews_goal_achieved_check;
ALTER TABLE public.reviews
  VALIDATE CONSTRAINT reviews_professional_relevance_check;
ALTER TABLE public.reviews
  VALIDATE CONSTRAINT reviews_professional_preparedness_check;
ALTER TABLE public.reviews
  VALIDATE CONSTRAINT reviews_greater_clarity_check;
ALTER TABLE public.reviews
  VALIDATE CONSTRAINT reviews_concrete_next_steps_check;
ALTER TABLE public.reviews
  VALIDATE CONSTRAINT reviews_structured_feedback_complete_check;

COMMENT ON COLUMN public.reviews.feedback_schema_version IS
  'Version 1 identifies legacy ratings. Version 2 requires the complete structured post-session feedback set.';
COMMENT ON COLUMN public.reviews.rating IS
  'The candidate''s overall session experience on a one-to-five scale.';
COMMENT ON COLUMN public.reviews.goal_achieved IS
  'Whether the candidate experienced the session goal as achieved, partly achieved or not achieved.';
COMMENT ON COLUMN public.reviews.professional_relevance IS
  'How relevant the professional was for the candidate''s concrete situation, from one to five.';
COMMENT ON COLUMN public.reviews.professional_preparedness IS
  'How well prepared the professional was, from one to five.';
COMMENT ON COLUMN public.reviews.greater_clarity IS
  'Whether the session gave the candidate greater clarity, from one to five.';
COMMENT ON COLUMN public.reviews.concrete_next_steps IS
  'Whether the candidate left with concrete next steps, from one to five.';

-- Validate the booking relationship in the same transaction as the insert.
-- The share lock prevents the booking from changing status while a review is
-- being attached to it.
CREATE OR REPLACE FUNCTION public.protect_structured_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_candidate_profile_id UUID;
  v_professional_profile_id UUID;
  v_status TEXT;
  v_ends_at TIMESTAMPTZ;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.feedback_schema_version <> 2 THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        MESSAGE = 'new reviews must use structured feedback schema version 2';
    END IF;

    SELECT
      booking.candidate_profile_id,
      booking.professional_profile_id,
      booking.status,
      booking.ends_at
    INTO
      v_candidate_profile_id,
      v_professional_profile_id,
      v_status,
      v_ends_at
    FROM public.bookings AS booking
    WHERE booking.id = NEW.booking_id
    FOR SHARE;

    IF NOT FOUND THEN
      RAISE EXCEPTION USING
        ERRCODE = '23503',
        MESSAGE = 'review booking does not exist';
    END IF;

    IF v_status <> 'completed'
      OR v_ends_at IS NULL
      OR v_ends_at > CURRENT_TIMESTAMP
    THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        MESSAGE = 'reviews require a completed session that has ended';
    END IF;

    IF NEW.candidate_profile_id IS DISTINCT FROM v_candidate_profile_id
      OR NEW.professional_profile_id IS DISTINCT FROM v_professional_profile_id
    THEN
      RAISE EXCEPTION USING
        ERRCODE = '23514',
        MESSAGE = 'review participants must match the booking participants';
    END IF;

    RETURN NEW;
  END IF;

  -- Candidate feedback is an immutable record. Administrative moderation may
  -- only change moderation_status; updated_at is maintained by the database.
  IF ROW(
    NEW.id,
    NEW.booking_id,
    NEW.candidate_profile_id,
    NEW.professional_profile_id,
    NEW.rating,
    NEW.feedback,
    NEW.feedback_schema_version,
    NEW.goal_achieved,
    NEW.professional_relevance,
    NEW.professional_preparedness,
    NEW.greater_clarity,
    NEW.concrete_next_steps,
    NEW.created_at
  ) IS DISTINCT FROM ROW(
    OLD.id,
    OLD.booking_id,
    OLD.candidate_profile_id,
    OLD.professional_profile_id,
    OLD.rating,
    OLD.feedback,
    OLD.feedback_schema_version,
    OLD.goal_achieved,
    OLD.professional_relevance,
    OLD.professional_preparedness,
    OLD.greater_clarity,
    OLD.concrete_next_steps,
    OLD.created_at
  ) THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      MESSAGE = 'submitted review content is immutable';
  END IF;

  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_protect_structured_feedback
  ON public.reviews;
CREATE TRIGGER reviews_protect_structured_feedback
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_structured_review();

REVOKE ALL ON FUNCTION public.protect_structured_review()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.protect_structured_review()
  TO service_role;

-- Review creation is a server-only operation. Public profile aggregates remain
-- available through the existing reviewed public projection; raw review rows,
-- participant identifiers and comments are never exposed directly. Active
-- admins retain RLS-protected read and moderation access.
DROP POLICY IF EXISTS "reviews: candidate insert completed booking"
  ON public.reviews;
DROP POLICY IF EXISTS "reviews: published read"
  ON public.reviews;
DROP POLICY IF EXISTS "reviews: admin select"
  ON public.reviews;
DROP POLICY IF EXISTS "reviews: admin update"
  ON public.reviews;

CREATE POLICY "reviews: admin select"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_admin()));

CREATE POLICY "reviews: admin update"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

REVOKE ALL ON TABLE public.reviews FROM anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.reviews TO authenticated;

CREATE INDEX IF NOT EXISTS reviews_structured_quality_idx
  ON public.reviews (professional_profile_id, created_at DESC)
  WHERE feedback_schema_version = 2;
