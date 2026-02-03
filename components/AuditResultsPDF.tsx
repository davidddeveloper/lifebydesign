// components/AuditResultsPDF.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { LOGO_BASE64 } from '@/lib/logo-base64';

// Exchange rate constant
const SLE_TO_USD_RATE = 22500;

const blue = '#177fc9';
const blueLighter = '#E8F4FD';
const blueLight = '#42adff';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 3,
    borderBottomColor: blue,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: blue,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: 15,
    borderLeft: 4,
    borderLeftColor: blue,
    paddingLeft: 12,
  },
  constraintBox: {
    backgroundColor: blueLighter,
    padding: 20,
    borderRadius: 8,
    borderLeft: 8,
    borderLeftColor: blue,
    marginBottom: 20,
  },
  constraintLabel: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  constraintName: {
    fontSize: 24,
    fontWeight: 700,
    color: blue,
    marginBottom: 8,
  },
  constraintScore: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  text: {
    fontSize: 11,
    color: '#333',
    lineHeight: 1.6,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
  },
  scoreRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    backgroundColor: blueLighter,
    borderRadius: 6,
    borderLeft: 3,
    borderLeftColor: blue,
  },
  scoreName: {
    fontSize: 11,
    fontWeight: 600,
    color: '#333',
  },
  scoreValue: {
    fontSize: 13,
    fontWeight: 700,
    color: blue,
  },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  evidenceItem: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: blueLighter,
    borderRadius: 6,
  },
  evidenceNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: blue,
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    textAlign: 'center',
    paddingTop: 5,
    marginRight: 10,
  },
  evidenceText: {
    flex: 1,
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
  },
  revenueBox: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  revenueLabel: {
    fontSize: 9,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  revenueAmount: {
    fontSize: 22,
    fontWeight: 700,
    color: '#059669',
    marginBottom: 3,
  },
  costBox: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeft: 4,
    borderLeftColor: '#DC2626',
  },
  costAmount: {
    fontSize: 22,
    fontWeight: 700,
    color: '#DC2626',
  },
  quickWinBox: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  quickWinLabel: {
    fontSize: 9,
    color: '#92400E',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: 600,
  },
  quickWinText: {
    fontSize: 11,
    color: '#333',
    marginBottom: 10,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  divider: {
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  // Cover page
  coverPage: {
    padding: 0,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  coverTopBar: {
    height: 8,
    backgroundColor: blue,
  },
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  coverLogo: {
    width: 260,
    height: 113,
    marginBottom: 50,
  },
  coverLine: {
    width: 60,
    height: 3,
    backgroundColor: blue,
    marginBottom: 30,
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  coverBusinessName: {
    fontSize: 22,
    fontWeight: 700,
    color: blue,
    textAlign: 'center',
    marginBottom: 6,
  },
  coverOwner: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  coverDate: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  coverBottom: {
    paddingVertical: 24,
    paddingHorizontal: 60,
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverBottomText: {
    fontSize: 9,
    color: '#999',
  },
});

interface AuditResultsPDFProps {
  data: {
    business_name: string;
    owner_name: string;
    email: string;
    created_at: string;
    final_constraint: string;
    primary_score: number;
    confidence: number;
    reasoning: string;
    scores: Record<string, number>;
    evidence_points: string[];
    revenue_impact: {
      currentMonthly: number;
      potentialMonthly: number;
      monthlyOpportunityCost: number;
      yearlyOpportunityCost: number;
      explanation: string;
    };
    quick_win: {
      action: string;
      impact: string;
      time: string;
    };
  };
}

export const AuditResultsPDF = ({ data }: AuditResultsPDFProps) => {
  const constraint = data.final_constraint || 'Unknown';
  const evidencePoints = Array.isArray(data.evidence_points) ? data.evidence_points
    : typeof data.evidence_points === 'string'
      ? (() => { try { const p = JSON.parse(data.evidence_points as string); return Array.isArray(p) ? p : []; } catch { return []; } })()
      : [];

  const formattedDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverTopBar} />
        <View style={styles.coverContent}>
          <Image style={styles.coverLogo} src={LOGO_BASE64} />
          <View style={styles.coverLine} />
          <Text style={styles.coverTitle}>Constraint Audit</Text>
          <Text style={styles.coverSubtitle}>Business Analysis Report</Text>
          <Text style={styles.coverBusinessName}>{data.business_name}</Text>
          <Text style={styles.coverOwner}>{data.owner_name}</Text>
          {formattedDate ? <Text style={styles.coverDate}>{formattedDate}</Text> : null}
        </View>
        <View style={styles.coverBottom}>
          <Text style={styles.coverBottomText}>startupbodyshop.com</Text>
          <Text style={styles.coverBottomText}>Confidential</Text>
        </View>
      </Page>

      {/* Page 2: Constraint + Scores */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Constraint Audit Results</Text>
          <Text style={styles.subtitle}>{data.business_name} - {data.owner_name}</Text>
          {formattedDate ? <Text style={styles.subtitle}>{formattedDate}</Text> : null}
        </View>

        <View style={styles.section}>
          <View style={styles.constraintBox}>
            <Text style={styles.constraintLabel}>Your #1 Constraint</Text>
            <Text style={styles.constraintName}>{constraint}</Text>
            <Text style={styles.constraintScore}>
              Score: {data.primary_score}/10  |  AI Confidence: {data.confidence}/10
            </Text>
            <Text style={styles.text}>{data.reasoning}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Scorecard</Text>
          {data.scores && Object.entries(data.scores).map(([lever, score]) => (
            <View
              key={lever}
              style={constraint && lever.includes(constraint.split(' ')[0]) ? styles.scoreRowHighlight : styles.scoreRow}
            >
              <Text style={styles.scoreName}>{lever}</Text>
              <Text style={styles.scoreValue}>{score}/10</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Startup Bodyshop  |  startupbodyshop.com  |  +232 30 600 600</Text>
        </View>
      </Page>

      {/* Page 3: Evidence + Revenue Impact */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why This Is Your Bottleneck</Text>
          {evidencePoints.map((point: string, index: number) => (
            <View key={index} style={styles.evidenceItem}>
              <Text style={styles.evidenceNumber}>{index + 1}</Text>
              <Text style={styles.evidenceText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What This Costs You</Text>

          <View style={styles.row}>
            <View style={[styles.revenueBox, styles.col]}>
              <Text style={styles.revenueLabel}>Current Monthly</Text>
              <Text style={styles.revenueAmount}>
                Le {(data.revenue_impact?.currentMonthly || 0).toLocaleString()}M
              </Text>
              <Text style={styles.text}>
                ~${((data.revenue_impact?.currentMonthly || 0) / SLE_TO_USD_RATE).toFixed(0)} USD
              </Text>
            </View>

            <View style={[styles.revenueBox, styles.col]}>
              <Text style={styles.revenueLabel}>Potential Monthly</Text>
              <Text style={styles.revenueAmount}>
                Le {(data.revenue_impact?.potentialMonthly || 0).toLocaleString()}M
              </Text>
            </View>
          </View>

          <View style={styles.costBox}>
            <Text style={styles.revenueLabel}>Monthly Opportunity Cost</Text>
            <Text style={styles.costAmount}>
              Le {(data.revenue_impact?.monthlyOpportunityCost || 0).toLocaleString()}M
            </Text>
            <Text style={[styles.text, { marginTop: 4 }]}>
              That is Le {(data.revenue_impact?.yearlyOpportunityCost || 0).toLocaleString()}M per year
              (~${((data.revenue_impact?.yearlyOpportunityCost || 0) / SLE_TO_USD_RATE).toLocaleString()} USD)
            </Text>
          </View>

          {data.revenue_impact?.explanation && (
            <View style={{ padding: 12, backgroundColor: '#f9fafb', borderRadius: 6 }}>
              <Text style={styles.text}>{data.revenue_impact.explanation}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text>Startup Bodyshop  |  startupbodyshop.com  |  +232 30 600 600</Text>
        </View>
      </Page>

      {/* Page 4: Quick Win + Next Steps */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Win - Start Today</Text>

          <View style={styles.quickWinBox}>
            <Text style={styles.quickWinLabel}>Action</Text>
            <Text style={styles.quickWinText}>{data.quick_win?.action || 'N/A'}</Text>

            <Text style={styles.quickWinLabel}>Expected Impact</Text>
            <Text style={styles.quickWinText}>{data.quick_win?.impact || 'N/A'}</Text>

            <Text style={styles.quickWinLabel}>Time Required</Text>
            <Text style={styles.quickWinText}>{data.quick_win?.time || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Text style={[styles.text, { marginBottom: 8 }]}>
            Ready to break through your #1 constraint? Reach out to discuss your personalized roadmap.
          </Text>
          <Text style={styles.text}>WhatsApp: +232 30 600 600</Text>
          <Text style={styles.text}>Web: startupbodyshop.com</Text>
        </View>

        <View style={styles.footer}>
          <Text>Tenacity Ventures Limited {new Date().getFullYear()} | startupbodyshop.com</Text>
        </View>
      </Page>
    </Document>
  );
};