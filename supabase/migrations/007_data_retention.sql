-- Admin-only retention routine matching the published baseline periods.

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE OR REPLACE FUNCTION public.run_data_retention()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contact_deleted INTEGER := 0;
  bookings_deleted INTEGER := 0;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  DELETE FROM public.contact_messages
  WHERE created_at < NOW() - INTERVAL '12 months';
  GET DIAGNOSTICS contact_deleted = ROW_COUNT;

  DELETE FROM public.bookings
  WHERE GREATEST(updated_at, starts_at) < NOW() - INTERVAL '24 months'
    AND status IN ('completed', 'cancelled', 'no_show', 'refunded');
  GET DIAGNOSTICS bookings_deleted = ROW_COUNT;

  RETURN jsonb_build_object(
    'contactMessagesDeleted', contact_deleted,
    'terminalBookingsDeleted', bookings_deleted,
    'completedAt', NOW()
  );
END;
$$;

REVOKE ALL ON FUNCTION public.run_data_retention() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.run_data_retention() TO authenticated;
