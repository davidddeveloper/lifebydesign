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
      // Security: Sanitize status to prevent spoofing 'completed' or 'paid'
      status: rawStatus = 'in_progress',
      currentStep = 1,
      submittedAt,
    } = data;

    // Only allow specific statuses from client-side
    const ALLOWED_CLIENT_STATUSES = ['in_progress', 'pending_payment'];
    const status = ALLOWED_CLIENT_STATUSES.includes(rawStatus) ? rawStatus : 'in_progress';

    // Prepare the record
    const record = {
      // ... (rest is same, but I need to map the lines correctly)
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



    // Send payment reminder email if status is pending_payment
    // and we haven't already sent it (optimally we'd check, but for now just send)
    // We import dynamically to avoid circular deps if any (though lib/email is leaf)
    if (result.status === 'pending_payment') {
      try {
        const { sendEmail } = await import('@/lib/email');
        const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.startupbodyshop.com';
        const resumeLink = `${SITE_URL}/workshops?resume_registration=${result.registration_id}`;

        await sendEmail('payment_reminder', {
          email: result.personal_email || result.business_email,
          name: result.first_name || 'Valued Customer',
          businessName: result.business_name,
          workshopTitle: result.workshop_title,
        }, { body: resumeLink }); // Passing link as body for this template
      } catch (emailError) {
        console.error('Failed to send payment reminder email:', emailError);
        // Don't fail the request, just log
      }
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
