-- ============================================================
-- Migration: Feedback table + theme colour setting
-- Run in Supabase SQL editor
-- ============================================================

-- User feedback submitted via the Beta feedback widget
CREATE TABLE IF NOT EXISTS feedback (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page        TEXT,                   -- e.g. 'constraint-audit', 'results'
  rating      SMALLINT,               -- 1–5 star, optional
  message     TEXT NOT NULL,
  name        TEXT,                   -- optional
  email       TEXT,                   -- optional
  audit_id    TEXT,                   -- links to audits_v2.id if submitted from results
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public-facing widget)
CREATE POLICY "Allow anonymous insert on feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

-- Seed brand colour into booking_settings
INSERT INTO booking_settings (key, value, updated_at)
VALUES ('brand_primary_color', '"#1A1A1A"', now())
ON CONFLICT (key) DO NOTHING;
