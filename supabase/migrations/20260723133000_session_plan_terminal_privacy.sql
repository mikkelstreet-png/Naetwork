-- A professional only needs the candidate's Session Plan while the booking is
-- active, completed, or under dispute. Cancelled, refunded and no-show
-- bookings must not keep exposing candidate preparation through the Data API.

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
        AND booking.status IN ('requested', 'pending', 'confirmed', 'rescheduled', 'completed', 'disputed')
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
        AND booking.status IN ('requested', 'pending', 'confirmed', 'rescheduled', 'completed', 'disputed')
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
      FROM public.bookings AS booking
      JOIN public.professional_profiles AS professional
        ON professional.id = booking.professional_profile_id
      JOIN public.profiles AS owner
        ON owner.id = professional.profile_id
      WHERE booking.id = session_outcomes.booking_id
        AND booking.status IN ('completed', 'disputed')
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
      JOIN public.bookings AS booking
        ON booking.id = outcome.booking_id
      JOIN public.professional_profiles AS professional
        ON professional.id = outcome.professional_profile_id
      JOIN public.profiles AS owner
        ON owner.id = professional.profile_id
      WHERE outcome.id = session_plan_next_moves.session_outcome_id
        AND booking.status IN ('completed', 'disputed')
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
