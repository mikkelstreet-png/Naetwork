CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_profile_id UUID REFERENCES professional_profiles(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  professional_profile_id UUID REFERENCES professional_profiles(id) ON DELETE SET NULL,
  slot_id UUID REFERENCES availability_slots(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN (
    'requested', 'pending', 'confirmed', 'rescheduled',
    'cancelled', 'completed', 'no_show', 'refunded', 'disputed'
  )),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  price_dkk INTEGER,
  message_to_professional TEXT,
  reminder_requested BOOLEAN DEFAULT TRUE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'waived')),
  notes_internal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  triggered_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_events ENABLE ROW LEVEL SECURITY;

-- Availability: professionals manage their own, everyone can read available slots
CREATE POLICY "Professionals manage own slots" ON availability_slots FOR ALL USING (
  professional_profile_id IN (
    SELECT pp.id FROM professional_profiles pp
    JOIN profiles p ON pp.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
  )
);
CREATE POLICY "Public can read available slots" ON availability_slots FOR SELECT USING (is_available = TRUE);

-- Bookings: candidate or professional can view their own bookings
CREATE POLICY "Candidate can view own bookings" ON bookings FOR SELECT USING (
  candidate_profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Professional can view own bookings" ON bookings FOR SELECT USING (
  professional_profile_id IN (
    SELECT pp.id FROM professional_profiles pp
    JOIN profiles p ON pp.profile_id = p.id
    WHERE p.auth_user_id = auth.uid()
  )
);
CREATE POLICY "Candidate can create booking" ON bookings FOR INSERT WITH CHECK (
  candidate_profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
);
