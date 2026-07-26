-- Make Session Plan the structured product around every booking while keeping
-- candidate preparation, professional-only notes and unpublished result drafts
-- in separate RLS boundaries.
--
-- This is an expand-first migration. Existing booking and outcome APIs remain
-- valid while the application moves to the richer Session Plan contract.

CREATE TABLE IF NOT EXISTS public.session_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  problem TEXT,
  context TEXT,
  desired_outcome TEXT,
  definition_of_done TEXT,
  key_questions TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  anything_else TEXT,
  preparation_status TEXT NOT NULL DEFAULT 'draft',
  prepared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT session_plans_problem_length_check
    CHECK (problem IS NULL OR char_length(problem) <= 1200),
  CONSTRAINT session_plans_context_length_check
    CHECK (context IS NULL OR char_length(context) <= 2000),
  CONSTRAINT session_plans_desired_outcome_length_check
    CHECK (desired_outcome IS NULL OR char_length(desired_outcome) <= 1000),
  CONSTRAINT session_plans_definition_of_done_length_check
    CHECK (definition_of_done IS NULL OR char_length(definition_of_done) <= 600),
  CONSTRAINT session_plans_key_questions_count_check
    CHECK (cardinality(key_questions) <= 5),
  CONSTRAINT session_plans_key_questions_length_check
    CHECK (char_length(array_to_string(key_questions, '')) <= 1500),
  CONSTRAINT session_plans_anything_else_length_check
    CHECK (anything_else IS NULL OR char_length(anything_else) <= 1000),
  CONSTRAINT session_plans_preparation_status_check
    CHECK (preparation_status IN ('draft', 'ready')),
  CONSTRAINT session_plans_ready_state_check
    CHECK (
      (
        preparation_status = 'draft'
        AND prepared_at IS NULL
      )
      OR
      (
        preparation_status = 'ready'
        AND prepared_at IS NOT NULL
        AND problem IS NOT NULL
        AND char_length(btrim(problem)) >= 10
        AND desired_outcome IS NOT NULL
        AND char_length(btrim(desired_outcome)) >= 10
        AND definition_of_done IS NOT NULL
        AND char_length(btrim(definition_of_done)) >= 5
      )
    )
);

COMMENT ON TABLE public.session_plans IS
  'Candidate preparation for one booked session. Shared only with the booked professional.';
COMMENT ON COLUMN public.session_plans.problem IS
  'The concrete challenge, decision or situation the candidate wants help with.';
COMMENT ON COLUMN public.session_plans.desired_outcome IS
  'What the candidate wants to understand, decide, improve or be able to do after the session.';
COMMENT ON COLUMN public.session_plans.definition_of_done IS
  'The candidate''s concrete definition of a valuable session.';

-- Existing booking goals are the closest trustworthy source for the desired
-- outcome. Do not infer the remaining reflection fields.
INSERT INTO public.session_plans (booking_id, desired_outcome)
SELECT
  booking.id,
  NULLIF(btrim(booking.goal), '')
FROM public.bookings booking
WHERE booking.candidate_profile_id IS NOT NULL
  AND booking.professional_profile_id IS NOT NULL
