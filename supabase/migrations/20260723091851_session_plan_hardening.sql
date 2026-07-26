-- Harden the Session Plan rollout without changing the already-applied core
-- migration. Legacy writers keep their published/version-1 contract, while the
-- version-2 writer opts in explicitly through one atomic service-role RPC.

-- A rolling legacy writer only supplies the original session_outcomes columns.
-- Keep that insert valid by restoring the legacy publication defaults. Version-2
-- callers must explicitly send draft/version 2 and a NULL published_at.
ALTER TABLE public.session_outcomes
  ALTER COLUMN result_status SET DEFAULT 'published',
  ALTER COLUMN result_schema_version SET DEFAULT 1,
  ALTER COLUMN published_at SET DEFAULT NOW();

ALTER TABLE public.session_outcomes
  DROP CONSTRAINT IF EXISTS session_outcomes_publication_state_check;
ALTER TABLE public.session_outcomes
  ADD CONSTRAINT session_outcomes_publication_state_check
  CHECK (
    (
      result_status = 'draft'
      AND result_schema_version = 2
      AND published_at IS NULL
    )
    OR
    (
      result_status = 'published'
      AND published_at IS NOT NULL
      AND summary IS NOT NULL
      AND char_length(btrim(summary)) >= 10
      AND (
        (
          result_schema_version = 1
          AND cardinality(priorities) BETWEEN 1 AND 3
          AND next_action IS NOT NULL
          AND char_length(btrim(next_action)) BETWEEN 3 AND 300
        )
        OR
        (
          result_schema_version = 2
          AND recommendation IS NOT NULL
          AND char_length(btrim(recommendation)) >= 10
          AND definition_of_done_status IS NOT NULL
        )
      )
    )
  )
  NOT VALID;

ALTER TABLE public.session_outcomes
  VALIDATE CONSTRAINT session_outcomes_publication_state_check;

