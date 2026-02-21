# Standard Operating Procedure: Monime Payment Integration

**Project:** Startup Bodyshop / Life by Design
**Last Updated:** February 2026
**Scope:** Workshop registration payments via Monime (Sierra Leone)

---

## Honest Status Assessment

> Before treating this as a production-ready integration, read this section.

The code for this integration **exists and is logically complete**, but the following has **not** been confirmed:

- End-to-end tested against the live Monime API
- Verified that Monime sends `payment.created` vs `checkout_session.completed` in the exact format the webhook expects
- Confirmed the exact field names Monime uses in webhook payloads (`data.reference`, `data.id`, etc.)
- Payout functionality does **not exist** in this codebase — it must be done manually via the Monime dashboard

Known issues are marked with ⚠️ throughout this document.

---

## 1. Overview

Monime is the payment gateway used to collect workshop registration fees from customers in Sierra Leone. Prices are set in USD and converted to SLE (Sierra Leone Leone) at checkout. Customers pay via Mobile Money (Afrimoney or Orange Money) using a USSD prompt on their phone.

**Payment amount:** $100 USD → converted to SLE 2,300 at a hardcoded rate of 1 USD = 23 SLE

---

## 2. End-to-End Flow

```
User visits /workshops
        │
        ▼
Clicks CTA → Registration modal opens
        │
        ▼
Step 1: Personal info (name, email, phone)
   [auto-advances when fields filled]
        │
        ▼
Step 2: Business info (name, years operating, goals)
   [auto-advances when fields filled]
   [progress saved to localStorage + Supabase after 1s debounce]
        │
        ▼
Step 3: "Proceed to Payment" button
   POST /api/workshop-registration
   → status: "pending_payment" saved to Supabase
   → payment_reminder email sent to user (with resume link)
        │
        ▼
Payment summary screen shows "Pay with Monime" button
        │
        ▼
User clicks "Pay with Monime"
   POST /api/checkout
   → Monime checkout session created
   → checkout_session_id saved to Supabase
   → returns checkoutUrl
        │
        ▼
Browser redirects → Monime hosted checkout page
        │
        ▼
User selects Mobile Money (Afrimoney / Orange Money)
[handled entirely by Monime]
        │
        ▼
USSD code generated and sent to user's phone
[handled entirely by Monime]
        │
        ▼
User dials USSD code and approves payment
[handled entirely by Monime]
        │
        ▼
┌──────────────────────────────────────────┐
│  Two things happen simultaneously:       │
│                                          │
│  A) Monime redirects browser →           │
│     GET /api/payment/return              │
│     ?status=success&registration=<id>   │
│     → redirects to /workshops            │
│       ?payment=success&registration=<id>│
│     → green banner shown to user         │
│                                          │
│  B) Monime POSTs webhook →               │
│     POST /api/webhooks/monime            │
│     → verifies HMAC-SHA256 signature     │
│     → updates status to "completed"     │
│     → sends confirmation email          │
└──────────────────────────────────────────┘
```

> **Important:** The browser redirect (A) is cosmetic — it just shows the user a banner. The authoritative payment confirmation comes from the webhook (B). These two events may arrive at different times.

---

## 3. Environment Variables

All of these must be set in your hosting environment (Vercel, etc.):

| Variable | Purpose | Where to get it |
|---|---|---|
| `MONIME_ACCESS_TOKEN` | Bearer token for Monime API calls | Monime dashboard → API keys |
| `MONIME_SPACE_ID` | Your merchant space identifier | Monime dashboard → Space settings |
| `MONIME_WEBHOOK_SECRET` | HMAC-SHA256 key for verifying webhook signatures | Monime dashboard → Webhooks |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Supabase dashboard |
| `RESEND_API_KEY` | Email delivery via Resend | resend.com dashboard |
| `NEXT_PUBLIC_SITE_URL` | Your site's base URL | e.g. `https://www.startupbodyshop.com` |

---

## 4. API Endpoints

### 4.1 `POST /api/workshop-registration`

**Purpose:** Saves and updates registration data progressively as the user fills the form.

