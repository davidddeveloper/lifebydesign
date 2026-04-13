# AI Usage, Token Costs & Credit Planning

**Last updated:** April 2026  
**Current Claude credit balance:** $5.00 USD

---

## Models in Use

| Where | Model | Purpose |
|---|---|---|
| Audit submission | `claude-sonnet-4-6` | Full diagnostic narrative (5 sections) |
| Chat widget | `claude-haiku-4-5-20251001` | Answering user questions about their results |

---

## Pricing Reference (Anthropic API — as of April 2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $0.80 | $4.00 |

---

## Per-Submission Cost: Audit Narrative (Sonnet 4.6)

Every time a user completes and submits the audit, one Sonnet call is made.

### Token breakdown

| Component | Tokens (approx.) |
|---|---|
| System prompt (rules + format instructions) | ~420 |
| User prompt (business context + scores + open-text answers) | ~550 |
| **Total input per call** | **~970 tokens** |
| Output (5 narrative sections, 500–650 words) | **~950 tokens** |

### Cost per submission

```
Input:  970 tokens  × ($3.00  / 1,000,000) = $0.00291
Output: 950 tokens  × ($15.00 / 1,000,000) = $0.01425
─────────────────────────────────────────────────────
Total per audit submission:                  ≈ $0.0172
```

### How many submissions does $5 cover?

```
$5.00 / $0.0172 ≈ 291 audit submissions
```

> With $5, you can process roughly **280–300 audit submissions** (leaving a small buffer for retries and variance in open-text answer length).

---

## Per-Message Cost: Chat Widget (Haiku 4.5)

The AI chat widget fires when a user asks a question about their results. Not every user will use it.

### Token breakdown

| Component | Tokens (approx.) |
|---|---|
| System prompt + full audit context passed as context | ~700 |
| Conversation history (grows per turn, avg 2 prior messages) | ~300 |
| User question | ~30 |
| **Total input per message** | **~1,030 tokens** |
| Output (350 max_tokens, typically ~280 used) | **~280 tokens** |

### Cost per chat message

```
Input:  1,030 tokens × ($0.80 / 1,000,000) = $0.000824
Output:   280 tokens × ($4.00 / 1,000,000) = $0.001120
──────────────────────────────────────────────────────
Total per chat message:                      ≈ $0.0019
```

### Chat messages per dollar

```
$1.00 / $0.0019 ≈ 526 messages per dollar
```

---

## Combined Budget Projections

Assuming **50% of users** engage with the chat widget and ask an average of **3 questions**:

| Submissions | Audit cost | Chat cost (50% × 3 msg) | Total cost | Balance remaining |
|---|---|---|---|---|
| 50 | $0.86 | $0.14 | **$1.00** | $4.00 |
| 100 | $1.72 | $0.28 | **$2.00** | $3.00 |
| 150 | $2.58 | $0.43 | **$3.01** | $1.99 |
| 200 | $3.44 | $0.57 | **$4.01** | $0.99 |
| 225 | $3.87 | $0.64 | **$4.51** | $0.49 |
| **~240** | $4.13 | $0.68 | **~$4.81** | ~$0.19 |

> **Practical ceiling with $5 credit: ~230–240 submissions if chat usage is moderate.**

---

## Worst-Case Scenario

If every user asks 10 chat questions (very heavy usage):

```
Per submission: $0.0172 (audit) + 10 × $0.0019 (chat) = $0.0362
$5.00 / $0.0362 ≈ 138 submissions before credit runs out
```

---

## Best-Case Scenario

If no one uses the chat widget (audit only):

```
$5.00 / $0.0172 ≈ 291 submissions
```

---

## Monitoring & Alerts

### Check usage in Anthropic Console
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. → Usage → filter by model and date range
3. You'll see token counts and cost per day

### Recommended: Set a spend limit
In the Anthropic Console → Billing → Set a monthly spend limit to prevent unexpected overage if submissions spike. Set it at $4.50 to leave a buffer and get an alert before the $5 is exhausted.

### Signs you're running low
- `generateAuditNarrative()` returns an error and the audit falls back to empty narrative fields in the DB
- The API call in `lib/claude-audit.ts` throws `AuthenticationError` or `RateLimitError` with a billing message
- Check server logs in Vercel → Functions → `submit-audit-v2`

---

## Reducing Costs (When You Need To)

### Option 1 — Cache narratives for common profiles
If two businesses have near-identical scores + answers, the outputs will be similar. Not recommended for v1 — personalisation matters.

### Option 2 — Switch narrative generation to Haiku
Haiku is 15× cheaper per output token. The narrative quality will noticeably drop but it remains usable. Change in `lib/claude-audit.ts`:
```ts
// Change this:
model: "claude-sonnet-4-6",
// To this:
model: "claude-haiku-4-5-20251001",
```
Cost per submission drops from **$0.0172 → ~$0.0019** (9× cheaper).  
This gives ~2,600 submissions per $5 instead of ~290.

### Option 3 — Disable chat widget
Remove `<AuditChatWidget />` from `components/AuditResultsV2.tsx`. Saves chat costs entirely, no functional impact on the audit itself.

### Option 4 — Top up
$20 credit ≈ 1,160 full submissions with moderate chat usage. Recommended once you reach 150 submissions.

---

## Recommended Top-Up Schedule

| Milestone | Action |
|---|---|
| 100 submissions | Check Anthropic Console usage |
| 150 submissions | Top up to $20 ($25 total) |
| 500 submissions | Evaluate moving to Haiku for new submissions, keeping Sonnet for paying clients |
| 1,000+ submissions | Consider a monthly budget of $30–50 |

---

## Error Handling

The narrative call in `app/api/submit-audit-v2/route.ts` is non-fatal — if Claude fails (credit exhausted, rate limit, timeout), the audit is still saved to the database with empty narrative fields. The user gets a result page with scores and constraint, but without the written narrative sections.

The admin can manually re-trigger narrative generation for failed records (not yet built — add a "Regenerate narrative" button in `/admin/audits` if this becomes necessary).
