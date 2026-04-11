-- ============================================================
-- Unified audit analytics views
-- Covers both audits (v1) and audits_v2 (v3.0) tables.
-- Run in Supabase SQL editor after audits_v2 has been created.
-- ============================================================

-- Drop all views first (CASCADE handles dependencies between views)
DROP VIEW IF EXISTS admin_audit_stats CASCADE;
DROP VIEW IF EXISTS constraint_summary CASCADE;
DROP VIEW IF EXISTS constraint_by_industry CASCADE;
DROP VIEW IF EXISTS daily_audit_stats CASCADE;
DROP VIEW IF EXISTS audit_submissions_unified CASCADE;


-- ─── 1. audit_submissions_unified ────────────────────────────────────────────
-- A normalised union of both tables. Use this as the base for all reporting.

CREATE OR REPLACE VIEW audit_submissions_unified AS

  -- v1 rows
  SELECT
    id,
    '1.0'::text                     AS audit_version,
    business_name,
    owner_name,
    email,
    industry,
    monthly_revenue,
    score_who,
    score_what,
    score_traffic,
    score_sell,
    score_operations,
    primary_constraint,
    primary_score,
    secondary_constraint,
    status,
    created_at::date                AS submission_date,
    created_at
  FROM audits
  WHERE is_deleted = false

  UNION ALL

  -- v2 rows
  SELECT
    id,
    '3.0'::text                     AS audit_version,
    business_name,
    owner_name,
    email,
    industry,
    monthly_revenue,
    score_who,
    score_what,
    score_traffic,
    score_sell,
    score_operations,
    primary_constraint,
    primary_score,
    secondary_constraint,
    status,
    created_at::date                AS submission_date,
    created_at
  FROM audits_v2;


-- ─── 2. daily_audit_stats ─────────────────────────────────────────────────────
-- One row per day: submission count, average lever scores.
-- Used for the dashboard trend chart.

CREATE OR REPLACE VIEW daily_audit_stats AS
SELECT
  submission_date,
  COUNT(*)                                              AS total_submissions,
  ROUND(AVG(score_who)::numeric, 1)                     AS avg_who,
  ROUND(AVG(score_what)::numeric, 1)                    AS avg_what,
  ROUND(AVG(score_traffic)::numeric, 1)                 AS avg_traffic,
  ROUND(AVG(score_sell)::numeric, 1)                    AS avg_sell,
  ROUND(AVG(score_operations)::numeric, 1)              AS avg_operations,
  ROUND(
    AVG((score_who + score_what + score_traffic + score_sell + score_operations) / 5.0)::numeric, 1
  )                                                     AS avg_overall
FROM audit_submissions_unified
GROUP BY submission_date
ORDER BY submission_date DESC;


-- ─── 3. constraint_by_industry ───────────────────────────────────────────────
-- For each industry: which constraint dominates and average scores.
-- Used for the industry breakdown table in admin.

CREATE OR REPLACE VIEW constraint_by_industry AS
SELECT
  COALESCE(NULLIF(TRIM(industry), ''), 'Unknown')       AS industry,
  COUNT(*)                                              AS total_audits,
  -- Most common primary constraint
  MODE() WITHIN GROUP (ORDER BY primary_constraint)     AS dominant_constraint,
  -- Constraint distribution
  COUNT(*) FILTER (WHERE primary_constraint ILIKE '%WHO%')        AS constraint_who,
  COUNT(*) FILTER (WHERE primary_constraint ILIKE '%WHAT%')       AS constraint_what,
  COUNT(*) FILTER (WHERE primary_constraint ILIKE '%FIND%' OR primary_constraint ILIKE '%TRAFFIC%')
                                                        AS constraint_traffic,
  COUNT(*) FILTER (WHERE primary_constraint ILIKE '%SELL%')       AS constraint_sell,
  COUNT(*) FILTER (WHERE primary_constraint ILIKE '%DELIVER%' OR primary_constraint ILIKE '%OPER%')
                                                        AS constraint_operations,
  -- Average scores
  ROUND(AVG(score_who)::numeric, 1)                     AS avg_who,
  ROUND(AVG(score_what)::numeric, 1)                    AS avg_what,
  ROUND(AVG(score_traffic)::numeric, 1)                 AS avg_traffic,
  ROUND(AVG(score_sell)::numeric, 1)                    AS avg_sell,
  ROUND(AVG(score_operations)::numeric, 1)              AS avg_operations,
  -- Revenue
  ROUND(AVG(monthly_revenue)::numeric, 0)               AS avg_monthly_revenue,
  MAX(created_at)                                       AS latest_submission
FROM audit_submissions_unified
GROUP BY COALESCE(NULLIF(TRIM(industry), ''), 'Unknown')
ORDER BY total_audits DESC;


-- ─── 4. constraint_summary ───────────────────────────────────────────────────
-- Quick breakdown: how many businesses have each constraint as primary.

CREATE OR REPLACE VIEW constraint_summary AS
SELECT
  primary_constraint,
  COUNT(*)                          AS total,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1)  AS pct_of_total,
  ROUND(AVG(monthly_revenue)::numeric, 0)              AS avg_monthly_revenue,
  ROUND(AVG(primary_score)::numeric, 1)                AS avg_primary_score,
  MIN(created_at)                   AS first_seen,
  MAX(created_at)                   AS last_seen
FROM audit_submissions_unified
WHERE primary_constraint IS NOT NULL
  AND primary_constraint NOT IN ('pending_ai_analysis', '—', 'ALL LEVERS (Broad Weakness)', 'STRONG BUSINESS (Scale)')
GROUP BY primary_constraint
ORDER BY total DESC;


-- ─── 5. admin_audit_stats (single-row summary for dashboard header) ───────────
-- Used to populate the top KPI cards in admin.

CREATE OR REPLACE VIEW admin_audit_stats AS
SELECT
  COUNT(*)                                                    AS total_submissions,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')
                                                              AS submissions_last_30d,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')
                                                              AS submissions_last_7d,
  ROUND(AVG(monthly_revenue)::numeric, 0)                     AS avg_monthly_revenue,
  ROUND(AVG((score_who + score_what + score_traffic + score_sell + score_operations) / 5.0)::numeric, 1)
                                                              AS avg_overall_score,
  COUNT(*) FILTER (WHERE audit_version = '1.0')               AS v1_count,
  COUNT(*) FILTER (WHERE audit_version = '3.0')               AS v2_count
FROM audit_submissions_unified;
