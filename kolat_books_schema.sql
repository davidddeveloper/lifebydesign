-- ============================================================
-- kolat_books_inquiries table — Kolat Books / bookkeeping form
-- ============================================================
-- Run this in Supabase SQL editor (or psql against your PostgreSQL).
-- Used by POST /api/kolat-books and the admin Kolat Books dashboard.
-- ============================================================

CREATE TABLE IF NOT EXISTS kolat_books_inquiries (

  -- Primary key
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- ── Business Information ──────────────────────────────────
  business_name               TEXT,
  business_industry           TEXT,
  business_address            TEXT,
  business_email              TEXT,
  business_phone              TEXT,

  -- ── Primary Contact ───────────────────────────────────────
  primary_contact             TEXT,
  contact_position            TEXT,
  contact_phone               TEXT,
  contact_email               TEXT,

  -- ── Business Size ─────────────────────────────────────────
  number_of_employees         TEXT,            -- 'Just me' | '2 to 4' | ...
  monthly_revenue             TEXT,            -- revenue band from form

  -- ── Bookkeeping Needs ─────────────────────────────────────
  bookkeeping_method          TEXT,
  current_bookkeeper          TEXT,            -- 'Yes' | 'No'
  financial_challenges        TEXT,
  services_interested         TEXT[] DEFAULT '{}',
  communication_preference    TEXT[] DEFAULT '{}',

  -- ── Consent ───────────────────────────────────────────────
  terms_accepted              BOOLEAN DEFAULT false,

  -- ── Meta ──────────────────────────────────────────────────
  source                      TEXT DEFAULT 'Finance Freedom Page',
  status                      TEXT DEFAULT 'new',
                              -- 'new' | 'reviewing' | 'contacted' | 'qualified' | 'closed' | 'not_interested'
  admin_notes                 TEXT,
  ip_address                  TEXT,
  user_agent                  TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS kolat_books_business_email_idx ON kolat_books_inquiries (business_email);
CREATE INDEX IF NOT EXISTS kolat_books_contact_email_idx  ON kolat_books_inquiries (contact_email);
CREATE INDEX IF NOT EXISTS kolat_books_status_idx         ON kolat_books_inquiries (status);
CREATE INDEX IF NOT EXISTS kolat_books_created_at_idx     ON kolat_books_inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS kolat_books_business_name_idx  ON kolat_books_inquiries (business_name);

-- RLS
ALTER TABLE kolat_books_inquiries ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by Next.js API routes via SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "service_role_full_access" ON kolat_books_inquiries
  FOR ALL TO service_role USING (true) WITH CHECK (true);
