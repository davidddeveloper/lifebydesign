-- ============================================================
-- partners table — Partner / Portfolio Company Applications
-- ============================================================
-- Run this in Supabase SQL editor (or psql against your PostgreSQL).
-- Used by POST /api/portfolio and the admin Partners dashboard.
-- ============================================================

CREATE TABLE IF NOT EXISTS partners (

  -- Primary key
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- ── Business Information ──────────────────────────────────
  business_location           TEXT,            -- 'Freetown' | 'Provinces' | 'Other'
  business_type               TEXT,            -- 'Service' | 'E-commerce' | 'Brick & Mortar' | 'Software' | 'Other'
  business_description        TEXT,

  -- ── Financial Information ─────────────────────────────────
  annual_revenue              NUMERIC,
  ebitda_12_months            NUMERIC,
  ebitda_3_months             NUMERIC,

  -- ── Discovery & Ownership ─────────────────────────────────
  heard_about                 TEXT,            -- 'YouTube' | 'Facebook' | ... | 'Other'
  ownership_decision          TEXT,            -- 'Yes' | 'No'

  -- ── Contact Information ───────────────────────────────────
  email                       TEXT NOT NULL,
  first_name                  TEXT,
  last_name                   TEXT,
  phone                       TEXT,
  company_name                TEXT,
  company_website             TEXT,

  -- ── Final Step ────────────────────────────────────────────
  portfolio_consideration     TEXT,            -- 'Yes, I want to apply.' | 'No, thank you'
  terms_accepted              BOOLEAN DEFAULT false,

  -- ── Meta ──────────────────────────────────────────────────
  source                      TEXT DEFAULT 'Partner Application',
  status                      TEXT DEFAULT 'new',
                              -- 'new' | 'reviewing' | 'contacted' | 'accepted' | 'rejected' | 'on_hold'
  admin_notes                 TEXT,
  ip_address                  TEXT,
  user_agent                  TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS partners_email_idx     ON partners (email);
CREATE INDEX IF NOT EXISTS partners_status_idx    ON partners (status);
CREATE INDEX IF NOT EXISTS partners_created_at_idx ON partners (created_at DESC);
CREATE INDEX IF NOT EXISTS partners_company_idx   ON partners (company_name);

-- RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by Next.js API routes via SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "service_role_full_access" ON partners
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Optional: allow anon INSERT only if you ever submit from the client directly.
-- Prefer server-side inserts via /api/portfolio instead.
-- CREATE POLICY "anon_insert" ON partners
--   FOR INSERT TO anon WITH CHECK (true);
