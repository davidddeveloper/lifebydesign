// components/AuditResultsPDFV2.tsx
// PDF report generated server-side via @react-pdf/renderer
// Used for email attachment and direct download

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AuditPDFData {
  businessName: string
  ownerName: string
  industry: string
  monthlyRevenue: string
  createdAt?: string
  primaryConstraint: string
  secondaryConstraint: string | null
  ruleApplied: number
  scores: {
    who: number
    what: number
    traffic: number
    sell: number
    operations: number
  }
  bands: {
    who: string
    what: string
    traffic: string
    sell: string
    operations: string
  }
  narrative: {
    whatIsWorking: string
    primaryConstraintNarrative: string
    whatThisCosts: string
    rootCause: string
    nextStep: string
  }
  recommendedCta: string
  revenueOpportunityText: string
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const BAND_COLORS: Record<string, string> = {
  CRITICAL: "#DC2626",
  WEAK: "#D97706",
  FUNCTIONAL: "#2563EB",
  STRONG: "#16A34A",
}

const s = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
  },

  // Header
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: "#1A1A1A",
    paddingBottom: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#888888",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  headerBrand: {
    fontSize: 9,
    color: "#888888",
    letterSpacing: 0.5,
  },

  // Business block
  businessBlock: {
    marginBottom: 28,
  },
  businessName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  businessMeta: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },

  // Constraint box
  constraintBox: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    padding: 14,
    marginBottom: 24,
  },
  constraintLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#9CA3AF",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  constraintName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
  },

  // Section header
  sectionHeader: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#9CA3AF",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 4,
  },

  // Score bars
  scoresContainer: {
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  scoreLabel: {
    fontSize: 9,
    color: "#374151",
    width: 120,
  },
  scoreBarBg: {
    flex: 1,
    height: 7,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginHorizontal: 8,
  },
  scoreBarFill: {
    height: 7,
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    width: 36,
    textAlign: "right",
  },
  bandLabel: {
    fontSize: 7,
    width: 52,
    textAlign: "right",
    letterSpacing: 0.3,
  },

  // Narrative sections
  narrativeSection: {
    marginBottom: 18,
  },
  narrativeHeading: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A1A",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  narrativeText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },

  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 20,
    marginTop: 4,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#9CA3AF",
  },

  // Version tag
  versionTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 28,
    alignSelf: "flex-start",
  },
  versionTagText: {
    fontSize: 8,
    color: "#6B7280",
    letterSpacing: 0.5,
  },

  // Cover page
  coverPage: {
    backgroundColor: "#1A1A1A",
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontFamily: "Helvetica",
  },
  coverTop: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 52,
    justifyContent: "flex-end",
  },
  coverBottom: {
    paddingHorizontal: 52,
    paddingBottom: 52,
    paddingTop: 48,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  coverBrand: {
    fontSize: 8,
    color: "#888888",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 60,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    lineHeight: 1.2,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 11,
    color: "#888888",
    letterSpacing: 1,
    marginBottom: 52,
  },
  coverConstraintLabel: {
    fontSize: 8,
    color: "#666666",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  coverConstraintValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
    marginBottom: 32,
  },
  coverMeta: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 4,
  },
  coverMetaBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#999999",
  },
})

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getBandColor(band: string): string {
  return BAND_COLORS[band] || "#374151"
}