**Called by:** Registration modal (debounced, on every field change, and explicitly on form submit)

**Key behaviours:**
- If no `registrationId` is provided → creates a new record and returns a new `registrationId`
- If `registrationId` is provided → updates the existing record
- Status is sanitised server-side — clients can only set `in_progress` or `pending_payment` (prevents spoofing `completed`)
- When status reaches `pending_payment` → sends a `payment_reminder` email with a resume link

**Request body:**
```json
{
  "registrationId": "abc123",
  "firstName": "Fatmata",
  "lastName": "Kamara",
  "personalEmail": "fatmata@example.com",
  "businessEmail": "",
  "phone": "+23276123456",
  "countryCode": "+232",
  "businessName": "Kamara Traders",
  "websiteLink": "",
  "businessSnapshot": "",
  "whatYouSell": "",
  "targetCustomers": "",
  "yearsOfOperations": "1-2 Years",
  "businessGoal": "",
  "hearAboutUs": "Instagram",
  "otherSource": "",
  "workshopTitle": "Business Constraint-Breaking Workshop",
  "workshopPrice": 100,
  "status": "pending_payment",
  "currentStep": 3,
  "submittedAt": "2026-02-19T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "registrationId": "abc123xyz",
  "status": "pending_payment"
}
```

---

### 4.2 `GET /api/workshop-registration?id=<registrationId>`

**Purpose:** Fetches a saved registration by ID (used when a user returns via their resume link).

**Response:**
```json
{
  "success": true,
  "registration": { ...full Supabase row... }
}
```

---

### 4.3 `POST /api/checkout`

**Purpose:** Creates a Monime checkout session and returns the hosted checkout URL.

**Called by:** Registration modal when user clicks "Pay with Monime"

**Currency logic:**
- Input: `workshopPrice` in USD (e.g. `100`)
- Conversion: `100 USD × 23 = 2300 SLE` → `2300 × 100 = 230000` minor units (SLE cents)
- Sent to Monime as `currency: "SLE"`, `value: 230000`

⚠️ **Known issue:** The exchange rate (1 USD = 23 SLE) is hardcoded. If the rate changes, this must be updated in `app/api/checkout/route.ts:40`.

**Request body:**
```json
{
  "registrationId": "abc123xyz",
  "workshopTitle": "Business Constraint-Breaking Workshop",
  "workshopPrice": 100,
  "currency": "USD"
}
```

**Monime API call:**
- Endpoint: `POST https://api.monime.io/v1/checkout-sessions`
- Headers: `Authorization: Bearer <token>`, `Monime-Space-Id: <id>`, `Idempotency-Key: <uuid>`
- `successUrl` → `{SITE_URL}/api/payment/return?status=success&registration={id}`
- `cancelUrl` → `{SITE_URL}/api/payment/return?status=cancelled&registration={id}`

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.monime.io/...",
  "sessionId": "ses_xxx"
}
```

After calling Monime, the registration record is updated:
- `checkout_session_id` = Monime session ID
- `status` = `pending_payment`

---

### 4.4 `GET|POST /api/payment/return`

**Purpose:** Handles the browser redirect back from Monime after payment completes or is cancelled.

**This route does NOT update the database.** It only reads URL parameters and redirects the user.

- Success: `→ /workshops?payment=success&registration=<id>` (green banner shown)
- Cancelled: `→ /workshops?payment=cancelled&registration=<id>` (yellow banner shown)

The user can resume a cancelled payment via the `resume_registration` query param:
`/workshops?resume_registration=<id>` → opens modal at Step 3 with pre-filled data.

---

### 4.5 `POST /api/webhooks/monime`

**Purpose:** Receives payment event notifications from Monime. This is the authoritative source of truth for payment completion.

**Webhook URL to register in Monime:** `https://www.startupbodyshop.com/api/webhooks/monime`

**Signature verification:**
- Monime sends a `monime-signature` header containing an HMAC-SHA256 hex digest
- Verified against `MONIME_WEBHOOK_SECRET` using Node.js `crypto.createHmac`

⚠️ **Known issue:** If `MONIME_WEBHOOK_SECRET` is not set in the environment, signature verification is **skipped entirely**. This is a security risk in production — ensure this variable is always set.

