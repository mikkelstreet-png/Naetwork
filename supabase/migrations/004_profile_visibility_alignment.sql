-- Align public professional profile reads with the active app schema.
-- Safe to run more than once in Supabase SQL editor.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE public.profiles
SET email = auth_users.email
FROM auth.users AS auth_users
WHERE public.profiles.auth_user_id = auth_users.id
  AND public.profiles.email IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, name, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate')
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "profiles: published professional names read" ON public.profiles;
CREATE POLICY "profiles: published professional names read" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.professional_profiles pp
      WHERE pp.profile_id = public.profiles.id
        AND pp.visibility = 'published'
    )
  );

DROP POLICY IF EXISTS "profiles: admin read all" ON public.profiles;
CREATE POLICY "profiles: admin read all" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.profiles admin_profile
      WHERE admin_profile.auth_user_id = auth.uid()
        AND admin_profile.role = 'admin'
    )
  );