function formatDate(iso?: string): string {
  if (!iso) return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

const LEVER_LABELS: Record<string, string> = {
  who: "WHO — Market",
  what: "WHAT — Offer",
  traffic: "FIND YOU — Traffic",
  sell: "SELL — Conversion",
  operations: "DELIVER — Operations",
}

// ─────────────────────────────────────────────
// PDF Document
// ─────────────────────────────────────────────

export function AuditResultsPDFV2({ data }: { data: AuditPDFData }) {
  const {
    businessName, ownerName, industry, monthlyRevenue,
    createdAt, primaryConstraint, secondaryConstraint,
    scores, bands, narrative, revenueOpportunityText,
  } = data

  const constraintColor = BAND_COLORS["CRITICAL"]

  return (
    <Document
      title={`Constraint Audit — ${businessName}`}
      author="Startup Bodyshop"
      subject="Constraint-Busting Business Audit"
    >
      {/* ─── Cover Page ─── */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverTop}>
          <Text style={s.coverBrand}>Startup Bodyshop · Sierra Leone</Text>
          <Text style={s.coverTitle}>The Constraint-Busting{"\n"}Business Audit</Text>
          <Text style={s.coverSubtitle}>Version 3.0</Text>

          <Text style={s.coverConstraintLabel}>Primary Constraint Identified</Text>
          <Text style={s.coverConstraintValue}>{primaryConstraint || "—"}</Text>
        </View>

        <View style={s.coverBottom}>
          {businessName ? <Text style={s.coverMetaBold}>{businessName}</Text> : null}
          {ownerName ? <Text style={s.coverMeta}>{ownerName}</Text> : null}
          {industry ? <Text style={s.coverMeta}>{industry}</Text> : null}
          <Text style={[s.coverMeta, { marginTop: 16 }]}>{formatDate(createdAt)}</Text>
        </View>
      </Page>

      {/* ─── Page 2: Scores + Constraint ─── */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerBar}>
          <Text style={s.headerTitle}>Constraint-Busting Business Audit</Text>
          <Text style={s.headerBrand}>Startup Bodyshop · Sierra Leone</Text>
        </View>

        {/* Version */}
        <View style={s.versionTag}>
          <Text style={s.versionTagText}>Version 3.0 · {formatDate(createdAt)}</Text>
        </View>

        {/* Business */}
        <View style={s.businessBlock}>
          <Text style={s.businessName}>{businessName || "Business Audit Report"}</Text>
          {ownerName ? <Text style={s.businessMeta}>{ownerName}</Text> : null}
          {industry ? <Text style={s.businessMeta}>{industry}</Text> : null}
          {monthlyRevenue ? (
            <Text style={s.businessMeta}>Monthly Revenue: NLe {Number(monthlyRevenue).toLocaleString()}</Text>
          ) : null}
        </View>

        {/* Primary Constraint */}
        <Text style={s.sectionHeader}>Primary Constraint Identified</Text>
        <View style={s.constraintBox}>
          <Text style={s.constraintLabel}>Your #1 Business Constraint</Text>
          <Text style={[s.constraintName, { color: constraintColor }]}>{primaryConstraint}</Text>
          {secondaryConstraint && (
            <Text style={[s.businessMeta, { marginTop: 6 }]}>Secondary: {secondaryConstraint}</Text>
          )}
        </View>

        {/* Scores */}
        <Text style={s.sectionHeader}>Your 5 Lever Scores</Text>
        <View style={s.scoresContainer}>
          {(["who", "what", "traffic", "sell", "operations"] as const).map(key => {
            const score = scores[key]
            const band = bands[key]
            const color = getBandColor(band)
            const pct = (score / 10) * 100
            return (
              <View key={key} style={s.scoreRow}>
                <Text style={s.scoreLabel}>{LEVER_LABELS[key]}</Text>
                <View style={s.scoreBarBg}>
                  <View style={[s.scoreBarFill, { width: `${pct}%`, backgroundColor: color }]} />
                </View>
                <Text style={[s.scoreValue, { color }]}>{score}/10</Text>
                <Text style={[s.bandLabel, { color }]}>{band}</Text>
              </View>
            )
          })}
        </View>

        <View style={s.divider} />

        {/* Revenue Opportunity */}
        <Text style={s.sectionHeader}>Revenue Opportunity</Text>
        <View style={s.narrativeSection}>
          <Text style={s.narrativeText}>{revenueOpportunityText}</Text>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Startup Bodyshop · startupbodyshop.com</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ─── Page 3: Diagnostic Narrative ─── */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerBar}>
          <Text style={s.headerTitle}>Diagnostic Report — {businessName}</Text>
          <Text style={s.headerBrand}>Startup Bodyshop</Text>
        </View>

        {[
          { heading: "What Is Working", body: narrative.whatIsWorking },
          { heading: "Your Primary Constraint", body: narrative.primaryConstraintNarrative },
          { heading: "What This Is Costing You", body: narrative.whatThisCosts },
          { heading: "The Root Cause", body: narrative.rootCause },
          { heading: "Your Recommended Next Step", body: narrative.nextStep },
        ].map(({ heading, body }) => (
          <View key={heading} style={s.narrativeSection}>
            <Text style={s.narrativeHeading}>{heading}</Text>
            <Text style={s.narrativeText}>{body || "—"}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Confidential · For recipient only · Startup Bodyshop · {formatDate(createdAt)}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
