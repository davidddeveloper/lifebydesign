-- ============================================================
-- Booking System Schema
-- Run in Supabase SQL editor
-- ============================================================

-- ─── bookings ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bookings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT NOT NULL,

  -- Revenue context (captured from audit or form)
  monthly_revenue       NUMERIC,

  -- Appointment
  booking_date          DATE NOT NULL,
  booking_time          TEXT NOT NULL,       -- "09:00"
  timezone              TEXT DEFAULT 'Africa/Freetown',

  -- Meeting medium
  call_medium           TEXT NOT NULL,       -- 'in_person' | 'zoom' | 'google_meet' | 'phone_call'
  meeting_link          TEXT,               -- for zoom / google_meet

  -- Assignment
  assigned_to_name      TEXT,
  assigned_to_email     TEXT,

  -- Source
  source                TEXT DEFAULT 'audit',  -- 'audit' | 'nav_form' | 'direct'
  audit_id              UUID,               -- links to audits_v2.id (soft FK)

  -- Status
  status                TEXT DEFAULT 'confirmed',
                        -- 'confirmed' | 'cancelled' | 'completed' | 'no_show'

  -- Tracking
  confirmation_sent_at  TIMESTAMPTZ,
  team_notified_at      TIMESTAMPTZ,
  admin_notes           TEXT,

  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS bookings_email_idx  ON bookings (email);
CREATE INDEX IF NOT EXISTS bookings_date_idx   ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
CREATE INDEX IF NOT EXISTS bookings_audit_idx  ON bookings (audit_id);

-- RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "service_role_full_access" ON bookings
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ─── booking_settings ────────────────────────────────────────────────────────
-- Key/value store for all configurable booking settings.
-- Each key stores a JSONB value so the admin can manage complex structures.

CREATE TABLE IF NOT EXISTS booking_settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access" ON booking_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ─── Seed default settings ───────────────────────────────────────────────────

INSERT INTO booking_settings (key, value) VALUES
  -- Revenue threshold (monthly NLE). Below this → redirect to YouTube.
  ('revenue_threshold', '20000'),

  -- Redirect URL for below-threshold users
  ('redirect_url', '"https://www.youtube.com/@JABshow"'),

  -- Person / people calls are assigned to
  ('assigned_team', '[
    {"name": "Diana Lake", "email": "dlake@lbd.sl", "active": true}
  ]'),

  -- Everyone who receives team notifications
  ('notification_team', '[
    {"name": "Joe Abass",          "email": "joeabass@lbd.sl", "active": true},
    {"name": "Sylvester Johnson",  "email": "sjohnson@lbd.sl",  "active": true},
    {"name": "Foday Kamara",       "email": "fkamara@lbd.sl",   "active": true},
    {"name": "Diana Lake",         "email": "dlake@lbd.sl",     "active": true}
  ]'),

  -- Available days and hours
  ('availability', '{
    "days": ["monday","tuesday","wednesday","thursday","friday"],
    "start_time": "09:00",
    "end_time":   "15:30",
    "slot_duration_mins": 30
  }'),

  -- In-person office address
  ('office_address', '"62 Dundas Street, Freetown, Sierra Leone"'),

  -- Google Maps / directions link
  ('directions_url', '"https://maps.google.com/?q=62+Dundas+Street+Freetown+Sierra+Leone"')

ON CONFLICT (key) DO NOTHING;
