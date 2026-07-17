-- Cover foreign-key paths introduced by the retention workspace so deletes
-- and participant integrity checks remain efficient as the marketplace grows.

CREATE INDEX IF NOT EXISTS saved_professionals_professional_profile_idx
  ON public.saved_professionals (professional_profile_id);

CREATE INDEX IF NOT EXISTS saved_professionals_career_situation_idx
  ON public.saved_professionals (career_situation_id)
  WHERE career_situation_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS session_outcomes_booking_participants_idx
  ON public.session_outcomes (booking_id, candidate_profile_id, professional_profile_id);
