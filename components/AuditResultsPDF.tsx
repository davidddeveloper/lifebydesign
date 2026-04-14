// components/AuditResultsPDF.tsx
// Used by admin export (/admin/audits). Separate from AuditResultsPDFV2.tsx (used on results page).
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { LOGO_BASE64 } from '@/lib/logo-base64';
import { USD_TO_SLE, formatSLE, usdHint } from '@/lib/currency';

const blue = '#177fc9';
const blueLighter = '#E8F4FD';

const styles = StyleSheet.create({
  page: {
    padding: 44,
    paddingTop: 36,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },

  // Per-page header (logo + title)
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 14,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
  },
  pageHeaderLeft: {
    flex: 1,
  },
  pageHeaderLogo: {
    width: 72,
    height: 31,
  },
  pageHeaderTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  pageHeaderSub: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },

  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#9CA3AF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  // Constraint highlight box
  constraintBox: {
    backgroundColor: blueLighter,
    padding: 16,
    borderRadius: 6,
    borderLeft: 4,
    borderLeftColor: blue,
    marginBottom: 20,
  },
  constraintLabel: {
    fontSize: 8,
    color: blue,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  constraintName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  constraintScore: {
    fontSize: 10,
    color: '#555',
    marginBottom: 10,
  },

  text: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
  },

  // Score rows with bar
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  scoreLabel: {
    fontSize: 9,
    color: '#374151',
    width: 130,
  },
  scoreBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  scoreBarFill: {
    height: 6,
    backgroundColor: blue,
    borderRadius: 3,
  },
  scoreBarFillLow: {
    height: 6,
    backgroundColor: '#DC2626',
    borderRadius: 3,
  },
  scoreBarFillHighlight: {
    height: 6,
    backgroundColor: blue,
    borderRadius: 3,
  },
  scoreValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: blue,
    width: 32,
    textAlign: 'right',
  },
  scoreValueLow: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#DC2626',
    width: 32,
    textAlign: 'right',
  },

  // Evidence
  evidenceItem: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
  },
  evidenceNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: blue,
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingTop: 4,
    marginRight: 10,
    flexShrink: 0,
  },
  evidenceText: {
    flex: 1,
    fontSize: 10,
    color: '#374141',
    lineHeight: 1.5,
  },

  // Revenue
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  revenueBox: {
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 6,
    marginBottom: 10,
  },
  revenueLabel: {
    fontSize: 8,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  revenueAmount: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#059669',
    marginBottom: 2,
  },
  costBox: {
    backgroundColor: '#FEF2F2',
    padding: 14,
    borderRadius: 6,
    marginBottom: 10,
    borderLeft: 3,
    borderLeftColor: '#DC2626',
  },
  costAmount: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#DC2626',
  },

  footer: {
    position: 'absolute',
    bottom: 28,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
  },

  // Cover page
  coverPage: {
    backgroundColor: '#1A1A1A',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  coverTop: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 52,
    justifyContent: 'flex-end',
  },
  coverLogo: {
    width: 200,
    height: 87,
    marginBottom: 52,
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    lineHeight: 1.2,
    marginBottom: 6,
  },
  coverSubtitle: {
    fontSize: 11,
    color: '#888888',
    letterSpacing: 1,
    marginBottom: 48,
  },
  coverConstraintLabel: {
    fontSize: 8,
    color: '#666666',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  coverConstraintValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: blue,
    marginBottom: 28,
  },
  coverBottom: {
    paddingHorizontal: 52,
    paddingVertical: 28,
    borderTop: 1,
    borderTopColor: '#333333',
  },
  coverMeta: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 3,
  },
  coverMetaBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#999999',
    marginBottom: 3,
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
  };
}

