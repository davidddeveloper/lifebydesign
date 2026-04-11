-- ============================================================
-- audits_v2 table — Constraint-Busting Business Audit v3.0
-- ============================================================
-- Run this in Supabase SQL editor (or psql against your PostgreSQL).
-- The existing `audits` table is untouched — this is a clean migration.
-- ============================================================

CREATE TABLE IF NOT EXISTS audits_v2 (

  -- Primary key
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- ── Business Information ──────────────────────────────────
  business_name             TEXT,
  owner_name                TEXT,
  email                     TEXT,
  phone                     TEXT,
  industry                  TEXT,
  years_in_business         INTEGER,
  monthly_revenue           NUMERIC,
  number_of_customers       INTEGER,
  team_size                 INTEGER,
  revenue_tracking          TEXT,            -- 'yes' | 'roughly' | 'no'

  -- ── Scored answers (v3 question numbers) ─────────────────
  -- Lever 1 — WHO
  q1  NUMERIC,   -- customer clarity          (1–4 pts)
  q2  NUMERIC,   -- new customers last month  (2/4/6/8 pts)
  q3  NUMERIC,   -- acquisition control       (1–4 pts)

  -- Lever 2 — WHAT
  q5  NUMERIC,   -- customer relationship value (1–4 pts)
  q6  NUMERIC,   -- pricing vs competitors      (1–5 pts)
  q7  NUMERIC,   -- customer satisfaction       (1.5/3/4.5/6 pts)
  q8  NUMERIC,   -- unprompted referrals        (2/4/6/8 pts)
  q9  NUMERIC,   -- documented evidence         (1–5 pts)
  q10 NUMERIC,   -- repeat purchase frequency   (2/4/6/8 pts)
  q11 NUMERIC,   -- additional offers           (1–4 pts)

  -- Lever 3 — HOW THEY FIND YOU
  q13 NUMERIC,   -- acquisition channel         (1–4 pts)
  q14 NUMERIC,   -- deliberate weekly action    (1.5/3/4.5/6 pts)
  q15 NUMERIC,   -- monthly enquiries           (2/4/6/8/10 pts)
  q16 NUMERIC,   -- enquiry predictability      (1–4 pts)
  q17 NUMERIC,   -- warm lead follow-up         (1–4 pts)

  -- Lever 4 — HOW YOU SELL
  q18 NUMERIC,   -- sales process               (1.5/3/4.5/6 pts)
  q19 NUMERIC,   -- close rate                  (2/4/6/8 pts)
  q20 NUMERIC,   -- time to close               (1–4 pts)
  q21 NUMERIC,   -- follow-up system            (2/4/6/8 pts)

  -- Lever 5 — HOW YOU DELIVER
  q23 NUMERIC,   -- business without you        (1–4 pts)
  q24 NUMERIC,   -- documented knowledge        (1–4 pts)
  q25 NUMERIC,   -- tracks business numbers     (2/4/6/8 pts)
  q26 NUMERIC,   -- profit margin               (0/0/4/6/8 pts)
  q27 NUMERIC,   -- time on vs in               (1.5/3/4.5/6 pts)

  -- ── Open-text answers ────────────────────────────────────
  q4  TEXT,      -- ideal customer description
  q12 TEXT,      -- main problem solved
  q22 TEXT,      -- reasons not buying
  q28 TEXT,      -- biggest challenge
  q29 TEXT,      -- one thing to fix in 90 days
  q30 TEXT,      -- 12-month goal

  -- ── Calculated lever scores (0–10) ───────────────────────
  score_who        NUMERIC(4,1),
  score_what       NUMERIC(4,1),
  score_traffic    NUMERIC(4,1),
  score_sell       NUMERIC(4,1),
  score_operations NUMERIC(4,1),

  -- ── Score bands ──────────────────────────────────────────
  -- Values: 'CRITICAL' | 'WEAK' | 'FUNCTIONAL' | 'STRONG'
  band_who        TEXT,
  band_what       TEXT,
  band_traffic    TEXT,
  band_sell       TEXT,
  band_operations TEXT,

  -- ── Constraint diagnosis ─────────────────────────────────
  primary_constraint    TEXT,      -- e.g. 'WHO (Market)'
  primary_score         NUMERIC(4,1),
  secondary_constraint  TEXT,
  secondary_score       NUMERIC(4,1),
  rule_applied          SMALLINT,  -- 1–5

  -- ── Interaction flags ────────────────────────────────────
  interaction_flags     TEXT[],    -- array of flag messages

  -- ── Claude narrative ─────────────────────────────────────
  narrative                       TEXT,   -- full joined narrative
  narrative_what_working          TEXT,
  narrative_primary_constraint    TEXT,
  narrative_cost                  TEXT,
  narrative_root_cause            TEXT,
  narrative_next_step             TEXT,

  -- ── Revenue opportunity ───────────────────────────────────
  revenue_opportunity_text  TEXT,

  -- ── CTA routing ──────────────────────────────────────────
  -- Values: 'workshop' | 'vip_consultation' | '90day_programme' | 'scaling'
  recommended_cta  TEXT,

  -- ── Email / PDF tracking ─────────────────────────────────
  results_email_sent      BOOLEAN DEFAULT FALSE,
  results_email_sent_at   TIMESTAMPTZ,
  pdf_generated           BOOLEAN DEFAULT FALSE,

  -- ── Status & meta ────────────────────────────────────────
  -- Values: 'scored' | 'complete' | 'error'
  status        TEXT DEFAULT 'scored',
  audit_version TEXT DEFAULT '3.0',
  ip_address    TEXT,
  user_agent    TEXT
);

-- ── Indexes ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_audits_v2_email
  ON audits_v2 (email);

CREATE INDEX IF NOT EXISTS idx_audits_v2_created_at
  ON audits_v2 (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audits_v2_status
  ON audits_v2 (status);

CREATE INDEX IF NOT EXISTS idx_audits_v2_primary_constraint
  ON audits_v2 (primary_constraint);

-- ── Row-level security (enable if using Supabase RLS) ─────────────
-- Audits should only be readable by service_role, not anon.
ALTER TABLE audits_v2 ENABLE ROW LEVEL SECURITY;

-- Service role has full access (used by Next.js API routes)
CREATE POLICY "service_role_all" ON audits_v2
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- No public read/write access
-- (add user-specific policies when auth is implemented)
