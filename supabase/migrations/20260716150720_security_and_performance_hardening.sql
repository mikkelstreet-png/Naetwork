-- Tighten function execution, remove unintended RPC exposure and add the
-- covering indexes flagged by the Supabase advisors.

ALTER FUNCTION public.set_updated_at() SET search_path = public;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_profile_privileges() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reset_professional_review_on_edit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_marketing_consent_event() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_professional_integration_fields() FROM PUBLIC, anon, authenticated;

-- These three SECURITY DEFINER functions are intentionally callable: is_admin
-- and run_data_retention validate auth.uid(), while get_public_professionals
-- returns a fixed, reviewed public projection only.
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.run_data_retention() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.run_data_retention() TO authenticated;
REVOKE ALL ON FUNCTION public.get_public_professionals(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_professionals(UUID) TO anon, authenticated;

DROP POLICY IF EXISTS "booking_events: admin read" ON public.booking_events;
CREATE POLICY "booking_events: admin read" ON public.booking_events
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION btree_gist SET SCHEMA extensions;

CREATE INDEX IF NOT EXISTS admin_audit_log_admin_user_idx
  ON public.admin_audit_log (admin_user_id);
CREATE INDEX IF NOT EXISTS analytics_events_profile_idx
  ON public.analytics_events (profile_id) WHERE profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS analytics_events_professional_idx
  ON public.analytics_events (professional_profile_id) WHERE professional_profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS analytics_events_booking_idx
  ON public.analytics_events (booking_id) WHERE booking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS booking_events_booking_idx
  ON public.booking_events (booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_cancelled_by_idx
  ON public.bookings (cancelled_by) WHERE cancelled_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS email_delivery_events_booking_idx
  ON public.email_delivery_events (booking_id) WHERE booking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS email_delivery_events_recipient_idx
  ON public.email_delivery_events (recipient_profile_id) WHERE recipient_profile_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS marketing_consent_events_profile_idx
  ON public.marketing_consent_events (profile_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS payment_events_booking_idx
  ON public.payment_events (booking_id) WHERE booking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS reviews_candidate_profile_idx
  ON public.reviews (candidate_profile_id);
CREATE INDEX IF NOT EXISTS reviews_professional_profile_idx
  ON public.reviews (professional_profile_id);
