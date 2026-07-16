-- ============================================================
-- job_applications table — Careers / job form submissions
-- ============================================================
-- Run this in Supabase SQL editor.
-- Used by POST /api/job-application and the admin Jobs Applications dashboard.
-- Jobs themselves live in Sanity (jobPosting documents).
-- ============================================================

CREATE TABLE IF NOT EXISTS job_applications (

  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- ── Job reference (from Sanity jobPosting) ────────────────
  job_id                      TEXT NOT NULL,   -- slug.current or Sanity _id
  job_title                   TEXT NOT NULL,
  job_department              TEXT,
  sanity_document_id          TEXT,            -- optional Sanity _id

  -- ── Applicant ─────────────────────────────────────────────
  first_name                  TEXT,
  last_name                   TEXT,
  email                       TEXT NOT NULL,
  phone                       TEXT,
  portfolio                   TEXT,
  cover_letter                TEXT,

  -- ── Meta ──────────────────────────────────────────────────
  source                      TEXT DEFAULT 'Job Application',
  status                      TEXT DEFAULT 'new',
                              -- 'new' | 'reviewing' | 'interview' | 'offer' | 'hired' | 'rejected' | 'withdrawn'
  admin_notes                 TEXT,
  ip_address                  TEXT,
  user_agent                  TEXT
);

CREATE INDEX IF NOT EXISTS job_applications_job_id_idx   ON job_applications (job_id);
CREATE INDEX IF NOT EXISTS job_applications_email_idx    ON job_applications (email);
CREATE INDEX IF NOT EXISTS job_applications_status_idx   ON job_applications (status);
CREATE INDEX IF NOT EXISTS job_applications_created_idx  ON job_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS job_applications_title_idx    ON job_applications (job_title);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access" ON job_applications
  FOR ALL TO service_role USING (true) WITH CHECK (true);
