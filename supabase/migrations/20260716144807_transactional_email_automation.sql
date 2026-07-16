-- Make every Resend delivery auditable, retry-safe and usable for scheduled
-- transactional messages without exposing recipient addresses in the ledger.

ALTER TABLE public.email_delivery_events
  ADD COLUMN IF NOT EXISTS recipient_email_hash TEXT,
  ADD COLUMN IF NOT EXISTS dedupe_key TEXT,
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_event_type TEXT;

ALTER TABLE public.email_delivery_events
  DROP CONSTRAINT IF EXISTS email_delivery_events_status_check;
ALTER TABLE public.email_delivery_events
  ADD CONSTRAINT email_delivery_events_status_check
  CHECK (status IN (
    'queued', 'sent', 'delivered', 'delivery_delayed', 'bounced',
    'complained', 'suppressed', 'failed', 'cancelled'
  ));

CREATE UNIQUE INDEX IF NOT EXISTS email_delivery_events_dedupe_key_idx
  ON public.email_delivery_events (dedupe_key)
  WHERE dedupe_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS email_delivery_events_provider_message_idx
  ON public.email_delivery_events (provider_message_id)
  WHERE provider_message_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS email_delivery_events_status_created_idx
  ON public.email_delivery_events (status, created_at DESC);

-- Store only a one-way email hash for auth-mail throttling. The service-role
-- API is the only writer; no public Data API access is needed.
CREATE TABLE IF NOT EXISTS public.auth_email_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('signup', 'recovery')),
  was_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.auth_email_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_email_requests: admin read" ON public.auth_email_requests;
CREATE POLICY "auth_email_requests: admin read" ON public.auth_email_requests
  FOR SELECT TO authenticated
  USING (public.is_admin());

REVOKE ALL ON TABLE public.auth_email_requests FROM anon, authenticated;
GRANT SELECT ON TABLE public.auth_email_requests TO authenticated;

CREATE INDEX IF NOT EXISTS auth_email_requests_rate_limit_idx
  ON public.auth_email_requests (email_hash, request_type, created_at DESC);

COMMENT ON TABLE public.auth_email_requests IS
  'One-way recipient hashes used to throttle signup and recovery email requests.';
COMMENT ON COLUMN public.email_delivery_events.dedupe_key IS
  'Deterministic application key used to prevent duplicate transactional sends.';