ON CONFLICT (booking_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.create_session_plan_for_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF NEW.candidate_profile_id IS NOT NULL
    AND NEW.professional_profile_id IS NOT NULL
  THEN
    INSERT INTO public.session_plans (booking_id, desired_outcome)
    VALUES (NEW.id, NULLIF(btrim(NEW.goal), ''))
    ON CONFLICT (booking_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_create_session_plan ON public.bookings;
CREATE TRIGGER bookings_create_session_plan
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.create_session_plan_for_booking();

-- Private notes are intentionally not stored on session_plans. A candidate
-- with access to the shared plan must never be able to select these columns.
CREATE TABLE IF NOT EXISTS public.professional_session_notes (
  booking_id UUID PRIMARY KEY REFERENCES public.bookings(id) ON DELETE CASCADE,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT professional_session_notes_length_check
    CHECK (char_length(note) <= 2000)
);

COMMENT ON TABLE public.professional_session_notes IS
  'Short preparation notes visible only to the professional booked for the session.';

-- The existing table remains the canonical post-session result. Relax only
-- the legacy fields that prevented autosaved drafts, then add the structured
-- result fields. Existing rows are version 1 and remain published; new rows
-- default to version 2 drafts.
ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_summary_check;
ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_priorities_check;
ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_next_action_check;

ALTER TABLE public.session_outcomes
  ALTER COLUMN summary DROP NOT NULL,
  ALTER COLUMN next_action DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS recommendation TEXT,
  ADD COLUMN IF NOT EXISTS decisions TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS definition_of_done_status TEXT,
  ADD COLUMN IF NOT EXISTS open_questions TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS result_status TEXT,
  ADD COLUMN IF NOT EXISTS result_schema_version SMALLINT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Every pre-migration outcome was only created after a completed session and
-- therefore represented a delivered result. Keep it visible without inventing
-- a Definition of Done assessment that was never collected.
UPDATE public.session_outcomes
SET
  recommendation = COALESCE(
    CASE
      WHEN char_length(btrim(recommendation)) >= 10
        THEN btrim(recommendation)
    END,
    CASE
      WHEN char_length(btrim(next_action)) >= 10
        THEN btrim(next_action)
    END,
    NULLIF(btrim(summary), '')
  ),
  result_status = COALESCE(result_status, 'published'),
  result_schema_version = COALESCE(result_schema_version, 1),
  published_at = COALESCE(published_at, updated_at, created_at)
WHERE result_status IS NULL
  OR result_schema_version IS NULL
  OR recommendation IS NULL
  OR published_at IS NULL;

ALTER TABLE public.session_outcomes
  ALTER COLUMN result_status SET DEFAULT 'draft',
  ALTER COLUMN result_status SET NOT NULL,
  ALTER COLUMN result_schema_version SET DEFAULT 2,
  ALTER COLUMN result_schema_version SET NOT NULL;

ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_summary_check
  CHECK (
    summary IS NULL
    OR char_length(summary) <= 1000
  );

ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_priorities_check
  CHECK (cardinality(priorities) <= 3);

ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_next_action_check
  CHECK (
    next_action IS NULL
    OR char_length(btrim(next_action)) BETWEEN 3 AND 300
  );

ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_recommendation_check;
ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_recommendation_check
  CHECK (
    recommendation IS NULL
    OR char_length(recommendation) <= 1200
  );

ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_decisions_count_check;
ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_decisions_count_check
  CHECK (
    cardinality(decisions) <= 5
    AND char_length(array_to_string(decisions, '')) <= 1500
  );

ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_definition_of_done_status_check;
ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_definition_of_done_status_check
  CHECK (
    definition_of_done_status IS NULL
    OR definition_of_done_status IN (
      'achieved',
      'partially_achieved',
      'not_achieved_yet'
    )
  );

ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_open_questions_count_check;
ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_open_questions_count_check
  CHECK (
    cardinality(open_questions) <= 5
    AND char_length(array_to_string(open_questions, '')) <= 1500
  );

ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_result_status_check;
ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_result_status_check
  CHECK (result_status IN ('draft', 'published'));

ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_result_schema_version_check;
ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_result_schema_version_check
  CHECK (result_schema_version IN (1, 2));

ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_publication_state_check;
ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_publication_state_check
  CHECK (
    (
      result_status = 'draft'
      AND published_at IS NULL
    )
    OR
    (
      result_status = 'published'
      AND published_at IS NOT NULL
      AND summary IS NOT NULL
      AND char_length(btrim(summary)) >= 10
      AND recommendation IS NOT NULL
      AND char_length(btrim(recommendation)) >= 10
      AND (
        result_schema_version = 1
        OR definition_of_done_status IS NOT NULL
      )
    )
  );

COMMENT ON COLUMN public.session_outcomes.summary IS
  'Key Insights from the completed session. Nullable while a result is being drafted.';
COMMENT ON COLUMN public.session_outcomes.recommendation IS
  'The professional''s clear and action-oriented recommendation.';
COMMENT ON COLUMN public.session_outcomes.result_status IS
  'Draft results are professional-only. Published results are shared with the candidate.';
COMMENT ON COLUMN public.session_outcomes.result_schema_version IS
  'Version 1 preserves legacy outcomes; version 2 requires a Definition of Done assessment before publication.';

CREATE TABLE IF NOT EXISTS public.session_plan_next_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_outcome_id UUID NOT NULL REFERENCES public.session_outcomes(id) ON DELETE CASCADE,
  position SMALLINT NOT NULL,
  action TEXT NOT NULL,
  responsible TEXT NOT NULL DEFAULT 'candidate',
  due_at DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT session_plan_next_moves_position_check
    CHECK (position BETWEEN 1 AND 3),
  CONSTRAINT session_plan_next_moves_action_check
    CHECK (char_length(btrim(action)) BETWEEN 3 AND 300),
  CONSTRAINT session_plan_next_moves_responsible_check
    CHECK (responsible IN ('candidate', 'professional', 'shared')),
  CONSTRAINT session_plan_next_moves_status_check
    CHECK (status IN ('pending', 'completed')),
  CONSTRAINT session_plan_next_moves_completion_state_check
    CHECK (
      (status = 'pending' AND completed_at IS NULL)
      OR
      (status = 'completed' AND completed_at IS NOT NULL)
    ),
  UNIQUE (session_outcome_id, position)
);

COMMENT ON TABLE public.session_plan_next_moves IS
  'At most three prioritised actions attached to a draft or published session result.';

-- Preserve the old single next action as the first normalised Next Move.
INSERT INTO public.session_plan_next_moves (
  session_outcome_id,
  position,
  action,
  responsible,
  due_at,
  status,
  completed_at
)
SELECT
  outcome.id,
  1,
  outcome.next_action,
  'candidate',
  outcome.next_action_due_at,
  CASE
    WHEN outcome.candidate_completed_at IS NOT NULL THEN 'completed'
    ELSE 'pending'
  END,
  outcome.candidate_completed_at
FROM public.session_outcomes outcome
WHERE outcome.next_action IS NOT NULL
  AND char_length(btrim(outcome.next_action)) >= 3
ON CONFLICT (session_outcome_id, position) DO NOTHING;

-- During the expand/contract window, keep writes from the existing outcome API
-- represented in the new Next Move table. The new API can stop writing the
-- legacy columns without affecting this trigger.
CREATE OR REPLACE FUNCTION public.sync_legacy_session_outcome_next_move()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF NEW.next_action IS NULL
    OR char_length(btrim(NEW.next_action)) < 3
  THEN
    DELETE FROM public.session_plan_next_moves
    WHERE session_outcome_id = NEW.id
      AND position = 1;
  ELSE
    INSERT INTO public.session_plan_next_moves (
      session_outcome_id,
      position,
      action,
      responsible,
      due_at,
      status,
      completed_at
    )
    VALUES (
      NEW.id,
      1,
      NEW.next_action,
      'candidate',
      NEW.next_action_due_at,
      CASE
        WHEN NEW.candidate_completed_at IS NOT NULL THEN 'completed'
        ELSE 'pending'
      END,
      NEW.candidate_completed_at
    )
    ON CONFLICT (session_outcome_id, position)
    DO UPDATE SET
      action = EXCLUDED.action,
      responsible = EXCLUDED.responsible,
      due_at = EXCLUDED.due_at,
      status = EXCLUDED.status,
      completed_at = EXCLUDED.completed_at,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS session_outcomes_sync_legacy_next_move
  ON public.session_outcomes;
CREATE TRIGGER session_outcomes_sync_legacy_next_move
  AFTER INSERT OR UPDATE OF
    next_action,
    next_action_due_at,
    candidate_completed_at
  ON public.session_outcomes
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_legacy_session_outcome_next_move();

CREATE INDEX IF NOT EXISTS session_outcomes_professional_result_status_idx
  ON public.session_outcomes (
    professional_profile_id,
    result_status,
    updated_at DESC
  );

-- Reuse the existing updated_at function rather than introducing a parallel
-- timestamp mechanism.
DROP TRIGGER IF EXISTS session_plans_updated_at ON public.session_plans;
CREATE TRIGGER session_plans_updated_at
  BEFORE UPDATE ON public.session_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS professional_session_notes_updated_at
  ON public.professional_session_notes;
CREATE TRIGGER professional_session_notes_updated_at
  BEFORE UPDATE ON public.professional_session_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS session_plan_next_moves_updated_at
  ON public.session_plan_next_moves;
CREATE TRIGGER session_plan_next_moves_updated_at
  BEFORE UPDATE ON public.session_plan_next_moves
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.session_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_plan_next_moves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "session_plans: participants select"
  ON public.session_plans;
CREATE POLICY "session_plans: participants select"
  ON public.session_plans
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings booking
      JOIN public.profiles candidate
        ON candidate.id = booking.candidate_profile_id
      WHERE booking.id = session_plans.booking_id
        AND candidate.auth_user_id = (SELECT auth.uid())
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.bookings booking
      JOIN public.professional_profiles professional
        ON professional.id = booking.professional_profile_id
      JOIN public.profiles owner
        ON owner.id = professional.profile_id
      WHERE booking.id = session_plans.booking_id
        AND owner.auth_user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "professional_session_notes: professional select"
  ON public.professional_session_notes;
CREATE POLICY "professional_session_notes: professional select"
  ON public.professional_session_notes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings booking
      JOIN public.professional_profiles professional
        ON professional.id = booking.professional_profile_id
      JOIN public.profiles owner
        ON owner.id = professional.profile_id
      WHERE booking.id = professional_session_notes.booking_id
        AND owner.auth_user_id = (SELECT auth.uid())
    )
  );