-- Save all version-2 result state under one transaction. The booking lock
-- serialises the no-outcome-yet case; the outcome lock serialises replacements
-- and makes a concurrent caller observe publication before it can replace data.
CREATE OR REPLACE FUNCTION public.save_session_outcome_v2(
  p_booking_id UUID,
  p_key_insights TEXT,
  p_recommendation TEXT,
  p_decisions TEXT[],
  p_definition_of_done_status TEXT,
  p_open_questions TEXT[],
  p_next_moves JSONB,
  p_publish BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_booking_status TEXT;
  v_candidate_profile_id UUID;
  v_professional_profile_id UUID;
  v_outcome_id UUID;
  v_existing_result_status TEXT;
  v_outcome_exists BOOLEAN;
  v_publish BOOLEAN := COALESCE(p_publish, FALSE);
  v_key_insights TEXT := NULLIF(btrim(p_key_insights), '');
  v_recommendation TEXT := NULLIF(btrim(p_recommendation), '');
  v_definition_of_done_status TEXT :=
    NULLIF(btrim(p_definition_of_done_status), '');
  v_decisions TEXT[];
  v_open_questions TEXT[];
  v_next_moves JSONB;
  v_priorities TEXT[];
  v_first_action TEXT;
  v_first_due_at DATE;
  v_move JSONB;
  v_action TEXT;
  v_responsible TEXT;
  v_due_at_text TEXT;
  v_validated_due_at DATE;
BEGIN
  IF p_booking_id IS NULL THEN
    RAISE EXCEPTION 'booking_id is required'
      USING ERRCODE = '22023';
  END IF;

  IF v_key_insights IS NOT NULL
    AND char_length(v_key_insights) > 1000
  THEN
    RAISE EXCEPTION 'key_insights must be at most 1000 characters'
      USING ERRCODE = '22023';
  END IF;

  IF v_recommendation IS NOT NULL
    AND char_length(v_recommendation) > 1200
  THEN
    RAISE EXCEPTION 'recommendation must be at most 1200 characters'
      USING ERRCODE = '22023';
  END IF;

  IF v_definition_of_done_status IS NOT NULL
    AND v_definition_of_done_status NOT IN (
      'achieved',
      'partially_achieved',
      'not_achieved_yet'
    )
  THEN
    RAISE EXCEPTION 'definition_of_done_status is invalid'
      USING ERRCODE = '22023';
  END IF;

  IF COALESCE(cardinality(p_decisions), 0) > 5 THEN
    RAISE EXCEPTION 'decisions must contain at most 5 items'
      USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM unnest(COALESCE(p_decisions, '{}'::TEXT[])) AS decision(value)
    WHERE decision.value IS NULL
      OR char_length(btrim(decision.value)) NOT BETWEEN 1 AND 300
  ) THEN
    RAISE EXCEPTION 'each decision must contain 1 to 300 characters'
      USING ERRCODE = '22023';
  END IF;

  SELECT COALESCE(
    array_agg(btrim(decision.value) ORDER BY decision.position),
    '{}'::TEXT[]
  )
  INTO v_decisions
  FROM unnest(COALESCE(p_decisions, '{}'::TEXT[]))
    WITH ORDINALITY AS decision(value, position);

  IF char_length(array_to_string(v_decisions, '')) > 1500 THEN
    RAISE EXCEPTION 'decisions must contain at most 1500 characters in total'
      USING ERRCODE = '22023';
  END IF;

  IF COALESCE(cardinality(p_open_questions), 0) > 5 THEN
    RAISE EXCEPTION 'open_questions must contain at most 5 items'
      USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM unnest(COALESCE(p_open_questions, '{}'::TEXT[])) AS question(value)
    WHERE question.value IS NULL
      OR char_length(btrim(question.value)) NOT BETWEEN 1 AND 300
  ) THEN
    RAISE EXCEPTION 'each open question must contain 1 to 300 characters'
      USING ERRCODE = '22023';
  END IF;

  SELECT COALESCE(
    array_agg(btrim(question.value) ORDER BY question.position),
    '{}'::TEXT[]
  )
  INTO v_open_questions
  FROM unnest(COALESCE(p_open_questions, '{}'::TEXT[]))
    WITH ORDINALITY AS question(value, position);

  IF char_length(array_to_string(v_open_questions, '')) > 1500 THEN
    RAISE EXCEPTION 'open_questions must contain at most 1500 characters in total'
      USING ERRCODE = '22023';
  END IF;

  v_next_moves := CASE
    WHEN p_next_moves IS NULL OR p_next_moves = 'null'::JSONB
      THEN '[]'::JSONB
    ELSE p_next_moves
  END;

  IF jsonb_typeof(v_next_moves) <> 'array' THEN
    RAISE EXCEPTION 'next_moves must be a JSON array'
      USING ERRCODE = '22023';
  END IF;

  IF jsonb_array_length(v_next_moves) > 3 THEN
    RAISE EXCEPTION 'next_moves must contain at most 3 items'
      USING ERRCODE = '22023';
  END IF;

  FOR v_move IN
    SELECT move.value
    FROM jsonb_array_elements(v_next_moves) AS move(value)
  LOOP
    IF jsonb_typeof(v_move) <> 'object' THEN
      RAISE EXCEPTION 'each next move must be a JSON object'
        USING ERRCODE = '22023';
    END IF;

    IF NOT (v_move ? 'action')
      OR jsonb_typeof(v_move -> 'action') <> 'string'
    THEN
      RAISE EXCEPTION 'each next move requires a string action'
        USING ERRCODE = '22023';
    END IF;

    v_action := btrim(v_move ->> 'action');
    IF char_length(v_action) NOT BETWEEN 3 AND 300 THEN
      RAISE EXCEPTION 'each next move action must contain 3 to 300 characters'
        USING ERRCODE = '22023';
    END IF;

    IF v_move ? 'responsible'
      AND v_move -> 'responsible' <> 'null'::JSONB
      AND jsonb_typeof(v_move -> 'responsible') <> 'string'
    THEN
      RAISE EXCEPTION 'next move responsible must be a string'
        USING ERRCODE = '22023';
    END IF;

    v_responsible := COALESCE(
      NULLIF(btrim(v_move ->> 'responsible'), ''),
      'candidate'
    );
    IF v_responsible NOT IN ('candidate', 'professional', 'shared') THEN
      RAISE EXCEPTION 'next move responsible is invalid'
        USING ERRCODE = '22023';
    END IF;

    IF v_move ? 'due_at'
      AND v_move -> 'due_at' <> 'null'::JSONB
      AND jsonb_typeof(v_move -> 'due_at') <> 'string'
    THEN
      RAISE EXCEPTION 'next move due_at must be an ISO date string or null'
        USING ERRCODE = '22023';
    END IF;

    v_due_at_text := NULLIF(btrim(v_move ->> 'due_at'), '');
    IF v_due_at_text IS NOT NULL THEN
      IF v_due_at_text !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN
        RAISE EXCEPTION 'next move due_at must use YYYY-MM-DD'
          USING ERRCODE = '22023';
      END IF;

      BEGIN
        v_validated_due_at := v_due_at_text::DATE;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE EXCEPTION 'next move due_at is not a valid date'
            USING ERRCODE = '22023';
      END;
    END IF;
  END LOOP;

  IF v_publish
    AND (
      v_key_insights IS NULL
      OR char_length(v_key_insights) < 10
    )
  THEN
    RAISE EXCEPTION 'publishing requires at least 10 characters of key insights'
      USING ERRCODE = '22023';
  END IF;

  IF v_publish
    AND (
      v_recommendation IS NULL
      OR char_length(v_recommendation) < 10
    )
  THEN
    RAISE EXCEPTION 'publishing requires at least 10 characters of recommendation'
      USING ERRCODE = '22023';
  END IF;

  IF v_publish AND v_definition_of_done_status IS NULL THEN
    RAISE EXCEPTION 'publishing requires definition_of_done_status'
      USING ERRCODE = '22023';
  END IF;

  IF v_publish AND jsonb_array_length(v_next_moves) = 0 THEN
    RAISE EXCEPTION 'publishing requires at least one next move'
      USING ERRCODE = '22023';
  END IF;

  SELECT
    booking.status,
    booking.candidate_profile_id,
    booking.professional_profile_id
  INTO
    v_booking_status,
    v_candidate_profile_id,
    v_professional_profile_id
  FROM public.bookings AS booking
  WHERE booking.id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF v_booking_status <> 'completed' THEN
    RAISE EXCEPTION 'booking must be completed before saving an outcome'
      USING ERRCODE = '55000';
  END IF;

  IF v_candidate_profile_id IS NULL
    OR v_professional_profile_id IS NULL
  THEN
    RAISE EXCEPTION 'booking participants are incomplete'
      USING ERRCODE = '55000';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles AS candidate
    WHERE candidate.id = v_candidate_profile_id
      AND candidate.status = 'active'
  ) THEN
    RAISE EXCEPTION 'candidate profile is not active'
      USING ERRCODE = '55000';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.professional_profiles AS professional
    JOIN public.profiles AS owner
      ON owner.id = professional.profile_id
    WHERE professional.id = v_professional_profile_id
      AND owner.status = 'active'
  ) THEN
    RAISE EXCEPTION 'professional owner profile is not active'
      USING ERRCODE = '55000';
  END IF;

  SELECT
    outcome.id,
    outcome.result_status
  INTO
    v_outcome_id,
    v_existing_result_status
  FROM public.session_outcomes AS outcome
  WHERE outcome.booking_id = p_booking_id
  FOR UPDATE;

  v_outcome_exists := FOUND;

  IF v_outcome_exists
    AND v_existing_result_status = 'published'
  THEN
    RAISE EXCEPTION 'published outcomes cannot be replaced'
      USING ERRCODE = '55000';
  END IF;

  SELECT COALESCE(
    array_agg(btrim(move.value ->> 'action') ORDER BY move.position),
    '{}'::TEXT[]
  )
  INTO v_priorities
  FROM jsonb_array_elements(v_next_moves)
    WITH ORDINALITY AS move(value, position);

  v_first_action := NULLIF(
    btrim(v_next_moves -> 0 ->> 'action'),
    ''
  );
  v_first_due_at := NULLIF(
    btrim(v_next_moves -> 0 ->> 'due_at'),
    ''
  )::DATE;

  IF v_outcome_exists THEN
    UPDATE public.session_outcomes
    SET
      candidate_profile_id = v_candidate_profile_id,
      professional_profile_id = v_professional_profile_id,
      summary = v_key_insights,
      priorities = v_priorities,
      next_action = v_first_action,
      next_action_due_at = v_first_due_at,
      candidate_completed_at = NULL,
      recommendation = v_recommendation,
      decisions = v_decisions,
      definition_of_done_status = v_definition_of_done_status,
      open_questions = v_open_questions,
      result_status = 'draft',
      result_schema_version = 2,
      published_at = NULL
    WHERE id = v_outcome_id
      AND result_status = 'draft';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'outcome was published by another transaction'
        USING ERRCODE = '55000';
    END IF;
  ELSE
    INSERT INTO public.session_outcomes (
      booking_id,
      candidate_profile_id,
      professional_profile_id,
      summary,
      priorities,
      next_action,
      next_action_due_at,
      candidate_completed_at,
      recommendation,
      decisions,
      definition_of_done_status,
      open_questions,
      result_status,
      result_schema_version,
      published_at
    )
    VALUES (
      p_booking_id,
      v_candidate_profile_id,
      v_professional_profile_id,
      v_key_insights,
      v_priorities,
      v_first_action,
      v_first_due_at,
      NULL,
      v_recommendation,
      v_decisions,
      v_definition_of_done_status,
      v_open_questions,
      'draft',
      2,
      NULL
    )
    RETURNING id INTO v_outcome_id;
  END IF;

  DELETE FROM public.session_plan_next_moves
  WHERE session_outcome_id = v_outcome_id;

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
    v_outcome_id,
    move.position::SMALLINT,
    btrim(move.value ->> 'action'),
    COALESCE(
      NULLIF(btrim(move.value ->> 'responsible'), ''),
      'candidate'
    ),
    NULLIF(btrim(move.value ->> 'due_at'), '')::DATE,
    'pending',
    NULL
  FROM jsonb_array_elements(v_next_moves)
    WITH ORDINALITY AS move(value, position)
  ORDER BY move.position;

  IF v_publish THEN
    UPDATE public.session_outcomes
    SET
      result_status = 'published',
      published_at = NOW()
    WHERE id = v_outcome_id
      AND result_status = 'draft';

    IF NOT FOUND THEN
      RAISE EXCEPTION 'outcome was published by another transaction'
        USING ERRCODE = '55000';
    END IF;
  END IF;

  RETURN v_outcome_id;
