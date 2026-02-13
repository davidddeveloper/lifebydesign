import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const MONIME_API_URL = 'https://api.monime.io';
const MONIME_ACCESS_TOKEN = process.env.MONIME_ACCESS_TOKEN!;
const MONIME_SPACE_ID = process.env.MONIME_SPACE_ID!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://startupbodyshop.com';

export async function POST(request: NextRequest) {
  try {
    const { registrationId, workshopTitle, workshopPrice, currency } = await request.json();

    if (!registrationId || !workshopPrice) {
      return NextResponse.json(
        { error: 'Missing required fields: registrationId, workshopPrice' },
        { status: 400 }
      );
    }

    // Create Monime checkout session
    const checkoutResponse = await fetch(`${MONIME_API_URL}/v1/checkout-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MONIME_ACCESS_TOKEN}`,
        'Monime-Space-Id': MONIME_SPACE_ID,
      },
      body: JSON.stringify({
        name: workshopTitle || 'Workshop Registration',
        reference: registrationId,
        description: `Registration for ${workshopTitle || 'Business Constraint-Breaking Workshop'}`,
        lineItems: [
          {
            name: workshopTitle || 'Workshop Fee',
            quantity: 1,
            amount: {
              currency: currency || 'USD',
              value: workshopPrice, // already in minor units (cents)
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

    // Store checkout session ID on the registration
    await supabaseAdmin
      .from('workshop_registrations')
      .update({
        checkout_session_id: session.id,
        status: 'pending_payment',
        updated_at: new Date().toISOString(),
      })
      .eq('registration_id', registrationId);

    return NextResponse.json({
      success: true,
      checkoutUrl: session.redirectUrl,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