-- Replace the former shared-read policy. A candidate can only read a
-- published result; its professional can also read an autosaved draft.
DROP POLICY IF EXISTS "session_outcomes: participant select"
  ON public.session_outcomes;
DROP POLICY IF EXISTS "session_outcomes: result access"
  ON public.session_outcomes;
CREATE POLICY "session_outcomes: result access"
  ON public.session_outcomes
  FOR SELECT
  TO authenticated
  USING (
    (
      result_status = 'published'
      AND EXISTS (
        SELECT 1
        FROM public.profiles candidate
        WHERE candidate.id = session_outcomes.candidate_profile_id
          AND candidate.auth_user_id = (SELECT auth.uid())
      )
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.professional_profiles professional
      JOIN public.profiles owner
        ON owner.id = professional.profile_id
      WHERE professional.id = session_outcomes.professional_profile_id
        AND owner.auth_user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "session_plan_next_moves: result access"
  ON public.session_plan_next_moves;
CREATE POLICY "session_plan_next_moves: result access"
  ON public.session_plan_next_moves
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.session_outcomes outcome
      JOIN public.professional_profiles professional
        ON professional.id = outcome.professional_profile_id
      JOIN public.profiles owner
        ON owner.id = professional.profile_id
      WHERE outcome.id = session_plan_next_moves.session_outcome_id
        AND owner.auth_user_id = (SELECT auth.uid())
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.session_outcomes outcome
      JOIN public.profiles candidate
        ON candidate.id = outcome.candidate_profile_id
      WHERE outcome.id = session_plan_next_moves.session_outcome_id
        AND outcome.result_status = 'published'
        AND candidate.auth_user_id = (SELECT auth.uid())
    )
  );

