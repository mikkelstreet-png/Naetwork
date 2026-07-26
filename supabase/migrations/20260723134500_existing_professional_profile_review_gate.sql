-- Do not invent new professional claims for profiles created before the
-- structured relevance fields existed. Preserve their data, hide incomplete
-- profiles, and return them to the professional for an explicit update.

ALTER TABLE public.professional_profiles
  DISABLE TRIGGER professional_profile_review_reset;

UPDATE public.professional_profiles
SET
  review_status = 'pending',
  visibility = 'hidden',
  approved_at = NULL,
  review_feedback = 'Udfyld erfaringsgrundlag, mindst én relevant situation og mindst ét realistisk udbytte. Send derefter profilen til en ny gennemgang.'
WHERE review_status = 'approved'
  AND (
    char_length(btrim(COALESCE(experience_summary, ''))) < 40
    OR COALESCE(cardinality(relevant_situations), 0) = 0
    OR COALESCE(cardinality(expected_outcomes), 0) = 0
  );

ALTER TABLE public.professional_profiles
  ENABLE TRIGGER professional_profile_review_reset;
