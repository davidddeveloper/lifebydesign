# Capacity Constraint Amendment — Implementation Notes

**Spec:** Capacity Constraint Amendment — Supplement to Constraint-Busting Business Audit v3.0  
**Implemented:** April 2026

---

## What Was Changed

### Scoring bug fix (separate from amendment, discovered during implementation)

The original scoring formula was double-weighting questions. The answer option `value` fields in the form **already encoded** the weight multiplier (e.g. Q2 options were `2, 4, 6, 8` = ×2 pre-applied; Q7 options were `1.5, 3, 4.5, 6` = ×1.5 pre-applied), but `scoreLevers()` in `submit-audit-v2/route.ts` **also multiplied by those weights again** — causing scores above 10.

**Fix:** Removed all multipliers from `scoreLevers()`. The denominators remain correct (they already reflected the pre-weighted maxima: Lever 1 = 16, Lever 2 = 40, etc.). Scores now correctly cap at 10.0.

---

## Capacity Amendment — Summary of Changes

### 1. New question Q2a (ConstraintAuditFormV2.tsx)

Inserted between Q1 and Q2 in the SCREENS array. Type: `choice`. Field key: `q2a`. Values are string literals `"A"` through `"D"`, not numbers (this question is not scored).

```
A — At full capacity, cannot take on new customers
B — Partially, close to limit
C — Yes, has room
D — Yes, significant capacity needed
```

### 2. Conditional display of Q2

Q2 has `conditionalOn: { fieldKey: "q2a", hideWhenValue: "A" }`.

The `go()` navigation function now calls `isScreenHidden()` and skips any screen where the condition is met. When Q2a = "A", Q2 is skipped entirely — the user never sees it and `q2` remains `null` in `formData`.

### 3. Scoring formula fork (submit-audit-v2/route.ts)

```ts
// CAPACITY_FLAG = true (Q2a = "A"):
lever1 = (q1 + q3) / 8 × 10        // denominator 8

// CAPACITY_FLAG = false (standard):
lever1 = (q1 + q2 + q3) / 16 × 10  // denominator 16
```

All other levers unchanged.

### 4. CTA override

When `capacityFlag = true`, `recommendedCta` is always forced to `"vip_consultation"` regardless of scores — per spec.

### 5. AI prompt additions (lib/claude-audit.ts)

Two new fields added to `AuditNarrativeInput`:
- `capacityStatus` — human-readable string passed in the `BUSINESS OWNER CONTEXT` block
- `capacityFlag` — boolean; when true, a full capacity handling instruction block is injected into the prompt **before YOUR TASK**

The capacity instruction block:
- Overrides WHO/FIND YOU diagnosis when flag is true
- Instructs Claude to address the capacity ceiling in section 4 (Root Cause)
- Forces VIP Consultation recommendation in section 5

### 6. DB logging

Two new columns in `audits_v2` (add via `migration_capacity_amendment.sql`):
- `q2a_answer` — TEXT: records the raw Q2a selection
- `capacity_flag` — BOOLEAN: flags capacity-constrained submissions

When `capacityFlag = true`, `q2` is stored as `null` in the DB (never answered).

---

## Testing Checklist

| Scenario | Expected | Pass? |
|---|---|---|
| Q2a = A, Q1 = 4pts, Q3 = 4pts | Lever 1 = 10.0. Q2 hidden. capacity_flag = true in DB. VIP CTA shown. | ☐ |
| Q2a = A, Q1 = 1pt, Q3 = 1pt | Lever 1 = (1+1)/8×10 = 2.5. CAPACITY_FLAG = true. | ☐ |
| Q2a = C, all WHO at max (Q1=4, Q2=8, Q3=4) | Lever 1 = (4+8+4)/16×10 = 10.0. Standard formula. | ☐ |
| Q2a = C, Q1=4, Q2=4, Q3=2 | Lever 1 = (4+4+2)/16×10 = 6.25 | ☐ |
| All levers at max (no Q2a = A) | All scores exactly 10.0, none above. | ☐ |
| Q2a = A, WHO is lowest score | AI does not diagnose a market problem. Capacity language in sections 2 and 4. | ☐ |
| Q2a = B/C/D | Q2 displayed and scored normally. No capacity language in AI narrative. | ☐ |
| Admin regenerate button on blank narrative | Fires `/api/admin/regenerate-narrative`, refills all 5 narrative fields. | ☐ |

---

## Files Changed

| File | What changed |
|---|---|
| `components/ConstraintAuditFormV2.tsx` | Added `q2a` to `FormData` type + `INITIAL_FORM`. Added Q2a screen. Added `conditionalOn` to Q2. Added `conditionalOn` to `Screen` interface. Added `isScreenHidden()` to nav logic. |
| `app/api/submit-audit-v2/route.ts` | Fixed double-weighting bug. Added capacity fork to `scoreLevers()`. Added capacity flag to interaction flags. Added `capacityStatus` variable. Force VIP CTA when capacity. Added `q2a_answer` + `capacity_flag` to DB insert. |
| `lib/claude-audit.ts` | Added `capacityStatus` and `capacityFlag` to `AuditNarrativeInput`. Wired both into `buildPrompt()`. `primaryScore` now used in constraint diagnosis line. |
| `app/api/admin/regenerate-narrative/route.ts` | New route — POST `{ id }` to re-run Claude for a failed record. |
| `app/admin/audits/page.tsx` | Added `RegenerateNarrativeButton` component. Shown in detail panel for all v2 audits. |
| `migration_capacity_amendment.sql` | Run once in Supabase to add `q2a_answer` and `capacity_flag` columns. |

---

## Run Order (Setup)

1. Run `migration_capacity_amendment.sql` in Supabase SQL editor
2. Deploy updated code
3. Test with the checklist above