END;
$$;

COMMENT ON FUNCTION public.save_session_outcome_v2(
  UUID,
  TEXT,
  TEXT,
  TEXT[],
  TEXT,
  TEXT[],
  JSONB,
  BOOLEAN
) IS
  'Atomically saves a version-2 outcome and up to three pending Next Moves; optionally publishes once.';

REVOKE ALL
  ON FUNCTION public.save_session_outcome_v2(
    UUID,
    TEXT,
    TEXT,
    TEXT[],
    TEXT,
    TEXT[],
    JSONB,
    BOOLEAN
  )
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE
  ON FUNCTION public.save_session_outcome_v2(
    UUID,
    TEXT,
    TEXT,
    TEXT[],
    TEXT,
    TEXT[],
    JSONB,
    BOOLEAN
  )
  TO service_role;

-- Keep the legacy candidate completion timestamp in sync when the candidate
-- completes or reopens the first normalised move. The DISTINCT predicates and
-- trigger WHEN clause stop the existing forward-compatibility trigger from
-- bouncing an unchanged value back indefinitely.
CREATE OR REPLACE FUNCTION public.sync_candidate_next_move_completion_to_legacy()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_candidate_completed_at TIMESTAMPTZ;
BEGIN
  v_candidate_completed_at := CASE
    WHEN NEW.status = 'completed' THEN NEW.completed_at
    ELSE NULL
  END;

  UPDATE public.session_outcomes
  SET candidate_completed_at = v_candidate_completed_at
  WHERE id = NEW.session_outcome_id
    AND result_status = 'published'
    AND candidate_completed_at IS DISTINCT FROM v_candidate_completed_at;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS session_plan_next_moves_sync_candidate_completion
  ON public.session_plan_next_moves;
