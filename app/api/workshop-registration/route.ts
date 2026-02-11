// app/api/workshop-registration/route.ts
// Handles progressive saving of workshop registration data
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { randomBytes } from 'crypto';

// Generate a short unique ID
function generateId(length = 12): string {
  return randomBytes(length).toString('base64url').slice(0, length);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      registrationId,
      firstName,
      lastName,
      fullName,
      personalEmail,
      businessEmail,
      phone,
      countryCode,
      businessName,
      websiteLink,
      businessSnapshot,
      whatYouSell,
      targetCustomers,
      yearsOfOperations,
      businessGoal,
      hearAboutUs,
      otherSource,
      workshopTitle,
      workshopPrice,
      status = 'in_progress',
      currentStep = 1,
      submittedAt,
    } = data;

    // Prepare the record
    const record = {
      first_name: firstName,
      last_name: lastName,
      full_name: fullName || `${firstName} ${lastName}`.trim(),
      personal_email: personalEmail,
      business_email: businessEmail,
      phone,
      country_code: countryCode,
      business_name: businessName,
      website_link: websiteLink,
      business_snapshot: businessSnapshot,
      what_you_sell: whatYouSell,
      target_customers: targetCustomers,
      years_of_operations: yearsOfOperations,
      business_goal: businessGoal,
      hear_about_us: hearAboutUs,
      other_source: otherSource,
      workshop_title: workshopTitle,
      workshop_price: workshopPrice,
      status,
      current_step: currentStep,
      submitted_at: submittedAt,
      updated_at: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent'),
    };

    let result;

    if (registrationId) {
      // Update existing registration
      const { data: updated, error } = await supabaseAdmin
        .from('workshop_registrations')
        .update(record)
        .eq('registration_id', registrationId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      result = updated;
    } else {
      // Create new registration with unique ID
      const newRegistrationId = generateId(12);

      const { data: created, error } = await supabaseAdmin
        .from('workshop_registrations')
        .insert({
          ...record,
          registration_id: newRegistrationId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      result = created;
    }

    return NextResponse.json({
      success: true,
      registrationId: result.registration_id,
      status: result.status,
    });

  } catch (error) {
    console.error('Workshop registration error:', error);
    return NextResponse.json(
      { error: 'Failed to save registration' },
      { status: 500 }
    );
  }
}

// GET endpoint to check registration status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('id');

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('workshop_registrations')
      .select('*')
      .eq('registration_id', registrationId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      registration: data,
    });

  } catch (error) {
    console.error('Get registration error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    );
  }
}
