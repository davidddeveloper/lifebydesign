import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const MONIME_API_URL = 'https://api.monime.io';
const MONIME_ACCESS_TOKEN = process.env.MONIME_ACCESS_TOKEN!;
const MONIME_SPACE_ID = process.env.MONIME_SPACE_ID!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://startupbodyshop.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Checkout Request Body:', body);
    const { registrationId, workshopTitle, workshopPrice, currency } = body;

    if (!MONIME_ACCESS_TOKEN || !MONIME_SPACE_ID) {
      console.error('Missing Monime environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!registrationId || !workshopPrice) {
      return NextResponse.json(
        { error: 'Missing required fields: registrationId, workshopPrice' },
        { status: 400 }
      );
    }

    // Currency Conversion Logic
    // Default to SLE if not specified, but we expect input in USD or SLE
    // If input currency is USD, convert to SLE
    // Conversion rate: 1 USD = 23 SLE  (as per requirement: $100 -> ~2300 SLE)
    // Monime expects amounts in minor units (cents)

    let finalCurrency = 'SLE';
    let finalAmountMinor = 0;

    if (currency === 'USD') {
      const rate = 23;
      const amountSLE = workshopPrice * rate;
      finalAmountMinor = Math.round(amountSLE * 100);
    } else {
      // Assume input is already in minor units of SLE or exact amount if SLE is explicitly passed differently
      // But for this specific integration, we know frontend sends major units
      // If frontend sends SLE major units:
      if (currency === 'SLE') {
        finalAmountMinor = Math.round(workshopPrice * 100);
      } else {
        // Fallback/Default behavior matches previous implementation
        // Assuming previous implementation expected minor units directly if no currency handling logic existed
        // However, previous code comments said "already in minor units".
        // We will standardise on frontend sending major units USD.
        const rate = 23;
        const amountSLE = workshopPrice * rate;
        finalAmountMinor = Math.round(amountSLE * 100); // Treating unspecified currency as USD 100 -> 2300 SLE
      }
    }

    // Create Monime checkout session
    const checkoutResponse = await fetch(`${MONIME_API_URL}/v1/checkout-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MONIME_ACCESS_TOKEN}`,
        'Monime-Space-Id': MONIME_SPACE_ID,
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        name: workshopTitle || 'Workshop Registration',
        reference: registrationId,
        description: `Registration for ${workshopTitle || 'Business Constraint-Breaking Workshop'}`,
        lineItems: [
          {
            name: workshopTitle || 'Workshop Fee',
            quantity: 1,
            price: {
              currency: finalCurrency,
              value: finalAmountMinor,
            },
          },
        ],
        successUrl: `${SITE_URL}/workshops?payment=success&registration=${registrationId}`,
        cancelUrl: `${SITE_URL}/workshops?payment=cancelled&registration=${registrationId}`,
      }),
    });

    if (!checkoutResponse.ok) {
      const errorBody = await checkoutResponse.text();
      console.error('Monime checkout error:', checkoutResponse.status, errorBody);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 502 }
      );
    }

    const session = await checkoutResponse.json();
    const checkoutSession = session.result;

    // Store checkout session ID on the registration
    await supabaseAdmin
      .from('workshop_registrations')
      .update({
        checkout_session_id: checkoutSession.id,
        status: 'pending_payment',
        updated_at: new Date().toISOString(),
      })
      .eq('registration_id', registrationId);

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.redirectUrl,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
