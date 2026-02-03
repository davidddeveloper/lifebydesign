import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const audits = await client.fetch(
      `*[_type == "auditSubmission"] | order(submittedAt desc) {
        _id,
        businessName,
        ownerName,
        email,
        phone,
        industry,
        monthlyRevenue,
        scores,
        primaryConstraint,
        primaryScore,
        confidence,
        reasoning,
        evidencePoints,
        revenueImpact,
        quickWin,
        status,
        dashboardId,
        submittedAt
      }`
    );

    return NextResponse.json({ audits });
  } catch (error) {
    console.error('Error fetching audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}
