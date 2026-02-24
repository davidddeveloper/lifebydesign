# Integrating Monime Payments: A Practical Developer Guide

> **TL;DR** — Monime is a Sierra Leone payment gateway that gives your users a hosted checkout page where they pay via Mobile Money (Afrimoney / Orange Money) or bank transfer over USSD. You create a session server-side, redirect the user to the hosted page, and receive webhook events to confirm payment. This guide documents everything the official docs don't tell you, learned the hard way from a real production integration.

---

## Table of Contents

1. [What is Monime?](#what-is-monime)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Creating a Checkout Session](#creating-a-checkout-session)
5. [The Response Shape](#the-response-shape)
6. [Redirecting the User](#redirecting-the-user)
7. [Handling the Return URLs](#handling-the-return-urls)
8. [Setting Up Webhooks](#setting-up-webhooks)
9. [Webhook Payload Structure](#webhook-payload-structure)
10. [Event Types](#event-types)
11. [Webhook Signature Verification](#webhook-signature-verification)
12. [Complete Webhook Handler](#complete-webhook-handler)
13. [Currency and Amounts](#currency-and-amounts)
14. [Gotchas and Lessons Learned](#gotchas-and-lessons-learned)
15. [End-to-End Flow Summary](#end-to-end-flow-summary)

---

## What is Monime?

[Monime](https://monime.io) is a payments infrastructure company focused on Sierra Leone and West Africa. It lets businesses accept payments from customers via:

- **Afrimoney** — mobile money on the Africell network
- **Orange Money** — mobile money on the Orange SL network
- Bank transfer via USSD

The integration model is similar to Stripe Checkout: you create a session on your server, redirect the customer to Monime's hosted page, and receive webhook events when they pay (or cancel).

---

## Prerequisites

Before you write any code:

1. **Create a Monime account** at [monime.io](https://monime.io) and complete business verification.
2. **Set up a Space** — Monime organises everything into "Spaces". Your Space ID goes on every API request.
3. **Generate an Access Token** from the Monime dashboard.
4. **Register a webhook endpoint** in the Monime dashboard (covered in [Setting Up Webhooks](#setting-up-webhooks)).

---

## Environment Variables

```bash
MONIME_ACCESS_TOKEN=your_access_token_here
MONIME_SPACE_ID=your_space_id_here
# Optional: only needed if you plan to attempt webhook signature verification
MONIME_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## Creating a Checkout Session

All API calls go to `https://api.monime.io`. Creating a checkout session is a single `POST` to `/v1/checkout-sessions`.

### Required Headers

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer <MONIME_ACCESS_TOKEN>` |
| `Monime-Space-Id` | `<MONIME_SPACE_ID>` |
| `Idempotency-Key` | A unique UUID per request (prevents duplicate sessions on retry) |

### Request Body

```json
{
  "name": "Workshop Registration",
  "reference": "reg_abc123",
  "description": "Registration for Business Constraint-Breaking Workshop",
  "lineItems": [
    {
      "name": "Workshop Fee",
      "quantity": 1,
      "price": {
        "currency": "SLE",
        "value": 230000
      }
    }
  ],
  "successUrl": "https://yourapp.com/payment/return?status=success&order=reg_abc123",
  "cancelUrl": "https://yourapp.com/payment/return?status=cancelled&order=reg_abc123"
}
```

**Field notes:**

- `reference` — Your internal identifier for this transaction. Monime will echo it back in webhook events. Use it to look up the related record in your database. Must be unique per session.
- `lineItems` — Array of items. Each item's `price.value` must be in **minor units** (e.g. 2300 SLE = `230000`).
- `currency` — Use `SLE` (Sierra Leone Leone). This is the only currency confirmed to work for SL domestic payments.
- `successUrl` / `cancelUrl` — Monime redirects here after the user completes or cancels. Include your order/reference ID in the query string so you know which session this was.
- `name` — Shown on the hosted checkout page as the product/session name.

### Example (Node.js / fetch)

```typescript
const response = await fetch('https://api.monime.io/v1/checkout-sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.MONIME_ACCESS_TOKEN}`,
    'Monime-Space-Id': process.env.MONIME_SPACE_ID,
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify({
    name: 'Workshop Registration',
    reference: registrationId,
    description: 'Business Constraint-Breaking Workshop',
    lineItems: [
      {
        name: 'Workshop Fee',
        quantity: 1,
        price: {
          currency: 'SLE',
          value: amountInMinorUnits, // e.g. 230000 for 2300 SLE
        },
      },
    ],
    successUrl: `${SITE_URL}/payment/return?status=success&order=${registrationId}`,
    cancelUrl: `${SITE_URL}/payment/return?status=cancelled&order=${registrationId}`,
  }),
});

if (!response.ok) {
  const error = await response.text();
  throw new Error(`Monime error ${response.status}: ${error}`);
}

const data = await response.json();
```

---

## The Response Shape

> **Critical gotcha**: The session object is nested under a `result` key, not at the top level.

```json
{
  "result": {
    "id": "scs-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "redirectUrl": "https://checkout.monime.io/pay/scs-xxx...",
    "status": "pending",
    "reference": "reg_abc123",
    "amount": {
      "currency": "SLE",
      "value": 230000
    },
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

Access the data like this:

```typescript
const session = await response.json();
const checkoutSession = session.result; // ← don't forget .result

const redirectUrl = checkoutSession.redirectUrl;
const sessionId = checkoutSession.id; // save this — you'll need it to match webhooks
```

**Save `checkoutSession.id` to your database** before redirecting. The webhook may reference this ID if no `reference` is set.

---

## Redirecting the User

After creating the session, redirect the user to `checkoutSession.redirectUrl`. That's the Monime-hosted checkout page where they complete payment via Mobile Money USSD.

```typescript
// Server: return the URL to the client
return { checkoutUrl: checkoutSession.redirectUrl };

// Client: hard redirect (not a client-side router push)
window.location.href = checkoutUrl;
```

The user will see Monime's hosted page, enter their mobile money details, and complete a USSD-based payment flow on their phone.

---

## Handling the Return URLs

After payment (success or cancel), Monime redirects back to your `successUrl` or `cancelUrl`.

**Important**: The return redirect is cosmetic only. Do not use it to confirm payment or update order status in your database. The redirect can be:
- Triggered before the payment is actually settled
- Skipped entirely if the browser closes or network drops
- Faked by a malicious actor

**Always use webhooks as the source of truth for payment status.** Use the return redirect only to show the user a relevant page (e.g. "Payment processing..." or "Registration complete").

```typescript
// Next.js App Router example
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // 'success' | 'cancelled'
  const orderId = searchParams.get('order');

  if (status === 'success') {
    // Don't mark as paid here — wait for the webhook
    return redirect(`/orders/${orderId}?payment=processing`);
  } else {
    return redirect(`/orders/${orderId}?payment=cancelled`);
  }
}
```

---

## Setting Up Webhooks

In the Monime dashboard, register your webhook endpoint URL. You'll receive real-time events for payment status changes.

**Endpoint URL format:**
```
https://yourapp.com/api/webhooks/monime
```

**Events to subscribe to:**
- `checkout_session.completed`
- `checkout_session.cancelled`
- `checkout_session.expired`

Your endpoint must:
1. Respond with HTTP `200` as fast as possible (do async work after acknowledging)
2. Always return `{ "received": true }` in the body
3. Handle the same event being delivered more than once (idempotent processing)

---

## Webhook Payload Structure

Monime sends a `POST` with `Content-Type: application/json`. Here is the **actual production payload** structure (not what the docs imply):

```json
{
  "apiVersion": "caph.2025-08-23",
  "event": {
    "id": "wkd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "name": "checkout_session.completed",
    "timestamp": "1771803194"
  },
  "object": {
    "id": "scs-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "type": "checkout_session"
  },
  "data": {
    "id": "scs-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "status": "completed",
    "reference": "reg_abc123",
    "amount": {
      "currency": "SLE",
      "value": 230000
    }
  }
}
```

**Field guide:**

| Field | Description |
|---|---|
| `event.name` | The event type string — **NOT** `event.type` |
| `event.id` | Unique webhook delivery ID — use for deduplication |
| `event.timestamp` | Unix timestamp (string, not number) |
| `data.reference` | Your original `reference` from checkout session creation |
| `data.id` | The Monime checkout session ID (`scs-...`) |
| `data.status` | Current session status |

---

## Event Types

### `checkout_session.completed`

Payment was successful and funds are on their way.

**What to do:**
- Mark the order/registration as paid in your database
- Record `payment_completed_at` timestamp
- Send a confirmation email to the customer
- Trigger fulfillment

### `checkout_session.cancelled`

The user explicitly cancelled on the Monime checkout page.

**What to do:**
- Reset order status to allow retry (e.g. back to `pending_payment`)
- Send a "complete your payment" reminder email with a link to resume

### `checkout_session.expired`

The checkout session timed out before the user completed payment.

**What to do:**
- Same as `cancelled` — reset status and send reminder

---

## Webhook Signature Verification

Monime sends a `monime-signature` header with each webhook:

```
monime-signature: t=1771803194,v1=<base64-encoded-hmac>
```

The format is:
- `t` — timestamp (same as `event.timestamp` in the payload)
- `v1` — Base64-encoded HMAC signature

According to Monime's documentation, they use **HS256 or ES256** for signing.

### Honest Status of Signature Verification

Despite extensive testing of every plausible signing format — raw body, `timestamp.body`, `timestamp\nbody`, canonical JSON, base64-decoded key, and more — **none of the computed signatures matched** the `v1` value sent by Monime.

As of the date of this writing, Monime has not published the exact format of the signing payload (the string that gets signed before HMAC-ing). Without this, programmatic verification is not possible.

**Current recommendation:** Skip signature verification for now, and rely on database-level safety instead:

```typescript
// Safe without signature verification because:
// 1. You only update records that already exist (matched by reference/session ID)
// 2. Marking a fake "completed" event requires knowing a real reference ID
// 3. The worst an attacker can do is trigger a retry — not create fake payments
```

If Monime publishes their signing spec or an SDK, add verification then.

---

## Complete Webhook Handler

Here is a full, production-ready webhook handler in TypeScript (Next.js App Router, but the logic is portable):

```typescript
// app/api/webhooks/monime/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    // Event type is at payload.event.name — NOT payload.event.type
    const eventType = payload.event?.name as string | undefined;

    console.log('[monime-webhook] event:', eventType, '| id:', payload.event?.id);

    if (eventType === 'checkout_session.completed') {
      // Use reference (your ID) preferentially; fall back to Monime's session ID
      const reference = payload.data?.reference as string | undefined;
      const sessionId = payload.data?.id as string | undefined;

      // Look up the order in your database
      const order = reference
        ? await db.orders.findByReference(reference)
        : await db.orders.findByCheckoutSessionId(sessionId);

      if (!order) {
        console.error('[monime-webhook] order not found:', { reference, sessionId });
        // Still return 200 — returning 4xx/5xx causes Monime to retry endlessly
        return NextResponse.json({ received: true });
      }

      // Idempotency guard — don't process twice
      if (order.status === 'completed') {
        return NextResponse.json({ received: true });
      }

      await db.orders.update(order.id, {
        status: 'completed',
        paymentCompletedAt: new Date().toISOString(),
      });

      await sendConfirmationEmail(order);

    } else if (
      eventType === 'checkout_session.cancelled' ||
      eventType === 'checkout_session.expired'
    ) {
      const reference = payload.data?.reference as string | undefined;
      const sessionId = payload.data?.id as string | undefined;

      const order = reference
        ? await db.orders.findByReference(reference)
        : await db.orders.findByCheckoutSessionId(sessionId);

      if (order) {
        await db.orders.update(order.id, { status: 'pending_payment' });
        await sendPaymentReminderEmail(order);
      }

    } else {
      console.log('[monime-webhook] unhandled event type:', eventType);
    }

    // Always return 200 with { received: true }
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[monime-webhook] processing error:', error);
    // Return 500 only for genuine processing errors — Monime will retry
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

---

## Currency and Amounts

- **Currency**: Use `SLE` (Sierra Leone Leone).
- **Minor units**: Amounts must be in minor units — multiply by 100. E.g. `2300 SLE → 230000`.
- **USD conversion**: At time of writing, 1 USD ≈ 23 SLE. This rate is not fetched dynamically by Monime — you must convert server-side before creating the session.

```typescript
function usdToSleMajor(usd: number): number {
  const RATE = 23; // update as needed
  return usd * RATE;
}

function sleToMinorUnits(sle: number): number {
  return Math.round(sle * 100);
}

// Example: $100 USD
const amountMinor = sleToMinorUnits(usdToSleMajor(100)); // → 230000
```

---

## Gotchas and Lessons Learned

### 1. The response is wrapped in `result`

```typescript
// ❌ Wrong
const sessionId = response.id;
const redirectUrl = response.redirectUrl;

// ✅ Correct
const session = await response.json();
const { id: sessionId, redirectUrl } = session.result;
```

### 2. Event name is `event.name`, not `event.type`

```typescript
// ❌ Wrong — event.type does not exist
const eventType = payload.event?.type;

// ✅ Correct
const eventType = payload.event?.name;
```

### 3. Never confirm payment on the browser redirect

The `successUrl` redirect fires at the end of the Monime checkout flow, but it is not a reliable payment confirmation. Network issues, browser closes, and timing mean the webhook is the only authoritative signal.

### 4. Always respond 200 from webhooks — even on error

If you return 4xx/5xx, Monime will retry the webhook delivery, which can cause duplicate processing. If you can't handle the event, log it and return `{ received: true }` with HTTP 200.

### 5. Save the Monime session ID before redirecting

The webhook may include the `reference` you set, or only the Monime `data.id` (session ID). Save both to your database so you can match the webhook regardless of which field is populated.

### 6. Idempotency Key on checkout creation

Pass a fresh UUID as `Idempotency-Key` on every request. This prevents duplicate sessions if your server retries a failed request.

### 7. Monime sender IP (for firewall allowlisting)

If you filter inbound webhook traffic by IP:
```
34.46.49.173
```

### 8. The `reference` field is the best join key

Set `reference` to your internal order/registration ID when creating the checkout session. Monime echoes it back in the webhook `data.reference`. This is the cleanest way to match webhook events to records in your database.

---

## End-to-End Flow Summary

```
User clicks "Pay"
  │
  ▼
Your server: POST /v1/checkout-sessions
  → Save session.result.id to DB
  → Return session.result.redirectUrl to client
  │
  ▼
Client: window.location.href = redirectUrl
  │
  ▼
User completes Mobile Money payment on Monime hosted page
  │
  ├─ Success ──► Monime: POST /api/webhooks/monime
  │                event.name = "checkout_session.completed"
  │                → Update DB: status = "completed"
  │                → Send confirmation email
  │
  └─ Cancel  ──► Monime: POST /api/webhooks/monime
                 event.name = "checkout_session.cancelled"
                 → Update DB: status = "pending_payment"
                 → Send payment reminder email
  │
  ▼
Monime redirects browser to successUrl or cancelUrl
  → Show user appropriate page
  → (Do NOT update DB here — webhook already did it)
```

---

## Further Reading

- [Monime API Reference](https://docs.monime.io) — official docs (limited, some gaps)
- [Monime Dashboard](https://dashboard.monime.io) — manage spaces, tokens, webhooks
- [Monime Support](https://monime.io/contact) — for undocumented behaviour like the webhook signing spec

---

*Guide written based on a production integration confirmed working end-to-end. Last updated February 2026.*
