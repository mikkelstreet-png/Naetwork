-- Launch-readiness hardening for profiles, admin access, and booking workflows.

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('candidate', 'professional', 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    CASE WHEN NEW.raw_user_meta_data->>'role' = 'professional' THEN 'professional' ELSE 'candidate' END
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    role = CASE
      WHEN public.profiles.role = 'admin' THEN 'admin'
      ELSE EXCLUDED.role
    END,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

ALTER TABLE public.professional_profiles
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS contribution_percent INTEGER NOT NULL DEFAULT 40,
  ADD COLUMN IF NOT EXISTS review_status TEXT NOT NULL DEFAULT 'pending';

ALTER TABLE public.professional_profiles DROP CONSTRAINT IF EXISTS professional_profiles_price_dkk_check;
UPDATE public.professional_profiles
SET price_dkk = LEAST(1800, GREATEST(600, price_dkk));
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_price_dkk_check CHECK (price_dkk BETWEEN 600 AND 1800);
ALTER TABLE public.professional_profiles DROP CONSTRAINT IF EXISTS professional_profiles_contribution_percent_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_contribution_percent_check CHECK (contribution_percent BETWEEN 40 AND 90);
ALTER TABLE public.professional_profiles DROP CONSTRAINT IF EXISTS professional_profiles_review_status_check;
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_review_status_check CHECK (review_status IN ('pending', 'approved', 'rejected'));

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin' AND status = 'active'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.auth_user_id := OLD.auth_user_id;
    NEW.email := OLD.email;
    NEW.role := OLD.role;
    NEW.status := OLD.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_privileges ON public.profiles;
CREATE TRIGGER profiles_protect_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileges();

DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin read all" ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin update all" ON public.profiles;
CREATE POLICY "profiles: admin read all" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "profiles: admin update all" ON public.profiles FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "profiles: published professional names read" ON public.profiles;

DROP POLICY IF EXISTS "Admin can read all professional profiles" ON public.professional_profiles;
DROP POLICY IF EXISTS "Admin can update any professional profile" ON public.professional_profiles;
DROP POLICY IF EXISTS "professional_profiles: admin read all" ON public.professional_profiles;
DROP POLICY IF EXISTS "professional_profiles: admin update all" ON public.professional_profiles;
CREATE POLICY "professional_profiles: admin read all" ON public.professional_profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "professional_profiles: admin update all" ON public.professional_profiles FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "professional_profiles: published read" ON public.professional_profiles;
DROP POLICY IF EXISTS "professional_profiles: approved public read" ON public.professional_profiles;

CREATE OR REPLACE FUNCTION public.reset_professional_review_on_edit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() AND TG_OP = 'INSERT' THEN
    NEW.review_status := 'pending';
    NEW.approved_at := NULL;
  ELSIF NOT public.is_admin() AND TG_OP = 'UPDATE' THEN
    IF NEW.title IS DISTINCT FROM OLD.title OR
      NEW.company IS DISTINCT FROM OLD.company OR
      NEW.bio IS DISTINCT FROM OLD.bio OR
      NEW.industries IS DISTINCT FROM OLD.industries OR
      NEW.focus_areas IS DISTINCT FROM OLD.focus_areas OR
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

DROP TRIGGER IF EXISTS professional_profile_review_reset ON public.professional_profiles;
CREATE TRIGGER professional_profile_review_reset
  BEFORE INSERT OR UPDATE ON public.professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.reset_professional_review_on_edit();

CREATE OR REPLACE FUNCTION public.get_public_professionals(requested_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  profile_id UUID,
  name TEXT,
  title TEXT,
  company TEXT,
  bio TEXT,
  industries TEXT[],
  focus_areas TEXT[],
  price_dkk INTEGER,
  contribution_percent INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    pp.id,
    pp.profile_id,
    p.name,
    pp.title,
    pp.company,
    pp.bio,
    pp.industries,
    pp.focus_areas,
    pp.price_dkk,
    pp.contribution_percent
  FROM public.professional_profiles pp
  JOIN public.profiles p ON p.id = pp.profile_id
  WHERE pp.visibility = 'published'
    AND pp.review_status = 'approved'
    AND p.status = 'active'
    AND (requested_id IS NULL OR pp.id = requested_id)
  ORDER BY pp.approved_at DESC NULLS LAST, pp.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_public_professionals(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_professionals(UUID) TO anon, authenticated;

REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.professional_profiles FROM anon;
GRANT SELECT ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "Admin can read all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Candidate can create booking" ON public.bookings;
DROP POLICY IF EXISTS "bookings: admin read all" ON public.bookings;
DROP POLICY IF EXISTS "bookings: admin update all" ON public.bookings;
DROP POLICY IF EXISTS "bookings: professional update own" ON public.bookings;
DROP POLICY IF EXISTS "bookings: candidate cancel own" ON public.bookings;
CREATE POLICY "bookings: admin read all" ON public.bookings FOR SELECT USING (public.is_admin());
CREATE POLICY "bookings: admin update all" ON public.bookings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can insert contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages: admin read" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages: admin update" ON public.contact_messages;
CREATE POLICY "contact_messages: admin read" ON public.contact_messages FOR SELECT USING (public.is_admin());
CREATE POLICY "contact_messages: admin update" ON public.contact_messages FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX IF NOT EXISTS contact_messages_email_created_idx ON public.contact_messages (email, created_at DESC);

DROP POLICY IF EXISTS "Admin can read audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admin can insert audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "admin_audit_log: admin read" ON public.admin_audit_log;
DROP POLICY IF EXISTS "admin_audit_log: admin insert" ON public.admin_audit_log;
CREATE POLICY "admin_audit_log: admin read" ON public.admin_audit_log FOR SELECT USING (public.is_admin());
CREATE POLICY "admin_audit_log: admin insert" ON public.admin_audit_log FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin can manage legal blockers" ON public.legal_blockers;
DROP POLICY IF EXISTS "legal_blockers: admin manage" ON public.legal_blockers;
CREATE POLICY "legal_blockers: admin manage" ON public.legal_blockers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS professional_profiles_public_idx
  ON public.professional_profiles (visibility, review_status, approved_at DESC);
CREATE INDEX IF NOT EXISTS bookings_professional_time_idx
  ON public.bookings (professional_profile_id, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS bookings_candidate_created_idx
  ON public.bookings (candidate_profile_id, created_at DESC);

CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_professional_no_confirmed_overlap') THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_professional_no_confirmed_overlap
      EXCLUDE USING gist (
        professional_profile_id WITH =,
        tstzrange(starts_at, ends_at, '[)') WITH &&
      ) WHERE (status IN ('confirmed', 'rescheduled'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_candidate_no_confirmed_overlap') THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_candidate_no_confirmed_overlap
      EXCLUDE USING gist (
        candidate_profile_id WITH =,
        tstzrange(starts_at, ends_at, '[)') WITH &&
      ) WHERE (status IN ('confirmed', 'rescheduled'));
  END IF;
END;
$$;
