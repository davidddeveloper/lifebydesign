"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Radar } from "react-chartjs-2"
import { Download, RefreshCw, Calendar, TrendingUp, AlertCircle, ArrowRight } from "lucide-react"
import { generatePDFBlob } from "@/lib/generate-pdf"
import { formatSLE, usdHint, type CurrencyCode } from "@/lib/currency"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js"
import { Footer } from "@/components/Footer"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface AuditData {
  business_name: string
  owner_name: string
  email: string
  phone: string
  industry: string
  monthly_revenue: number
  scores: {
    "WHO (Market)": number
    "WHAT (Offer)": number
    "HOW YOU SELL (Conversion)": number
    "HOW THEY FIND YOU (Traffic)": number
    "HOW YOU DELIVER (Operations)": number
  }
  final_constraint: string
  primary_score: number
  confidence: number
  evidence_points: string[]
  reasoning: string
  quick_win: {
    action: string
    impact: string
    time: string
  }
  revenue_impact: {
    currentMonthly: number
    potentialMonthly: number
    monthlyOpportunityCost: number
    yearlyOpportunityCost: number
    explanation: string
  }
  dashboard_id: string
  created_at: string
}

function CurrencyToggle({
  value,
  onChange,
}: {
  value: CurrencyCode
  onChange: (c: CurrencyCode) => void
}) {
  const options: { code: CurrencyCode; label: string }[] = [
    { code: "SLE", label: "SLE" },
    { code: "SLL", label: "Old Le" },
    { code: "USD", label: "USD" },
  ]
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
      {options.map((o) => (
        <button
          key={o.code}
          onClick={() => onChange(o.code)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            value === o.code ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const dashboardId = params.id as string

  const [data, setData] = useState<AuditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currency, setCurrency] = useState<CurrencyCode>("SLE")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/dashboard/${dashboardId}`)
        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || "Failed to load dashboard")
        }

        setData(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    if (dashboardId) {
      fetchData()
    }
  }, [dashboardId])

  const handleDownloadPDF = async () => {
    if (!data) return
    setIsGeneratingPDF(true)
    try {
      const blob = await generatePDFBlob(data)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${(data.business_name || "Audit").replace(/\s+/g, "-")}-Constraint-Audit.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#177fc9] mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't find an audit with this ID. It may have expired or the link is incorrect."}
          </p>
          <Link
            href="/constraint-audit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#177fc9] text-white font-semibold rounded-lg hover:bg-[#1269a8] transition-colors"
          >
            Take a New Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const radarData = {
    labels: Object.keys(data.scores).map((l) =>
      l.replace(" (Market)", "").replace(" (Offer)", "").replace(" (Conversion)", "").replace(" (Traffic)", "").replace(" (Operations)", "")
    ),
    datasets: [
      {
        label: "Your Scores",
        data: Object.values(data.scores),
        backgroundColor: "rgba(23, 127, 201, 0.15)",
        borderColor: "rgba(23, 127, 201, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(23, 127, 201, 1)",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: "rgba(0,0,0,0.06)" },
        grid: { color: "rgba(0,0,0,0.06)" },
        pointLabels: { font: { size: 11, weight: "bold" as const }, color: "#374151" },
        ticks: { backdropColor: "transparent", color: "#9ca3af", font: { size: 10 }, stepSize: 2 },
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: { display: false },
    },
  }

  const auditDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : ""

  const daysSinceAudit = data.created_at
    ? Math.floor((Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600"
    if (score >= 5) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-0.5 inline-block">
                &larr; Home
              </Link>
              <h1 className="text-xl font-bold text-gray-900">{data.business_name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Audit from {auditDate}
                {daysSinceAudit > 0 && <span className="text-gray-400">({daysSinceAudit} days ago)</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyToggle value={currency} onChange={setCurrency} />
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#177fc9] text-white text-sm font-medium rounded-lg hover:bg-[#1269a8] transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Re-audit CTA */}
        {daysSinceAudit >= 90 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-semibold text-gray-900">Time for a check-up!</p>
                <p className="text-sm text-gray-600">It's been {daysSinceAudit} days since your last audit. See how you've progressed.</p>
              </div>
            </div>
            <Link
              href="/constraint-audit"
              className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              Re-take Audit
            </Link>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Constraint + Scores */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Constraint Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Your #1 Constraint</p>
              <h2 className="text-3xl font-bold text-[#177fc9] mb-2">{data.final_constraint}</h2>
              <p className="text-sm text-gray-500 mb-4">Constraint Score: {data.primary_score}/10</p>
              <p className="text-sm text-gray-600 leading-relaxed">{data.reasoning}</p>
            </motion.div>

            {/* Scorecard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Scorecard</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square max-w-[260px] mx-auto">
                  <Radar data={radarData} options={radarOptions} />
                </div>
                <div className="space-y-2">
                  {Object.entries(data.scores).map(([lever, score]) => {
                    const isConstraint = lever === data.final_constraint
                    return (
                      <div
                        key={lever}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${
                          isConstraint ? "bg-blue-50 border border-[#177fc9]/20" : "bg-gray-50"
                        }`}
                      >
                        <span className={`text-sm ${isConstraint ? "font-semibold text-[#177fc9]" : "text-gray-700"}`}>
                          {lever
                            .replace("WHO (Market)", "WHO")
                            .replace("WHAT (Offer)", "WHAT")
                            .replace("HOW YOU SELL (Conversion)", "SELL")
                            .replace("HOW THEY FIND YOU (Traffic)", "TRAFFIC")
                            .replace("HOW YOU DELIVER (Operations)", "OPS")}
                        </span>
                        <span className={`text-lg font-bold ${isConstraint ? "text-[#177fc9]" : getScoreColor(score)}`}>
                          {score}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Evidence Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why This Is Your Bottleneck</h3>
              <div className="space-y-3">
                {data.evidence_points?.map((point, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#177fc9] text-white text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Revenue + Quick Win + Actions */}
          <div className="space-y-6">
            {/* Revenue Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Impact</h3>

              <div className="space-y-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Current Monthly</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatSLE(data.revenue_impact?.currentMonthly || 0, currency)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Potential Monthly</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatSLE(data.revenue_impact?.potentialMonthly || 0, currency)}
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs text-red-600 font-medium uppercase tracking-wider mb-1">Yearly Opportunity Cost</p>
                <p className="text-xl font-bold text-red-600">
                  {formatSLE(data.revenue_impact?.yearlyOpportunityCost || 0, currency)}
                </p>
                {currency !== "USD" && (
                  <p className="text-xs text-red-400 mt-1">
                    {usdHint(data.revenue_impact?.yearlyOpportunityCost || 0)}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Quick Win */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Win</h3>
              <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Action</p>
                  <p className="text-sm text-gray-800">{data.quick_win?.action || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Expected Impact</p>
                  <p className="text-sm text-gray-800">{data.quick_win?.impact || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Time Required</p>
                  <p className="text-sm text-gray-800">{data.quick_win?.time || "N/A"}</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="space-y-3"
            >
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#177fc9] text-white font-semibold rounded-lg hover:bg-[#1269a8] transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? "Generating..." : "Download Full Report"}
              </button>

              <Link
                href="/constraint-audit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#177fc9] font-semibold rounded-lg border-2 border-[#177fc9] hover:bg-blue-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Take New Audit
              </Link>
            </motion.div>

            {/* Help CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200"
            >
              <h4 className="font-bold text-gray-900 mb-2">Need Help Breaking Through?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Get expert guidance to eliminate your constraint and unlock growth.
              </p>
              <a
                href="https://wa.me/23230600600"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800"
              >
                Chat with us on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
