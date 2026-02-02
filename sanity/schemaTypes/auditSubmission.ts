import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const auditSubmission = defineType({
  name: 'auditSubmission',
  title: 'Audit Submissions',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    // Basic Info
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
    }),
    defineField({
      name: 'ownerName',
      title: 'Owner Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
    }),
    defineField({
      name: 'yearsInBusiness',
      title: 'Years in Business',
      type: 'number',
    }),
    defineField({
      name: 'monthlyRevenue',
      title: 'Monthly Revenue',
      type: 'number',
    }),
    defineField({
      name: 'numberOfCustomers',
      title: 'Number of Customers',
      type: 'number',
    }),
    defineField({
      name: 'teamSize',
      title: 'Team Size',
      type: 'number',
    }),

    // WHO (Market)
    defineField({
      name: 'idealCustomer',
      title: 'Ideal Customer',
      type: 'text',
    }),
    defineField({
      name: 'customerTypes',
      title: 'Customer Types',
      type: 'string',
    }),
    defineField({
      name: 'newCustomersLastMonth',
      title: 'New Customers Last Month',
      type: 'string',
    }),
    defineField({
      name: 'conversionRate',
      title: 'Conversion Rate',
      type: 'string',
    }),
    defineField({
      name: 'biggestProblem',
      title: 'Biggest Problem',
      type: 'text',
    }),
    defineField({
      name: 'turnDownBadFits',
      title: 'Turn Down Bad Fits',
      type: 'string',
    }),

    // WHAT (Offer)
    defineField({
      name: 'mainProblemSolved',
      title: 'Main Problem Solved',
      type: 'text',
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
    }),
    defineField({
      name: 'avgTransactionValue',
      title: 'Average Transaction Value',
      type: 'string',
    }),
    defineField({
      name: 'pricingVsCompetitors',
      title: 'Pricing vs Competitors',
      type: 'string',
    }),
    defineField({
      name: 'customerSatisfaction',
      title: 'Customer Satisfaction',
      type: 'string',
    }),
    defineField({
      name: 'referralFrequency',
      title: 'Referral Frequency',
      type: 'string',
    }),
    defineField({
      name: 'proofLevel',
      title: 'Proof Level',
      type: 'string',
    }),

    // SELL (Conversion)
    defineField({
      name: 'hasSalesScript',
      title: 'Has Sales Script',
      type: 'string',
    }),
    defineField({
      name: 'salesConversations',
      title: 'Sales Conversations',
      type: 'string',
    }),
    defineField({
      name: 'conversionToCustomer',
      title: 'Conversion to Customer',
      type: 'string',
    }),
    defineField({
      name: 'timeToClose',
      title: 'Time to Close',
      type: 'string',
    }),
    defineField({
      name: 'reasonsNotBuying',
      title: 'Reasons Not Buying',
      type: 'text',
    }),
    defineField({
      name: 'followUpSystem',
      title: 'Follow Up System',
      type: 'string',
    }),

    // TRAFFIC (Leads)
    defineField({
      name: 'trafficReferrals',
      title: 'Traffic from Referrals (%)',
      type: 'number',
    }),
    defineField({
      name: 'trafficSocial',
      title: 'Traffic from Social (%)',
      type: 'number',
    }),
    defineField({
      name: 'trafficAds',
      title: 'Traffic from Ads (%)',
      type: 'number',
    }),
    defineField({
      name: 'trafficPartnerships',
      title: 'Traffic from Partnerships (%)',
      type: 'number',
    }),
    defineField({
      name: 'trafficWalkIns',
      title: 'Traffic from Walk-ins (%)',
      type: 'number',
    }),
    defineField({
      name: 'trafficOther',
      title: 'Traffic from Other (%)',
      type: 'number',
    }),
    defineField({
      name: 'postingFrequency',
      title: 'Posting Frequency',
      type: 'string',
    }),
    defineField({
      name: 'weeklyReach',
      title: 'Weekly Reach',
      type: 'string',
    }),
    defineField({
      name: 'monthlyLeads',
      title: 'Monthly Leads',
      type: 'string',
    }),
    defineField({
      name: 'leadPredictability',
      title: 'Lead Predictability',
      type: 'string',
    }),
    defineField({
      name: 'hasLeadMagnet',
      title: 'Has Lead Magnet',
      type: 'string',
    }),

    // OPERATIONS (Delivery)
    defineField({
      name: 'businessWithoutYou',
      title: 'Business Without You',
      type: 'string',
    }),
    defineField({
      name: 'writtenProcedures',
      title: 'Written Procedures',
      type: 'string',
    }),
    defineField({
      name: 'repeatPurchases',
      title: 'Repeat Purchases',
      type: 'string',
    }),
    defineField({
      name: 'hasUpsells',
      title: 'Has Upsells',
      type: 'string',
    }),
    defineField({
      name: 'trackNumbers',
      title: 'Track Numbers',
      type: 'string',
    }),
    defineField({
      name: 'profitMargin',
      title: 'Profit Margin',
      type: 'string',
    }),
    defineField({
      name: 'hoursPerWeek',
      title: 'Hours Per Week',
      type: 'string',
    }),
    defineField({
      name: 'timeOnVsIn',
      title: 'Time On vs In Business',
      type: 'string',
    }),

    // FINAL
    defineField({
      name: 'topChallenge',
      title: 'Top Challenge',
      type: 'text',
    }),
    defineField({
      name: 'oneThingToFix',
      title: 'One Thing to Fix',
      type: 'text',
    }),
    defineField({
      name: 'twelveMonthGoal',
      title: '12-Month Goal',
      type: 'text',
    }),

    // =========== RESULTS FROM N8N ===========
    defineField({
      name: 'scores',
      title: 'Lever Scores',
      type: 'object',
      fields: [
        defineField({ name: 'who', title: 'WHO (Market)', type: 'number' }),
        defineField({ name: 'what', title: 'WHAT (Offer)', type: 'number' }),
        defineField({ name: 'sell', title: 'HOW YOU SELL (Conversion)', type: 'number' }),
        defineField({ name: 'traffic', title: 'HOW THEY FIND YOU (Traffic)', type: 'number' }),
        defineField({ name: 'operations', title: 'HOW YOU DELIVER (Operations)', type: 'number' }),
      ],
    }),

    defineField({
      name: 'primaryConstraint',
      title: 'Primary Constraint',
      type: 'string',
      description: 'The main constraint holding the business back',
    }),
    defineField({
      name: 'primaryScore',
      title: 'Primary Constraint Score',
      type: 'number',
    }),
    defineField({
      name: 'secondaryConstraint',
      title: 'Secondary Constraint',
      type: 'string',
    }),
    defineField({
      name: 'secondaryScore',
      title: 'Secondary Constraint Score',
      type: 'number',
    }),

    defineField({
      name: 'confidence',
      title: 'AI Confidence',
      type: 'number',
      description: 'Confidence level of the AI analysis (0-10)',
    }),
    defineField({
      name: 'reasoning',
      title: 'AI Reasoning',
      type: 'text',
      description: 'Explanation of why this constraint was identified',
    }),
    defineField({
      name: 'evidencePoints',
      title: 'Evidence Points',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // Revenue Impact
    defineField({
      name: 'revenueImpact',
      title: 'Revenue Impact Analysis',
      type: 'object',
      fields: [
        defineField({ name: 'currentMonthly', title: 'Current Monthly Revenue', type: 'number' }),
        defineField({ name: 'potentialMonthly', title: 'Potential Monthly Revenue', type: 'number' }),
        defineField({ name: 'monthlyOpportunityCost', title: 'Monthly Opportunity Cost', type: 'number' }),
        defineField({ name: 'yearlyOpportunityCost', title: 'Yearly Opportunity Cost', type: 'number' }),
        defineField({ name: 'explanation', title: 'Explanation', type: 'text' }),
      ],
    }),

    // Quick Win
    defineField({
      name: 'quickWin',
      title: 'Quick Win Recommendation',
      type: 'object',
      fields: [
        defineField({ name: 'action', title: 'Action', type: 'text' }),
        defineField({ name: 'impact', title: 'Expected Impact', type: 'string' }),
        defineField({ name: 'time', title: 'Time to Implement', type: 'string' }),
      ],
    }),

    // Metadata
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Contact', value: 'pending_contact' },
          { title: 'Nurturing', value: 'nurturing' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Converted', value: 'converted' },
        ],
      },
    }),
    defineField({
      name: 'supabaseId',
      title: 'Supabase ID',
      type: 'string',
      description: 'Reference to the Supabase audit record',
      readOnly: true,
    }),
    defineField({
      name: 'dashboardId',
      title: 'Dashboard ID',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'referralSource',
      title: 'Referral Source',
      type: 'string',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'businessName',
      constraint: 'primaryConstraint',
      owner: 'ownerName',
      email: 'email',
      status: 'status',
      yearlyCost: 'revenueImpact.yearlyOpportunityCost',
      submittedAt: 'submittedAt',
    },
    prepare({ title, constraint, owner, email, status, yearlyCost, submittedAt }) {
      const statusEmoji = {
        pending_contact: '🔴',
        nurturing: '🟡',
        contacted: '🟢',
        converted: '✅',
      }[status as string] || '⚪'

      const constraintEmoji = constraint?.includes('WHO') ? '👥' :
        constraint?.includes('WHAT') ? '💎' :
        constraint?.includes('SELL') ? '🤝' :
        constraint?.includes('FIND') ? '📢' :
        constraint?.includes('DELIVER') ? '⚙️' : '🎯'

      const formattedDate = submittedAt
        ? new Date(submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : ''

      const costDisplay = yearlyCost ? `Le ${(yearlyCost / 1000000).toFixed(1)}M/yr` : ''

      return {
        title: `${statusEmoji} ${title || 'Unnamed Business'}`,
        subtitle: [
          `${constraintEmoji} ${constraint || 'No constraint'}`,
          owner,
          email,
          costDisplay,
          formattedDate,
        ].filter(Boolean).join(' • '),
      }
    },
  },
  orderings: [
    {
      title: 'Submitted Date, New',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Business Name',
      name: 'businessNameAsc',
      by: [{ field: 'businessName', direction: 'asc' }],
    },
    {
      title: 'Yearly Opportunity Cost',
      name: 'opportunityCostDesc',
      by: [{ field: 'revenueImpact.yearlyOpportunityCost', direction: 'desc' }],
    },
  ],
})