⚠️ **Known issue:** The signature comparison uses `===` (string equality), not `crypto.timingSafeEqual()`. This is theoretically vulnerable to timing attacks, though low risk for a webhook endpoint.

**Handled event types:**

| Event | Trigger |
|---|---|
| `payment.created` | A payment is created against the checkout |
| `checkout_session.completed` | The checkout session is marked complete |

**Reference resolution (to find the registration):**
1. First tries `event.data.reference` (should match our `registrationId`)
2. Falls back to `event.data.id` / `event.data.checkoutSessionId` (matches via `checkout_session_id` column)

⚠️ **Known issue:** The exact field names Monime uses in their webhook payload (`data.reference`, `data.id`, etc.) need to be confirmed against the live Monime API or their documentation. A mismatch here would cause the webhook to silently accept the event but fail to find or update the registration.

**On successful match:**
- Sets `status = 'completed'`
- Sets `payment_completed_at = now()`
- Sends `workshop_confirmation` email to the registrant

**Always returns `{ received: true }` with HTTP 200** (even on internal errors) to prevent Monime from retrying indefinitely.

---

## 5. Database: `workshop_registrations` Table (Supabase)

| Column | Type | Notes |
|---|---|---|
| `registration_id` | text (PK) | 12-char base64url random ID |
| `first_name` | text | |
| `last_name` | text | |
| `full_name` | text | Concatenated from first + last |
| `personal_email` | text | |
| `business_email` | text | |
| `phone` | text | Includes country code |
| `country_code` | text | Default `+232` (Sierra Leone) |
| `business_name` | text | |
| `website_link` | text | |
| `business_snapshot` | text | |
| `what_you_sell` | text | |
| `target_customers` | text | |
| `years_of_operations` | text | |
| `business_goal` | text | |
| `hear_about_us` | text | |
| `other_source` | text | |
| `workshop_title` | text | |
| `workshop_price` | numeric | In USD |
| `status` | text | `in_progress` / `pending_payment` / `completed` |
| `current_step` | integer | 1, 2, or 3 |
| `checkout_session_id` | text | Monime session ID |
| `payment_completed_at` | timestamptz | Set by webhook |
| `submitted_at` | timestamptz | When form was submitted |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `ip_address` | text | From `x-forwarded-for` header |
| `user_agent` | text | Browser user agent |

**Payment status lifecycle:**

```
(new record created)
        │
        ▼
   in_progress          ← user filling form, auto-saved
        │
        ▼
  pending_payment       ← user clicked "Proceed to Payment"
        │
        ▼
   completed            ← webhook received from Monime
```

---

## 6. Email Notifications

All emails are sent via **Resend** from `hello@mail.startupbodyshop.com`.

| Template | Trigger | Purpose |
|---|---|---|
| `payment_reminder` | When registration reaches `pending_payment` | Reminds user to complete payment; includes resume link |
| `workshop_confirmation` | When webhook sets status to `completed` | Confirms registration and payment |

**Resume link format:** `https://www.startupbodyshop.com/workshops?resume_registration=<registrationId>`

When a user visits this URL, the modal opens at Step 3 with their data pre-filled from the database.

---

## 7. Payouts (Gap — Not Implemented)

**There is no payout functionality in this codebase.**

To receive funds collected by Monime, you must currently:

1. Log into the Monime merchant dashboard
2. Initiate a payout manually to your Afrimoney account

To automate this in future, a `POST /api/admin/payout` route would need to be built using the Monime Payouts API, restricted to admin access only.

---

## 8. How to Test the Integration

### Step 1 — Verify environment variables are set
```bash
# On Vercel: Dashboard → Project → Settings → Environment Variables
# Check: MONIME_ACCESS_TOKEN, MONIME_SPACE_ID, MONIME_WEBHOOK_SECRET
```

### Step 2 — Test checkout creation
```bash
curl -X POST https://www.startupbodyshop.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "registrationId": "test-reg-001",
    "workshopTitle": "Test Workshop",
    "workshopPrice": 100,
    "currency": "USD"
  }'
# Expected: { "success": true, "checkoutUrl": "https://checkout.monime.io/...", "sessionId": "..." }
```

