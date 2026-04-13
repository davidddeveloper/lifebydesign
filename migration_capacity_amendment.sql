-- ============================================================
-- Migration: Capacity Constraint Amendment
-- Adds Q2a and capacity_flag columns to audits_v2
-- Run in Supabase SQL editor
-- ============================================================

-- Q2a answer (routing question — not scored)
ALTER TABLE audits_v2
  ADD COLUMN IF NOT EXISTS q2a_answer TEXT;     -- 'A' | 'B' | 'C' | 'D' | null

-- Capacity flag (true = Q2 was excluded from Lever 1 scoring)
ALTER TABLE audits_v2
  ADD COLUMN IF NOT EXISTS capacity_flag BOOLEAN DEFAULT FALSE;

-- Comment for documentation
COMMENT ON COLUMN audits_v2.q2a_answer IS
  'Q2a — capacity gate answer: A=full capacity, B=near capacity, C=has capacity, D=urgently needs customers';

COMMENT ON COLUMN audits_v2.capacity_flag IS
  'True when Q2a=A (business at full capacity). Q2 excluded from Lever 1 scoring, denominator = 8 instead of 16.';