-- All mutations go through authenticated Next.js server routes that validate
-- the booking participant and lifecycle state before using service_role.
-- Authenticated clients receive read-only Data API access enforced by RLS.
REVOKE ALL PRIVILEGES
  ON TABLE public.session_plans
  FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES
  ON TABLE public.professional_session_notes
  FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES
  ON TABLE public.session_plan_next_moves
  FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES
  ON TABLE public.session_outcomes
  FROM PUBLIC, anon, authenticated;

GRANT SELECT
  ON TABLE public.session_plans
  TO authenticated;
GRANT SELECT
  ON TABLE public.professional_session_notes
  TO authenticated;
GRANT SELECT
  ON TABLE public.session_plan_next_moves
  TO authenticated;
GRANT SELECT
  ON TABLE public.session_outcomes
  TO authenticated;

GRANT ALL PRIVILEGES
  ON TABLE public.session_plans
  TO service_role;
GRANT ALL PRIVILEGES
  ON TABLE public.professional_session_notes
  TO service_role;
GRANT ALL PRIVILEGES
  ON TABLE public.session_plan_next_moves
  TO service_role;
GRANT ALL PRIVILEGES
  ON TABLE public.session_outcomes
  TO service_role;

REVOKE ALL
  ON FUNCTION public.create_session_plan_for_booking()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE
  ON FUNCTION public.create_session_plan_for_booking()
  TO service_role;

REVOKE ALL
  ON FUNCTION public.sync_legacy_session_outcome_next_move()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE
  ON FUNCTION public.sync_legacy_session_outcome_next_move()
  TO service_role;
