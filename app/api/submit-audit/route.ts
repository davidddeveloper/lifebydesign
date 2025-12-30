// app/api/submit-audit/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    console.log('Received audit submission:', formData);
    console.log('N8N Webhook URL:', process.env.N8N_WEBHOOK_URL);

    // Send to n8n webhook
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await n8nResponse.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting audit:', error);
    return NextResponse.json(
      { error: 'Failed to process audit' },
      { status: 500 }
    );
  }
}