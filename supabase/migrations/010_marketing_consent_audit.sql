ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS marketing_consent_at timestamptz;

UPDATE profiles
SET marketing_consent_at = COALESCE(marketing_consent_at, updated_at, created_at)
WHERE notification_marketing = true;

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_marketing_consent_evidence;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_marketing_consent_evidence
  CHECK (notification_marketing = false OR marketing_consent_at IS NOT NULL);

CREATE TABLE IF NOT EXISTS marketing_consent_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  granted boolean NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE marketing_consent_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own marketing consent events" ON marketing_consent_events;
CREATE POLICY "Users can view own marketing consent events"
  ON marketing_consent_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = marketing_consent_events.profile_id
        AND profiles.auth_user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION record_marketing_consent_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.notification_marketing IS DISTINCT FROM OLD.notification_marketing THEN
    INSERT INTO marketing_consent_events (profile_id, granted, occurred_at)
    VALUES (NEW.id, NEW.notification_marketing, COALESCE(NEW.marketing_consent_at, now()));
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION record_marketing_consent_event() FROM PUBLIC;

DROP TRIGGER IF EXISTS profiles_marketing_consent_audit ON profiles;
CREATE TRIGGER profiles_marketing_consent_audit
  AFTER UPDATE OF notification_marketing ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION record_marketing_consent_event();
