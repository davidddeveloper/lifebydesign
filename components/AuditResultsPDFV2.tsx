// components/AuditResultsPDFV2.tsx
// 3-page audit PDF: dark cover · scores + revenue · diagnostic narrative

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import { LOGO_BASE64 } from "@/lib/logo-base64"

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
// Helpers
// ─────────────────────────────────────────────

const BAND_COLORS: Record<string, string> = {
  CRITICAL: "#DC2626",
  WEAK: "#D97706",
  FUNCTIONAL: "#2563EB",
  STRONG: "#16A34A",
}

function getBandColor(band: string) {
  return BAND_COLORS[band] ?? "#374151"
}

function formatDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

const LEVER_LABELS: Record<string, string> = {
  who: "WHO — Market",
  what: "WHAT — Offer",
  traffic: "FIND YOU — Traffic",
  sell: "SELL — Conversion",
  operations: "DELIVER — Operations",
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({

  // ── Shared white page
  page: {
    backgroundColor: "#FFFFFF",
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
  },

  // Header bar (pages 2 & 3)
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 2,
    borderBottomColor: "#1A1A1A",
    paddingBottom: 12,
    marginBottom: 24,
  },
  headerLeft: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#888888",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  headerRight: {
    fontSize: 9,
    color: "#888888",
    letterSpacing: 0.3,
  },

  // Version tag
  versionTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  versionTagText: {
    fontSize: 8,
    color: "#6B7280",
    letterSpacing: 0.5,
  },

  // Business block
  businessName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A1A",
    marginBottom: 3,
  },
  businessMeta: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 2,
  },

  // Section label
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#9CA3AF",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 20,
  },

  // Constraint box
  constraintBox: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    padding: 14,
    marginBottom: 20,
  },
  constraintInnerLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#9CA3AF",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  constraintName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
    marginBottom: 4,
  },
  constraintSecondary: {
    fontSize: 10,
    color: "#6B7280",
  },

  // Score rows
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

  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginVertical: 20,
  },

  // Body text
  bodyText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.6,
  },

  // Narrative
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

  // ── Cover page
  coverPage: {
    backgroundColor: "#1A1A1A",
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontFamily: "Helvetica",
  },
  coverLogo: {
    position: "absolute",
    top: 44,
    left: 52,
    width: 120,
    height: 52,
  },
  coverTop: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 52,
    paddingBottom: 36,
    justifyContent: "flex-end",
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
  coverVersion: {
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
  },
  coverDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  coverBottom: {
    paddingHorizontal: 52,
    paddingTop: 32,
    paddingBottom: 44,
  },
  coverMetaBold: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#999999",
    marginBottom: 3,
  },
  coverMeta: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 3,
  },
  coverConfidential: {
    fontSize: 8,
    color: "#555555",
    letterSpacing: 0.5,
    marginTop: 14,
  },
})

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function AuditResultsPDFV2({ data }: { data: AuditPDFData }) {
  const {
    businessName, ownerName, industry, monthlyRevenue,
    createdAt, primaryConstraint, secondaryConstraint,
    scores, bands, narrative, revenueOpportunityText,
  } = data

  const date = formatDate(createdAt)

  return (
    <Document
      title={`Constraint Audit — ${businessName}`}
      author="Startup Bodyshop"
      subject="Constraint-Busting Business Audit"
    >

      {/* ══════════════════════════════════════
          Page 1 — Cover
      ══════════════════════════════════════ */}
      <Page size="A4" style={s.coverPage}>

        {/* Logo — absolutely positioned top-left */}
        <Image style={s.coverLogo} src={LOGO_BASE64} />

        {/* Dark upper area; flex-end pushes text to bottom */}
        <View style={s.coverTop}>
          <Text style={s.coverBrand}>Startup Bodyshop · Sierra Leone</Text>
          <Text style={s.coverTitle}>The Constraint-Busting{"\n"}Business Audit</Text>
          {/*<Text style={s.coverVersion}>Version 3.0</Text>*/}
          <Text style={s.coverConstraintLabel}>Primary Constraint Identified</Text>
          <Text style={s.coverConstraintValue}>{primaryConstraint || "—"}</Text>
        </View>

        {/* Dividing rule */}
        <View style={s.coverDivider} />

        {/* Meta strip */}
        <View style={s.coverBottom}>
          {businessName ? <Text style={s.coverMetaBold}>{businessName}</Text> : null}
          {ownerName ? <Text style={s.coverMeta}>{ownerName}</Text> : null}
          {industry ? <Text style={s.coverMeta}>{industry}</Text> : null}
          <Text style={[s.coverMeta, { marginTop: 14 }]}>{date}</Text>
          <Text style={s.coverConfidential}>Confidential · For recipient only</Text>
        </View>

      </Page>

      {/* ══════════════════════════════════════
          Page 2 — Scores + Revenue Opportunity
      ══════════════════════════════════════ */}
      <Page size="A4" style={s.page}>

        <View style={s.headerBar}>
          <Text style={s.headerLeft}>Constraint-Busting Business Audit</Text>
          <Text style={s.headerRight}>Startup Bodyshop · Sierra Leone</Text>
        </View>

        <View style={s.versionTag}>
          <Text style={s.versionTagText}>{date}</Text>
        </View>

        <View style={{ marginBottom: 4 }}>
          <Text style={s.businessName}>{businessName || "Business Audit"}</Text>
          {ownerName ? <Text style={s.businessMeta}>{ownerName}</Text> : null}
          {industry ? <Text style={s.businessMeta}>{industry}</Text> : null}
          {monthlyRevenue ? (
            <Text style={s.businessMeta}>
              Monthly Revenue: NLe {Number(monthlyRevenue).toLocaleString()}
            </Text>
          ) : null}
        </View>

        <Text style={s.sectionLabel}>Primary Constraint Identified</Text>
        <View style={s.constraintBox}>
          <Text style={s.constraintInnerLabel}>Your #1 Business Constraint</Text>
          <Text style={s.constraintName}>{primaryConstraint}</Text>
          {secondaryConstraint ? (
            <Text style={s.constraintSecondary}>Secondary: {secondaryConstraint}</Text>
          ) : null}
        </View>

        <Text style={[s.sectionLabel, { marginTop: 0 }]}>Your 5 Lever Scores</Text>
        {(["who", "what", "traffic", "sell", "operations"] as const).map(key => {
          const score = scores[key]
          const band = bands[key]
          const color = getBandColor(band)
          return (
            <View key={key} style={s.scoreRow}>
              <Text style={s.scoreLabel}>{LEVER_LABELS[key]}</Text>
              <View style={s.scoreBarBg}>
                <View style={[s.scoreBarFill, { width: `${(score / 10) * 100}%`, backgroundColor: color }]} />
              </View>
              <Text style={[s.scoreValue, { color }]}>{score}/10</Text>
              <Text style={[s.bandLabel, { color }]}>{band}</Text>
            </View>
          )
        })}

        <View style={s.divider} />

        <Text style={[s.sectionLabel, { marginTop: 0 }]}>Revenue Opportunity</Text>
        <Text style={s.bodyText}>{revenueOpportunityText}</Text>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Startup Bodyshop · startupbodyshop.com</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

      </Page>

      {/* ══════════════════════════════════════
          Page 3 — Diagnostic Narrative
      ══════════════════════════════════════ */}
      <Page size="A4" style={s.page}>

        <View style={s.headerBar}>
          <Text style={s.headerLeft}>Diagnostic Report — {businessName}</Text>
          <Text style={s.headerRight}>Startup Bodyshop</Text>
        </View>

        {([
          { heading: "What Is Working", body: narrative.whatIsWorking },
          { heading: "Your Primary Constraint", body: narrative.primaryConstraintNarrative },
          { heading: "What This Is Costing You", body: narrative.whatThisCosts },
          { heading: "The Root Cause", body: narrative.rootCause },
          { heading: "Your Recommended Next Step", body: narrative.nextStep },
        ] as const).map(({ heading, body }) => (
          <View key={heading} style={s.narrativeSection}>
            <Text style={s.narrativeHeading}>{heading}</Text>
            <Text style={s.narrativeText}>{body || "—"}</Text>
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Confidential · For recipient only · Startup Bodyshop · {date}
          </Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

      </Page>

    </Document>
  )
}
