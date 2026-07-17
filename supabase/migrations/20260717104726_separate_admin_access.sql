-- Keep platform administration separate from the user's primary product role.
-- This lets an owner remain a professional while also administering Naetwork.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.is_admin IS
  'Server-enforced platform administration privilege, managed outside self-service profile updates.';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE auth_user_id = auth.uid()
      AND status = 'active'
      AND (role = 'admin' OR is_admin = TRUE)
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin access is never writable through an authenticated profile request,
  -- including by an existing administrator. A trusted server/SQL owner action
  -- has no auth.uid() and can explicitly grant or revoke the privilege.
  IF auth.uid() IS NOT NULL THEN
    NEW.is_admin := OLD.is_admin;
  END IF;

  IF NOT public.is_admin() THEN
    NEW.auth_user_id := OLD.auth_user_id;
    NEW.email := OLD.email;
    NEW.role := OLD.role;
    NEW.status := OLD.status;
  END IF;

  RETURN NEW;
END;
$$;
