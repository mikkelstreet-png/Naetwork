-- Keep professional profile ownership explicit and avoid overlapping permissive
-- policies for the same authenticated operation.

DROP POLICY IF EXISTS "professional_profiles: active professional owns profile"
  ON public.professional_profiles;
DROP POLICY IF EXISTS "professional_profiles: admin read all"
  ON public.professional_profiles;
DROP POLICY IF EXISTS "professional_profiles: admin update all"
  ON public.professional_profiles;

CREATE POLICY "professional_profiles: owner or admin read"
  ON public.professional_profiles
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.profiles owner_profile
      WHERE owner_profile.id = professional_profiles.profile_id
        AND owner_profile.auth_user_id = (SELECT auth.uid())
        AND owner_profile.role = 'professional'
        AND owner_profile.status = 'active'
    )
  );

CREATE POLICY "professional_profiles: active owner insert"
  ON public.professional_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles owner_profile
      WHERE owner_profile.id = professional_profiles.profile_id
        AND owner_profile.auth_user_id = (SELECT auth.uid())
        AND owner_profile.role = 'professional'
        AND owner_profile.status = 'active'
    )
  );

CREATE POLICY "professional_profiles: owner or admin update"
  ON public.professional_profiles
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.profiles owner_profile
      WHERE owner_profile.id = professional_profiles.profile_id
        AND owner_profile.auth_user_id = (SELECT auth.uid())
        AND owner_profile.role = 'professional'
        AND owner_profile.status = 'active'
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.profiles owner_profile
      WHERE owner_profile.id = professional_profiles.profile_id
        AND owner_profile.auth_user_id = (SELECT auth.uid())
        AND owner_profile.role = 'professional'
        AND owner_profile.status = 'active'
    )
  );

CREATE POLICY "professional_profiles: active owner delete"
  ON public.professional_profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles owner_profile
      WHERE owner_profile.id = professional_profiles.profile_id
        AND owner_profile.auth_user_id = (SELECT auth.uid())
        AND owner_profile.role = 'professional'
        AND owner_profile.status = 'active'
    )
  );
