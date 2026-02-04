// components/ResultsPage.tsx
// @ts-nocheck
"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Radar } from "react-chartjs-2"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
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
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js"


ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface ResultsPageProps {
  data: {
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
}

// ─── Currency Toggle ─────────────────────────────────────────
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

// ─── PDF Preview Pages (Visual Replicas) ─────────────────────
function PDFCoverPage({ data }: { data: ResultsPageProps["data"] }) {
  const formattedDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : ""

  return (
    <div className="w-full h-full bg-white flex flex-col font-sans">
      <div className="h-2 bg-[#177fc9]" />
      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <img src="/lifebydesignlogo.png" alt="Logo" className="w-40 mb-8 object-contain" />
        <div className="w-10 h-0.5 bg-[#177fc9] mb-5" />
        <h2 className="text-2xl font-bold text-gray-900 text-center">Constraint Audit</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Business Analysis Report</p>
        <p className="text-lg font-bold text-[#177fc9] text-center">{data.business_name}</p>
        <p className="text-sm text-gray-500 text-center">{data.owner_name}</p>
        {formattedDate && <p className="text-xs text-gray-400 mt-2">{formattedDate}</p>}
      </div>
      <div className="px-10 py-4 border-t border-gray-200 flex justify-between">
        <span className="text-[10px] text-gray-400">startupbodyshop.com</span>
        <span className="text-[10px] text-gray-400">Confidential</span>
      </div>
    </div>
  )
}

function PDFScoresPage({ data }: { data: ResultsPageProps["data"] }) {
  const formattedDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : ""
  const constraint = data.final_constraint || "Unknown"

  return (
    <div className="w-full h-full bg-white flex flex-col p-6 font-sans overflow-hidden">
      <div className="mb-4 pb-3 border-b-2 border-[#177fc9]">
        <h2 className="text-xl font-bold text-[#177fc9]">Constraint Audit Results</h2>
        <p className="text-xs text-gray-500">
          {data.business_name} - {data.owner_name}
        </p>
        {formattedDate && <p className="text-xs text-gray-500">{formattedDate}</p>}
      </div>

      <div className="bg-blue-50 border-l-4 border-[#177fc9] rounded-lg p-4 mb-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Your #1 Constraint</p>
        <p className="text-lg font-bold text-[#177fc9] mb-1">{constraint}</p>
        <p className="text-xs text-gray-600">
          Score: {data.primary_score}/10 | AI Confidence: {data.confidence}/10
        </p>
        <p className="text-[10px] text-gray-600 mt-2 leading-relaxed line-clamp-3">{data.reasoning}</p>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-2 border-l-2 border-[#177fc9] pl-2">Your Scorecard</h3>
        <div className="space-y-1.5">
          {data.scores &&
            Object.entries(data.scores).map(([lever, score]) => (
              <div
                key={lever}
                className={`flex items-center justify-between px-3 py-1.5 rounded text-xs ${
                  constraint && lever.includes(constraint.split(" ")[0])
                    ? "bg-blue-50 border-l-2 border-[#177fc9]"
                    : "bg-gray-50"
                }`}
              >
                <span className="font-medium text-gray-700 truncate">{lever}</span>
                <span className="font-bold text-[#177fc9] ml-2">{score}/10</span>
              </div>
            ))}
        </div>
      </div>

      <div className="text-center text-[9px] text-gray-400 pt-2 border-t border-gray-100 mt-2">
        Startup Bodyshop | startupbodyshop.com | +232 30 600 600
      </div>
    </div>
  )
}

function PDFEvidencePage({ data }: { data: ResultsPageProps["data"] }) {
  const evidencePoints = Array.isArray(data.evidence_points)
    ? data.evidence_points
    : typeof data.evidence_points === "string"
      ? (() => {
          try {
            const p = JSON.parse(data.evidence_points as string)
            return Array.isArray(p) ? p : []
          } catch {
            return []
          }
        })()
      : []

  return (
    <div className="w-full h-full bg-white flex flex-col p-6 font-sans overflow-hidden">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3 border-l-2 border-[#177fc9] pl-2">
          Why This Is Your Bottleneck
        </h3>
        <div className="space-y-2">
          {evidencePoints.slice(0, 4).map((point: string, i: number) => (
            <div key={i} className="flex items-start gap-2 bg-blue-50 rounded p-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#177fc9] text-white text-[10px] flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <p className="text-[10px] text-gray-700 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-3 border-l-2 border-[#177fc9] pl-2">What This Costs You</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-green-50 rounded p-2">
            <p className="text-[9px] text-gray-500 uppercase">Current Monthly</p>
            <p className="text-sm font-bold text-green-600">
              {formatSLE(data.revenue_impact?.currentMonthly || 0)}
            </p>
            <p className="text-[9px] text-gray-400">{usdHint(data.revenue_impact?.currentMonthly || 0)}</p>
          </div>
          <div className="bg-green-50 rounded p-2">
            <p className="text-[9px] text-gray-500 uppercase">Potential Monthly</p>
            <p className="text-sm font-bold text-green-600">
              {formatSLE(data.revenue_impact?.potentialMonthly || 0)}
            </p>
          </div>
        </div>
        <div className="bg-red-50 border-l-2 border-red-500 rounded p-2">
          <p className="text-[9px] text-gray-500 uppercase">Yearly Opportunity Cost</p>
          <p className="text-sm font-bold text-red-600">
            {formatSLE(data.revenue_impact?.yearlyOpportunityCost || 0)}
          </p>
          <p className="text-[9px] text-gray-500">
            {usdHint(data.revenue_impact?.yearlyOpportunityCost || 0)}
          </p>
        </div>
      </div>

      <div className="text-center text-[9px] text-gray-400 pt-2 border-t border-gray-100 mt-2">
        Startup Bodyshop | startupbodyshop.com | +232 30 600 600
      </div>
    </div>
  )
}

function PDFQuickWinPage({ data }: { data: ResultsPageProps["data"] }) {
  return (
    <div className="w-full h-full bg-white flex flex-col p-6 font-sans overflow-hidden">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3 border-l-2 border-[#177fc9] pl-2">
          Quick Win - Start Today
        </h3>
        <div className="bg-amber-50 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-[9px] text-amber-700 uppercase font-semibold tracking-wider mb-1">Action</p>
            <p className="text-xs text-gray-800">{data.quick_win?.action || "N/A"}</p>
          </div>
          <div>
            <p className="text-[9px] text-amber-700 uppercase font-semibold tracking-wider mb-1">Expected Impact</p>
            <p className="text-xs text-gray-800">{data.quick_win?.impact || "N/A"}</p>
          </div>
          <div>
            <p className="text-[9px] text-amber-700 uppercase font-semibold tracking-wider mb-1">Time Required</p>
            <p className="text-xs text-gray-800">{data.quick_win?.time || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-auto">
        <h3 className="text-sm font-bold text-gray-900 mb-2 border-l-2 border-[#177fc9] pl-2">Next Steps</h3>
        <p className="text-xs text-gray-600 mb-2">
          Ready to break through your #1 constraint? Reach out to discuss your personalized roadmap.
        </p>
        <p className="text-xs text-gray-600">WhatsApp: +232 30 600 600</p>
        <p className="text-xs text-gray-600">Web: startupbodyshop.com</p>
      </div>

      <div className="text-center text-[9px] text-gray-400 pt-2 border-t border-gray-100 mt-4">
        Tenacity Ventures Limited {new Date().getFullYear()} | startupbodyshop.com
      </div>
    </div>
  )
}

// ─── Interactive PDF Preview ─────────────────────────────────
function PDFPreview({ data, onDownload, isGenerating }: {
  data: ResultsPageProps["data"]
  onDownload: () => void
  isGenerating: boolean
}) {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 4

  const pages = [
    <PDFCoverPage key="cover" data={data} />,
    <PDFScoresPage key="scores" data={data} />,
    <PDFEvidencePage key="evidence" data={data} />,
    <PDFQuickWinPage key="quickwin" data={data} />,
  ]

  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 0))

  // Swipe support
  const touchStartX = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  return (
    <div className="lg:h-full lg:flex lg:flex-col">
      {/* PDF Page */}
      <div
        className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 cursor-pointer flex-1 min-h-0"
        onClick={goNext}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="aspect-[1/1.414] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {pages[currentPage]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows overlay */}
        {currentPage > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
        )}
        {currentPage < totalPages - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        )}
      </div>

      {/* Page indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`transition-all rounded-full ${
              i === currentPage ? "w-6 h-2 bg-[#177fc9]" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Download button */}
      <motion.button
        onClick={onDownload}
        disabled={isGenerating}
        className="mt-4 w-full py-3 bg-[#177fc9] text-white font-semibold rounded-xl hover:bg-[#1269a8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Download className="w-4 h-4" />
        {isGenerating ? "Generating..." : "Download PDF"}
      </motion.button>
      <p className="text-center text-xs text-gray-400 mt-2">Click pages to flip through &bull; Swipe on mobile</p>
    </div>
  )
}

// ─── Personalized Solution CTA ───────────────────────────────
function PersonalizedSolutionCTA() {
  const [clicked, setClicked] = useState(false)

  const handleClick = useCallback(() => {
    setClicked(true)
    setTimeout(() => setClicked(false), 2000)
  }, [])

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Want a Personalized Solution?</h3>
      <p className="text-sm text-gray-600 mb-4">
        Get expert help to break through your constraint. Our team will reach out with a tailored plan.
      </p>
      <button
        onClick={handleClick}
        disabled={clicked}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
          clicked
            ? "bg-green-100 text-green-700"
            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
        }`}
      >
        {clicked ? "Request Sent!" : "Get a Personalized Solution"}
      </button>
    </div>
  )
}

// ─── Main Results Page ───────────────────────────────────────
export default function ResultsPage({ data }: ResultsPageProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [currency, setCurrency] = useState<CurrencyCode>("SLE")

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 600)
    const t2 = setTimeout(() => setShowConfetti(true), 1200)
    const t3 = setTimeout(() => setShowConfetti(false), 4000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

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
        pointLabels: { font: { size: 11, weight: "600" as const }, color: "#374151" },
        ticks: { backdropColor: "transparent", color: "#9ca3af", font: { size: 10 }, stepSize: 2 },
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 10,
        callbacks: { label: (ctx: any) => `Score: ${ctx.parsed.r}/10` },
      },
    },
  }

  const handleDownloadPDF = async () => {
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

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600"
    if (score >= 5) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 7) return "bg-green-50"
    if (score >= 5) return "bg-amber-50"
    return "bg-red-50"
  }

  const growthPct =
    data.revenue_impact?.currentMonthly > 0
      ? Math.round(
          ((data.revenue_impact.potentialMonthly - data.revenue_impact.currentMonthly) /
            data.revenue_impact.currentMonthly) *
            100
        )
      : 0

  return (
    <div className="h-screen flex flex-col bg-gray-50 lg:overflow-hidden overflow-auto">
      {/* Confetti Celebration */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(60)].map((_, i) => {
            const colors = ["#177fc9", "#42adff", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
            const size = 4 + Math.random() * 8
            const isRect = i % 3 === 0
            const startX = Math.random() * 100
            const drift = (Math.random() - 0.5) * 200
            const duration = 2.5 + Math.random() * 2
            const delay = Math.random() * 0.8

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: isRect ? size * 0.5 : size,
                  height: size,
                  backgroundColor: colors[i % colors.length],
                  borderRadius: isRect ? "1px" : "50%",
                  left: `${startX}%`,
                  top: "-15px",
                }}
                initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
                animate={{
                  y: typeof window !== "undefined" ? window.innerHeight + 60 : 900,
                  x: [0, drift * 0.3, drift, drift * 0.7],
                  rotate: [0, 180 + Math.random() * 540],
                  opacity: [1, 1, 1, 0],
                }}
                transition={{
                  duration,
                  delay,
                  ease: [0.12, 0.8, 0.3, 1],
                }}
              />
            )
          })}
        </div>
      )}

      {/* Header — fixed at top */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-0.5 inline-block">
                &larr; Home
              </a>
              <h1 className="text-xl font-bold text-gray-900">{data.business_name}</h1>
            </div>
            <CurrencyToggle value={currency} onChange={setCurrency} />
          </div>
        </div>
      </header>

      {/* Main Content: Split Layout — fills remaining height on desktop */}
      <div className="flex-1 lg:min-h-0">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left: PDF Preview — fixed on desktop, fills available height */}
          <div className="lg:col-span-5 py-8 lg:h-full lg:overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:h-full lg:flex lg:flex-col"
            >
              <PDFPreview data={data} onDownload={handleDownloadPDF} isGenerating={isGeneratingPDF} />
            </motion.div>
          </div>

          {/* Right: Analysis — scrolls independently on desktop */}
          <div className="lg:col-span-7 lg:h-full lg:overflow-y-auto lg:py-8 pb-8 space-y-6 scrollbar-thin">
            {/* Constraint Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Your #1 Constraint</p>
              <h2 className="text-3xl font-bold text-[#177fc9] mb-3">{data.final_constraint}</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Score</span>
                  <span className="text-xl font-bold text-gray-900">{data.primary_score}/10</span>
                </div>
                <div className="w-px h-6 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Confidence</span>
                  <span className="text-xl font-bold text-gray-900">{data.confidence}/10</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{data.reasoning}</p>
            </motion.div>

            {/* Scorecard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Full Scorecard</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <div className="aspect-square max-w-[280px] mx-auto">
                    <Radar data={radarData} options={radarOptions} />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-2">
                  {Object.entries(data.scores).map(([lever, score]) => {
                    const isConstraint = lever === data.final_constraint
                    return (
                      <div
                        key={lever}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
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

            {/* Evidence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why This Is Your Bottleneck</h3>
              <div className="space-y-3">
                {data.evidence_points.map((point, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#177fc9] text-white text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Revenue Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">What This Costs You</h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Current Monthly</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatSLE(data.revenue_impact.currentMonthly, currency)}
                  </p>
                  {currency !== "USD" && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {usdHint(data.revenue_impact.currentMonthly)}
                    </p>
                  )}
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Potential Monthly</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatSLE(data.revenue_impact.potentialMonthly, currency)}
                  </p>
                  {growthPct > 0 && <p className="text-xs text-green-600 mt-0.5">+{growthPct}% growth</p>}
                </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-red-600 font-medium uppercase tracking-wider">Yearly Opportunity Cost</p>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {formatSLE(data.revenue_impact.yearlyOpportunityCost, currency)}
                </p>
                {currency !== "USD" && (
                  <p className="text-xs text-red-400 mt-1">
                    {usdHint(data.revenue_impact.yearlyOpportunityCost)}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatSLE(data.revenue_impact.monthlyOpportunityCost, currency)} per month
                </p>
              </div>

              {data.revenue_impact.explanation && (
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
                  {data.revenue_impact.explanation}
                </p>
              )}
            </motion.div>

            {/* Quick Win */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Win - Start Today</h3>
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

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <PersonalizedSolutionCTA />
            </motion.div>
            {/* Footer inside scroll area */}
            <div className="pt-6 border-t border-gray-200 mt-2">
              <div className="text-center text-xs text-gray-400 pb-4">
                Startup Bodyshop &middot; startupbodyshop.com &middot; +232 30 600 600
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
