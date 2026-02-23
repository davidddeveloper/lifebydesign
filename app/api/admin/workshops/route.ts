import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('workshop_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, registrations: data || [] });
  } catch (error) {
    console.error('Error fetching workshop registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { registrationId, updates } = await request.json();

    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId required' }, { status: 400 });
    }

    // Whitelist updatable fields to prevent unintended overwrites
    const allowed = ['status', 'payment_completed_at', 'notes'];
    const safeUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
      if (key in updates) safeUpdates[key] = updates[key];
    }

    const { data, error } = await supabaseAdmin
      .from('workshop_registrations')
      .update(safeUpdates)
      .eq('registration_id', registrationId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, registration: data });
  } catch (error) {
    console.error('Error updating workshop registration:', error);
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}