CREATE TRIGGER session_plan_next_moves_sync_candidate_completion
  AFTER UPDATE OF status, completed_at
  ON public.session_plan_next_moves
  FOR EACH ROW
  WHEN (
    NEW.position = 1
    AND NEW.responsible IN ('candidate', 'shared')
    AND (
      OLD.status IS DISTINCT FROM NEW.status
      OR OLD.completed_at IS DISTINCT FROM NEW.completed_at
    )
  )
  EXECUTE FUNCTION public.sync_candidate_next_move_completion_to_legacy();

REVOKE ALL
  ON FUNCTION public.sync_candidate_next_move_completion_to_legacy()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE
  ON FUNCTION public.sync_candidate_next_move_completion_to_legacy()
  TO service_role;

-- Replace every Session Plan read policy introduced by the core migration.
-- Each participant must own an active profile. Private professional notes keep
-- their professional-only boundary.
DROP POLICY IF EXISTS "session_plans: participants select"
  ON public.session_plans;
CREATE POLICY "session_plans: participants select"
  ON public.session_plans
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings AS booking
      JOIN public.profiles AS candidate
        ON candidate.id = booking.candidate_profile_id
      WHERE booking.id = session_plans.booking_id
        AND candidate.auth_user_id = (SELECT auth.uid())
        AND candidate.status = 'active'
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.bookings AS booking
      JOIN public.professional_profiles AS professional
        ON professional.id = booking.professional_profile_id
      JOIN public.profiles AS owner
        ON owner.id = professional.profile_id
      WHERE booking.id = session_plans.booking_id
        AND owner.auth_user_id = (SELECT auth.uid())
        AND owner.status = 'active'
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
      FROM public.bookings AS booking
      JOIN public.professional_profiles AS professional
        ON professional.id = booking.professional_profile_id
      JOIN public.profiles AS owner
        ON owner.id = professional.profile_id
      WHERE booking.id = professional_session_notes.booking_id
        AND owner.auth_user_id = (SELECT auth.uid())
        AND owner.status = 'active'
    )
  );

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
        FROM public.profiles AS candidate
        WHERE candidate.id = session_outcomes.candidate_profile_id
          AND candidate.auth_user_id = (SELECT auth.uid())
          AND candidate.status = 'active'
      )
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.professional_profiles AS professional
      JOIN public.profiles AS owner
        ON owner.id = professional.profile_id
      WHERE professional.id = session_outcomes.professional_profile_id
        AND owner.auth_user_id = (SELECT auth.uid())
        AND owner.status = 'active'
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
      FROM public.session_outcomes AS outcome
      JOIN public.professional_profiles AS professional
        ON professional.id = outcome.professional_profile_id
      JOIN public.profiles AS owner
        ON owner.id = professional.profile_id
      WHERE outcome.id = session_plan_next_moves.session_outcome_id
        AND owner.auth_user_id = (SELECT auth.uid())
        AND owner.status = 'active'
    )
    OR
    EXISTS (
      SELECT 1
      FROM public.session_outcomes AS outcome
      JOIN public.profiles AS candidate
        ON candidate.id = outcome.candidate_profile_id
      WHERE outcome.id = session_plan_next_moves.session_outcome_id
        AND outcome.result_status = 'published'
        AND candidate.auth_user_id = (SELECT auth.uid())
        AND candidate.status = 'active'
    )
  );
