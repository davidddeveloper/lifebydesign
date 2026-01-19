// components/AuditResultsPDF.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

// Register fonts (optional, for better typography)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
  },
  header: {
    marginBottom: 30,
    borderBottom: 3,
    borderBottomColor: '#FF6B35',
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#FF6B35',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: 15,
    borderLeft: 4,
    borderLeftColor: '#FF6B35',
    paddingLeft: 12,
  },
  constraintBox: {
    backgroundColor: '#FFF5F0',
    padding: 20,
    borderRadius: 8,
    borderLeft: 8,
    borderLeftColor: '#FF6B35',
    marginBottom: 20,
  },
  constraintLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  constraintName: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FF6B35',
    marginBottom: 8,
  },
  constraintScore: {
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    color: '#333',
    lineHeight: 1.6,
  },
  scoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  scoreName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#333',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#FF6B35',
  },
  evidenceItem: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FFF5F0',
    borderRadius: 6,
  },
  evidenceNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
    paddingTop: 5,
    marginRight: 12,
  },
  evidenceText: {
    flex: 1,
    fontSize: 11,
    color: '#333',
    lineHeight: 1.5,
  },
  revenueBox: {
    backgroundColor: '#F0FDF4',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  revenueLabel: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  revenueAmount: {
    fontSize: 24,
    fontWeight: 700,
    color: '#059669',
    marginBottom: 4,
  },
  costBox: {
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  costAmount: {
    fontSize: 24,
    fontWeight: 700,
    color: '#DC2626',
  },
  quickWinBox: {
    backgroundColor: '#FFFBEB',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  quickWinLabel: {
    fontSize: 10,
    color: '#92400E',
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: 600,
  },
  quickWinText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    borderTop: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
  },
  chartPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 20,
  },
});

interface AuditResultsPDFProps {
  data: any;
}

export const AuditResultsPDF = ({ data }: AuditResultsPDFProps) => (
  <Document>
    {/* Page 1: Header + Constraint */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Business Constraint Audit Results</Text>
        <Text style={styles.subtitle}>{data.business_name}</Text>
        <Text style={styles.subtitle}>
          Analyzed on {new Date(data.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Main Constraint */}
      <View style={styles.section}>
        <View style={styles.constraintBox}>
          <Text style={styles.constraintLabel}>Your #1 Constraint</Text>
          <Text style={styles.constraintName}>{data.final_constraint}</Text>
          <Text style={styles.constraintScore}>
            Score: {data.primary_score}/10 • AI Confidence: {data.confidence}/10
          </Text>
          <Text style={styles.text}>{data.reasoning}</Text>
        </View>
      </View>

      {/* Scores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Full Scorecard</Text>
        {Object.entries(data.scores).map(([lever, score]: [string, any]) => (
          <View key={lever} style={styles.scoreCard}>
            <Text style={styles.scoreName}>{lever}</Text>
            <Text style={styles.scoreValue}>{score}/10</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>Startup Bodyshop | Joe Abass Bangura</Text>
        <Text>startupbodyshop.com • +232 30 600 800</Text>
      </View>
    </Page>

    {/* Page 2: Evidence + Revenue Impact */}
    <Page size="A4" style={styles.page}>
      {/* Evidence */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why This Is Your Bottleneck</Text>
        {data.evidence_points.map((point: string, index: number) => (
          <View key={index} style={styles.evidenceItem}>
            <Text style={styles.evidenceNumber}>{index + 1}</Text>
            <Text style={styles.evidenceText}>{point}</Text>
          </View>
        ))}
      </View>

      {/* Revenue Impact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What This Costs You</Text>
        
        <View style={styles.revenueBox}>
          <Text style={styles.revenueLabel}>Current Monthly Revenue</Text>
          <Text style={styles.revenueAmount}>
            Le {data.revenue_impact.currentMonthly.toLocaleString()}M
          </Text>
          <Text style={styles.text}>
            ~${(data.revenue_impact.currentMonthly / 25000).toFixed(0)} USD
          </Text>
        </View>

        <View style={styles.revenueBox}>
          <Text style={styles.revenueLabel}>Potential Monthly Revenue</Text>
          <Text style={styles.revenueAmount}>
            Le {data.revenue_impact.potentialMonthly.toLocaleString()}M
          </Text>
          <Text style={styles.text}>{data.revenue_impact.explanation}</Text>
        </View>

        <View style={styles.costBox}>
          <Text style={styles.revenueLabel}>💸 Monthly Opportunity Cost</Text>
          <Text style={styles.costAmount}>
            Le {data.revenue_impact.monthlyOpportunityCost.toLocaleString()}M
          </Text>
          <Text style={styles.text}>
            That's Le {data.revenue_impact.yearlyOpportunityCost.toLocaleString()}M per year
            (${(data.revenue_impact.yearlyOpportunityCost / 25000).toLocaleString()} USD)
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>© {new Date().getFullYear()} Tenacity Ventures Limited. All rights reserved.</Text>
      </View>
    </Page>

    {/* Page 3: Quick Win + Next Steps */}
    <Page size="A4" style={styles.page}>
      {/* Quick Win */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Win (Start Today!)</Text>
        
        <View style={styles.quickWinBox}>
          <Text style={styles.quickWinLabel}>ACTION</Text>
          <Text style={styles.quickWinText}>{data.quick_win.action}</Text>

          <Text style={styles.quickWinLabel}>EXPECTED IMPACT</Text>
          <Text style={styles.quickWinText}>{data.quick_win.impact}</Text>

          <Text style={styles.quickWinLabel}>TIME REQUIRED</Text>
          <Text style={styles.quickWinText}>⏱️ {data.quick_win.time}</Text>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ready to Fix This in 90 Days?</Text>
        <Text style={styles.text}>
          Get your personalized 90-day roadmap and book a strategy session to discuss implementation.
        </Text>
        <Text style={[styles.text, { marginTop: 15 }]}>
          📧 Email: joe@10na.city
        </Text>
        <Text style={styles.text}>
          📱 WhatsApp: +232 30 600 800
        </Text>
        <Text style={styles.text}>
          📅 Book a call: calendly.com/joe-tenacity/audit-results
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>Let's 2x your revenue in 90 days! 🚀</Text>
      </View>
    </Page>
  </Document>
);