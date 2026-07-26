-- Close the remaining outcome write races in this forward-only migration
-- without mutating either of the
-- already-applied Session Plan migrations.

-- Keep the existing, fully validated version-2 implementation as an internal
-- implementation detail. The public RPC below owns the revision check and row
-- locks. Supabase's Data API only exposes configured schemas, so this function
-- cannot be called through the normal public RPC surface.
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

ALTER FUNCTION public.save_session_outcome_v2(
  UUID,
  TEXT,
  TEXT,
  TEXT[],
  TEXT,
  TEXT[],
  JSONB,
  BOOLEAN
)
RENAME TO save_session_outcome_v2_unchecked;

ALTER FUNCTION public.save_session_outcome_v2_unchecked(
  UUID,
  TEXT,
  TEXT,
  TEXT[],
  TEXT,
  TEXT[],
  JSONB,
  BOOLEAN
)
SET SCHEMA private;

REVOKE ALL
  ON FUNCTION private.save_session_outcome_v2_unchecked(
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
  ON FUNCTION private.save_session_outcome_v2_unchecked(
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

-- A NULL expected revision is valid only while no outcome exists. Keeping the
-- new argument optional lets a rolling old server create the initial draft,
-- but it cannot overwrite an existing draft without an explicit revision.
CREATE FUNCTION public.save_session_outcome_v2(
  p_booking_id UUID,
  p_key_insights TEXT,
  p_recommendation TEXT,
  p_decisions TEXT[],
  p_definition_of_done_status TEXT,
  p_open_questions TEXT[],
  p_next_moves JSONB,
  p_publish BOOLEAN DEFAULT FALSE,
  p_expected_updated_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_outcome_exists BOOLEAN;
  v_existing_result_status TEXT;
  v_existing_result_schema_version SMALLINT;
  v_existing_updated_at TIMESTAMPTZ;
BEGIN
  IF p_booking_id IS NULL THEN
    RAISE EXCEPTION 'booking_id is required'
      USING ERRCODE = '22023';
  END IF;

  -- This is also the shared no-outcome-yet lock used by both outcome writers.
  PERFORM 1
  FROM public.bookings AS booking
  WHERE booking.id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking was not found'
      USING ERRCODE = 'P0002';
  END IF;

  SELECT
    outcome.result_status,
    outcome.result_schema_version,
    outcome.updated_at
  INTO
    v_existing_result_status,
    v_existing_result_schema_version,
    v_existing_updated_at
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

  IF v_outcome_exists
    AND v_existing_result_schema_version IS DISTINCT FROM 2
  THEN
    RAISE EXCEPTION 'legacy outcomes cannot be replaced by the version-2 writer'
      USING ERRCODE = '55000';
  END IF;

  IF v_outcome_exists
    AND (
      p_expected_updated_at IS NULL
      OR v_existing_updated_at IS DISTINCT FROM p_expected_updated_at
    )
  THEN
    RAISE EXCEPTION 'outcome revision is stale'
      USING ERRCODE = '55000';
  END IF;

  IF NOT v_outcome_exists
    AND p_expected_updated_at IS NOT NULL
  THEN
    RAISE EXCEPTION 'outcome revision is stale'
      USING ERRCODE = '55000';
  END IF;

  RETURN private.save_session_outcome_v2_unchecked(
    p_booking_id,
    p_key_insights,
    p_recommendation,
    p_decisions,
    p_definition_of_done_status,
    p_open_questions,
    p_next_moves,
    p_publish
  );
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
  BOOLEAN,
  TIMESTAMPTZ
) IS
  'Atomically saves a version-2 outcome only when expected_updated_at matches; NULL is reserved for the first draft.';

REVOKE ALL
  ON FUNCTION public.save_session_outcome_v2(
    UUID,
    TEXT,
    TEXT,
    TEXT[],
    TEXT,
    TEXT[],
    JSONB,
    BOOLEAN,
    TIMESTAMPTZ
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
    BOOLEAN,
    TIMESTAMPTZ
  )
  TO service_role;

-- The rolling legacy API gets its own atomic update path for already-existing
-- version-1 results. It cannot create a new legacy result after launch, and a
-- version-2 draft or published result is immutable from this contract.
CREATE FUNCTION public.save_session_outcome_v1(
  p_booking_id UUID,
  p_summary TEXT,
  p_priorities TEXT[],
  p_next_action TEXT,
  p_next_action_due_at DATE
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
  v_existing_result_schema_version SMALLINT;
  v_summary TEXT := NULLIF(btrim(p_summary), '');
  v_priorities TEXT[];
  v_next_action TEXT := NULLIF(btrim(p_next_action), '');
BEGIN
  IF p_booking_id IS NULL THEN
    RAISE EXCEPTION 'booking_id is required'
      USING ERRCODE = '22023';
  END IF;

  IF v_summary IS NULL
    OR char_length(v_summary) NOT BETWEEN 10 AND 1000
  THEN
    RAISE EXCEPTION 'summary must contain 10 to 1000 characters'
      USING ERRCODE = '22023';
  END IF;

  IF COALESCE(cardinality(p_priorities), 0) NOT BETWEEN 1 AND 3 THEN
    RAISE EXCEPTION 'priorities must contain 1 to 3 items'
      USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM unnest(COALESCE(p_priorities, '{}'::TEXT[])) AS priority(value)
    WHERE priority.value IS NULL
      OR char_length(btrim(priority.value)) NOT BETWEEN 2 AND 240
  ) THEN
    RAISE EXCEPTION 'each priority must contain 2 to 240 characters'
      USING ERRCODE = '22023';
  END IF;

  SELECT array_agg(btrim(priority.value) ORDER BY priority.position)
  INTO v_priorities
  FROM unnest(p_priorities)
    WITH ORDINALITY AS priority(value, position);

  IF v_next_action IS NULL
    OR char_length(v_next_action) NOT BETWEEN 3 AND 300
  THEN
    RAISE EXCEPTION 'next_action must contain 3 to 300 characters'
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
    outcome.result_status,
    outcome.result_schema_version
  INTO
    v_outcome_id,
    v_existing_result_status,
    v_existing_result_schema_version
  FROM public.session_outcomes AS outcome
  WHERE outcome.booking_id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'legacy outcome does not exist; use Session Plan'
      USING ERRCODE = '55000';
  END IF;

  IF v_existing_result_schema_version IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'version-2 outcomes cannot be replaced by the legacy writer'
      USING ERRCODE = '55000';
  END IF;

  IF v_existing_result_status IS DISTINCT FROM 'published' THEN
    RAISE EXCEPTION 'legacy outcomes must remain published'
      USING ERRCODE = '55000';
  END IF;

  UPDATE public.session_outcomes
  SET
    candidate_profile_id = v_candidate_profile_id,
    professional_profile_id = v_professional_profile_id,
    summary = v_summary,
    priorities = v_priorities,
    next_action = v_next_action,
    next_action_due_at = p_next_action_due_at,
    recommendation = v_summary,
    result_status = 'published',
    result_schema_version = 1,
    published_at = COALESCE(published_at, NOW())
  WHERE id = v_outcome_id
    AND result_schema_version = 1
    AND result_status = 'published';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'legacy outcome changed during save'
      USING ERRCODE = '55000';
  END IF;

  RETURN v_outcome_id;
END;
$$;

COMMENT ON FUNCTION public.save_session_outcome_v1(
  UUID,
  TEXT,
  TEXT[],
  TEXT,
  DATE
) IS
  'Atomically revises an existing published version-1 outcome without creating legacy results or replacing version 2.';

REVOKE ALL
  ON FUNCTION public.save_session_outcome_v1(
    UUID,
    TEXT,
    TEXT[],
    TEXT,
    DATE
  )
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE
  ON FUNCTION public.save_session_outcome_v1(
    UUID,
    TEXT,
    TEXT[],
    TEXT,
    DATE
  )
  TO service_role;

-- The compatibility projection belongs exclusively to version 1. Version-2
-- updates (including completion timestamps synced back from a normalised move)
-- must never rewrite the move's responsible party or any other move state.
CREATE OR REPLACE FUNCTION public.sync_legacy_session_outcome_next_move()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF NEW.result_schema_version IS DISTINCT FROM 1 THEN
    RETURN NEW;
  END IF;

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

COMMENT ON FUNCTION public.sync_legacy_session_outcome_next_move() IS
  'Projects only version-1 legacy outcome fields into the first normalised Next Move.';

REVOKE ALL
  ON FUNCTION public.sync_legacy_session_outcome_next_move()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE
  ON FUNCTION public.sync_legacy_session_outcome_next_move()
  TO service_role;