### Step 3 — Complete a test payment on Monime
- Visit the `checkoutUrl` returned above
- Select Mobile Money → Afrimoney or Orange Money
- Use Monime's sandbox test numbers (check Monime docs for test MSISDN values)
- Complete the USSD flow

### Step 4 — Verify webhook receipt
- Check your server logs for `POST /api/webhooks/monime`
- Confirm the event type and payload structure match what the handler expects
- Check Supabase: `workshop_registrations` row should have `status = 'completed'`

### Step 5 — Verify confirmation email
- The registrant email should receive the `workshop_confirmation` template

### Step 6 — Test webhook manually (without going through Monime UI)
Use the Monime dashboard's webhook test feature, or simulate with:
```bash
# Note: you need to compute a valid HMAC-SHA256 signature for this to pass verification
curl -X POST https://www.startupbodyshop.com/api/webhooks/monime \
  -H "Content-Type: application/json" \
  -H "monime-signature: <computed_hmac>" \
  -d '{
    "type": "checkout_session.completed",
    "data": {
      "id": "<checkout_session_id>",
      "reference": "<registration_id>"
    }
  }'
```

---

## 9. Troubleshooting

### Checkout URL not returned
- Check `MONIME_ACCESS_TOKEN` and `MONIME_SPACE_ID` are set
- Check server logs for `Monime checkout error:` with status code and body
- Confirm the amount in minor units is valid (must be > 0, correct currency)

### Webhook not firing
- Confirm the webhook URL is registered in the Monime dashboard: `/api/webhooks/monime`
- Check `MONIME_WEBHOOK_SECRET` matches what's configured in Monime
- Check server logs for `Webhook signature verification failed`

### Registration not updated after payment
- The webhook handler looks up registrations by `data.reference` (our `registrationId`) first, then by `data.id` (Monime session ID)
- If neither matches a record in `workshop_registrations`, the webhook will log a warning and return `{ received: true }` without updating anything
- Confirm the exact field names in Monime's payload against their API documentation

### User redirected back but status still `pending_payment`
- This is expected if the webhook hasn't arrived yet — the browser redirect is cosmetic
- Wait a few seconds and query Supabase directly to check the status
- If status never changes to `completed`, the webhook is not being processed (see above)

### Resume link not working
- URL format must be: `/workshops?resume_registration=<registrationId>`
- The modal fetches `GET /api/workshop-registration?id=<id>` — confirm the ID exists in Supabase

---

## 10. File Reference

| File | Purpose |
|---|---|
| `app/workshops/page.tsx` | Server component — fetches Sanity content |
| `app/workshops/page.client.tsx` | Client component — manages modal state, reads URL params |
| `components/workshop-registration-modal.tsx` | Full multi-step form + payment initiation |
| `app/api/workshop-registration/route.ts` | Save/update/retrieve registrations |
| `app/api/checkout/route.ts` | Create Monime checkout session |
| `app/api/payment/return/route.ts` | Handle browser redirect from Monime |
| `app/api/webhooks/monime/route.ts` | Receive and process Monime webhooks |
| `lib/email.ts` | All email templates and sending logic |
| `lib/supabase.ts` | Supabase client setup (anon + service role) |

---

## 11. Known Issues Summary

| Issue | Severity | Location |
|---|---|---|
| Exchange rate hardcoded at 1 USD = 23 SLE | Medium | `app/api/checkout/route.ts:40` |
| Webhook verification skipped if secret not set | High | `app/api/webhooks/monime/route.ts:20` |
| Signature comparison not timing-safe (`===` vs `timingSafeEqual`) | Low | `app/api/webhooks/monime/route.ts:8-11` |
| Webhook payload field names unverified against live Monime API | High | `app/api/webhooks/monime/route.ts:30-31` |
| No payout functionality | Medium | Entire codebase |
| `payment_reminder` email sent every time status is `pending_payment` (no dedup) | Low | `app/api/workshop-registration/route.ts:119` |
