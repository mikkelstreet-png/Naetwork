-- Keep every public, reviewable profile field behind a new approval after the
-- professional changes it. Trusted service-role writes retain admin context.
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
  ELSIF TG_OP = 'UPDATE' THEN
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