function formatDate(str: string) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const AuditResultsPDF = ({ data }: AuditResultsPDFProps) => {
  const constraint = data.final_constraint || 'Unknown';
  const evidencePoints = Array.isArray(data.evidence_points) ? data.evidence_points
    : typeof data.evidence_points === 'string'
      ? (() => { try { const p = JSON.parse(data.evidence_points as string); return Array.isArray(p) ? p : []; } catch { return []; } })()
      : [];

  const formattedDate = formatDate(data.created_at)

  return (
    <Document title={`Constraint Audit — ${data.business_name}`} author="Startup Bodyshop">
      {/* ── Cover Page ── */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverTop}>
          <Image style={styles.coverLogo} src={LOGO_BASE64} />
          <Text style={styles.coverTitle}>Constraint Audit{"\n"}Results</Text>
          <Text style={styles.coverSubtitle}>Business Analysis Report</Text>
          <Text style={styles.coverConstraintLabel}>Primary Constraint Identified</Text>
          <Text style={styles.coverConstraintValue}>{constraint}</Text>
        </View>
        <View style={styles.coverBottom}>
          {data.business_name ? <Text style={styles.coverMetaBold}>{data.business_name}</Text> : null}
          {data.owner_name ? <Text style={styles.coverMeta}>{data.owner_name}</Text> : null}
          {formattedDate ? <Text style={[styles.coverMeta, { marginTop: 12 }]}>{formattedDate}</Text> : null}
          <Text style={[styles.coverMeta, { marginTop: 8 }]}>Confidential · startupbodyshop.com</Text>
        </View>
      </Page>

      {/* ── Page 2: Constraint + Scores ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderLeft}>
            <Text style={styles.pageHeaderTitle}>Constraint-Busting Business Audit</Text>
            <Text style={styles.pageHeaderSub}>{data.business_name} · {data.owner_name}</Text>
          </View>
          <Image style={styles.pageHeaderLogo} src={LOGO_BASE64} />
        </View>

        {/* Constraint box */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your #1 Constraint</Text>
          <View style={styles.constraintBox}>
            <Text style={styles.constraintLabel}>Primary Constraint</Text>
            <Text style={styles.constraintName}>{constraint}</Text>
            {data.primary_score > 0 && (
              <Text style={styles.constraintScore}>Constraint Score: {data.primary_score}/10</Text>
            )}
            {data.reasoning ? <Text style={styles.text}>{data.reasoning}</Text> : null}
          </View>
        </View>

        {/* Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your 5 Lever Scores</Text>
          {data.scores && Object.entries(data.scores).map(([lever, score]) => {
            const isConstraint = constraint && lever.includes(constraint.split(' ')[0])
            const isLow = score < 5
            const pct = `${Math.min(100, Math.round((score / 10) * 100))}%`
            return (
              <View key={lever} style={styles.scoreRow}>
                <Text style={[styles.scoreLabel, isConstraint ? { fontFamily: 'Helvetica-Bold' } : {}]}>{lever}</Text>
                <View style={styles.scoreBarBg}>
                  <View style={[isLow ? styles.scoreBarFillLow : styles.scoreBarFill, { width: pct }]} />
                </View>
                <Text style={isLow ? styles.scoreValueLow : styles.scoreValue}>{score}/10</Text>
              </View>
            )
          })}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Startup Bodyshop · startupbodyshop.com · +232 30 600 600</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ── Page 3: Evidence + Revenue ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderLeft}>
            <Text style={styles.pageHeaderTitle}>Evidence &amp; Revenue Impact</Text>
            <Text style={styles.pageHeaderSub}>{data.business_name}</Text>
          </View>
          <Image style={styles.pageHeaderLogo} src={LOGO_BASE64} />
        </View>

        {evidencePoints.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why This Is Your Bottleneck</Text>
            {evidencePoints.map((point: string, i: number) => (
              <View key={i} style={styles.evidenceItem}>
                <Text style={styles.evidenceNumber}>{i + 1}</Text>
                <Text style={styles.evidenceText}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What This Costs You</Text>
          <View style={styles.row}>
            <View style={[styles.revenueBox, styles.col]}>
              <Text style={styles.revenueLabel}>Current Monthly</Text>
              <Text style={styles.revenueAmount}>{formatSLE(data.revenue_impact?.currentMonthly || 0)}</Text>
              <Text style={styles.text}>{usdHint(data.revenue_impact?.currentMonthly || 0)}</Text>
            </View>
            <View style={[styles.revenueBox, styles.col]}>
              <Text style={styles.revenueLabel}>Potential Monthly</Text>
              <Text style={styles.revenueAmount}>{formatSLE(data.revenue_impact?.potentialMonthly || 0)}</Text>
            </View>
          </View>
          <View style={styles.costBox}>
            <Text style={styles.revenueLabel}>Yearly Opportunity Cost</Text>
            <Text style={styles.costAmount}>{formatSLE(data.revenue_impact?.yearlyOpportunityCost || 0)}</Text>
            <Text style={[styles.text, { marginTop: 4 }]}>
              {usdHint(data.revenue_impact?.yearlyOpportunityCost || 0)} per year
            </Text>
          </View>
          {data.revenue_impact?.explanation ? (
            <Text style={styles.text}>{data.revenue_impact.explanation}</Text>
          ) : null}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Startup Bodyshop · startupbodyshop.com · +232 30 600 600</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ── Page 4: Next Steps ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderLeft}>
            <Text style={styles.pageHeaderTitle}>Your Next Step</Text>
            <Text style={styles.pageHeaderSub}>{data.business_name}</Text>
          </View>
          <Image style={styles.pageHeaderLogo} src={LOGO_BASE64} />
        </View>

        <View style={styles.constraintBox}>
          <Text style={styles.constraintLabel}>Primary Constraint</Text>
          <Text style={styles.constraintName}>{constraint}</Text>
        </View>

        <Text style={[styles.text, { marginBottom: 14 }]}>
          Breaking through a constraint requires focused action on the right lever — not general effort across everything. The next step is a conversation with a Startup Bodyshop coach to turn this diagnosis into a concrete 90-day plan.
        </Text>
        <Text style={[styles.text, { marginBottom: 4 }]}>WhatsApp: +232 30 600 600</Text>
        <Text style={styles.text}>Web: startupbodyshop.com</Text>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Tenacity Ventures Limited {new Date().getFullYear()} · Confidential</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
