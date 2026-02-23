import type { CollectionConfig } from 'payload'

export const AuditSubmissions: CollectionConfig = {
  slug: 'audit-submissions',
  admin: {
    useAsTitle: 'businessName',
    defaultColumns: ['businessName', 'ownerName', 'email', 'status', 'createdAt'],
    description: 'Business Constraint Audit submissions with AI analysis results',
  },
  access: {
    read: ({ req }) => {
      return req.user !== null
    },
    create: () => true,
  },
  fields: [
    // Basic Info
    { name: 'businessName', type: 'text' },
    { name: 'ownerName', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'industry', type: 'text' },
    { name: 'monthlyRevenue', type: 'number' },

    // AI Scores
    {
      name: 'scores',
      type: 'group',
      fields: [
        { name: 'who', type: 'number' },
        { name: 'what', type: 'number' },
        { name: 'sell', type: 'number' },
        { name: 'traffic', type: 'number' },
        { name: 'operations', type: 'number' },
      ],
    },

    // Constraint Analysis
    { name: 'primaryConstraint', type: 'text' },
    { name: 'secondaryConstraint', type: 'text' },
    { name: 'reasoning', type: 'textarea' },

    // Revenue Impact
    {
      name: 'revenueImpact',
      type: 'group',
      fields: [
        { name: 'currentMonthly', type: 'number' },
        { name: 'potentialMonthly', type: 'number' },
        { name: 'monthlyOpportunityCost', type: 'number' },
        { name: 'yearlyOpportunityCost', type: 'number' },
        { name: 'explanation', type: 'textarea' },
      ],
    },

    // Quick Win
    {
      name: 'quickWin',
      type: 'group',
      fields: [
        { name: 'action', type: 'text' },
        { name: 'impact', type: 'text' },
        { name: 'time', type: 'text' },
      ],
    },

    // Status & References
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Nurturing', value: 'nurturing' },
        { label: 'Pending Contact', value: 'pending_contact' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Converted', value: 'converted' },
      ],
      defaultValue: 'nurturing',
      admin: { position: 'sidebar' },
    },
    { name: 'supabaseId', type: 'text', admin: { position: 'sidebar' } },
    { name: 'dashboardId', type: 'text', admin: { position: 'sidebar' } },
  ],
  timestamps: true,
}
