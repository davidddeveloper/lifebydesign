// components/ResultsPage.tsx
// @ts-nocheck
"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Radar } from "react-chartjs-2"
import { Download } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
)

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

export default function ResultsPage({ data }: ResultsPageProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealStep, setRevealStep] = useState(0)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dramatic reveal sequence
    const timer1 = setTimeout(() => setRevealStep(1), 500)
    const timer2 = setTimeout(() => setRevealStep(2), 1500)
    const timer3 = setTimeout(() => setRevealStep(3), 2500)
    const timer4 = setTimeout(() => {
      setRevealStep(4)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }, 3500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  // Prepare chart data
  console.log("scores data", data.scores)
  console.log("evidence points", data.evidence_points)
  const radarData = {
    labels: Object.keys(data.scores).map((label) => {
      // Shorten labels for better display
      return label
        .replace(" (Market)", "")
        .replace(" (Offer)", "")
        .replace(" (Conversion)", "")
        .replace(" (Traffic)", "")
        .replace(" (Operations)", "")
    }),
    datasets: [
      {
        label: "Your Scores",
        data: Object.values(data.scores),
        backgroundColor: "rgba(23, 127, 201, 0.2)",
        borderColor: "rgba(23, 127, 201, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(23, 127, 201, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(23, 127, 201, 1)",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 12,
            weight: "bold" as const,
          },
          color: "#1a1a1a",
        },
        ticks: {
          backdropColor: "transparent",
          color: "#666",
          font: {
            size: 11,
          },
          stepSize: 2,
        },
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: any) => `Score: ${context.parsed.r}/10`,
        },
      },
    },
  }

  const getConstraintColor = (lever: string) => {
    if (lever === data.final_constraint) {
      return "from-blue-500 to-blue-600"
    }
    const score = data.scores[lever as keyof typeof data.scores]
    if (score >= 7) return "from-green-500 to-emerald-600"
    if (score >= 5) return "from-yellow-500 to-amber-600"
    return "from-orange-500 to-red-600"
  }

  const getConstraintEmoji = (lever: string) => {
    if (lever.includes("WHO")) return "👥"
    if (lever.includes("WHAT")) return "💎"
    if (lever.includes("SELL")) return "🤝"
    if (lever.includes("FIND")) return "📢"
    if (lever.includes("DELIVER")) return "⚙️"
    return "🎯"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 8) return "Excellent! 🌟"
    if (score >= 6) return "Good 👍"
    if (score >= 4) return "Needs Work ⚠️"
    return "Critical 🚨"
  }

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return

    setIsGeneratingPDF(true)

    try {
      const canvas = await html2canvas(resultsRef.current, {
        useCORS: true,
        logging: false,
        background: "#ffffff",
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll("*")

          const convertToHex = (colorValue: string): string => {
            if (colorValue.includes("oklch") || colorValue.includes("lab") || colorValue.includes("lch")) {
              if (colorValue.includes("0.5") || colorValue.includes("50")) {
                return "#177fc9"
              }
              if (colorValue.includes("0.9") || colorValue.includes("90")) {
                return "#f0f9ff"
              }
              if (colorValue.includes("0.2") || colorValue.includes("20")) {
                return "#1f2937"
              }
              return "#6b7280"
            }
            return colorValue
          }

          allElements.forEach((el) => {
            const element = el as HTMLElement
            const computed = window.getComputedStyle(element)

            element.style.color = convertToHex(computed.color)
            element.style.backgroundColor = convertToHex(computed.backgroundColor)
            element.style.borderColor = convertToHex(computed.borderColor)
            element.style.borderTopColor = convertToHex(computed.borderTopColor)
            element.style.borderRightColor = convertToHex(computed.borderRightColor)
            element.style.borderBottomColor = convertToHex(computed.borderBottomColor)
            element.style.borderLeftColor = convertToHex(computed.borderLeftColor)
            element.style.outlineColor = convertToHex(computed.outlineColor)

            if (computed.backgroundImage && computed.backgroundImage.includes("gradient")) {
              element.style.backgroundImage = "none"
              element.style.backgroundColor = "#177fc9"
            }
          })
        },
      })

      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = pdfWidth - 20
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 10

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      pdf.save(`${data.business_name.replace(/\s+/g, "-")}-Constraint-Audit-Results.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ["#177fc9", "#42adff", "#7AB8E8", "#1E90FF"][i % 4],
                left: `${Math.random() * 100}%`,
                top: "-20px",
              }}
              animate={{
                y: window.innerHeight + 100,
                x: [0, (Math.random() - 0.5) * 200],
                rotate: Math.random() * 360,
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <header className="bg-gradient-to-r from-[#177fc9] to-[#42adff] text-white py-12 shadow-2xl">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-3">Your Results Are Ready! 🎉</h1>
            <p className="text-xl text-blue-100 mb-2">{data.business_name}</p>
            <p className="text-blue-200">
              Analyzed on{" "}
              {new Date(data.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <motion.button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="mt-6 px-6 py-3 bg-white text-[#177fc9] font-bold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
              {isGeneratingPDF ? "Generating PDF..." : "Download Results as PDF"}
            </motion.button>
          </motion.div>
        </div>
      </header>

      <div ref={resultsRef} className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: revealStep >= 1 ? 1 : 0, scale: revealStep >= 1 ? 1 : 0.9 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-l-8 border-[#177fc9] rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: revealStep >= 2 ? 1 : 0,
                  rotate: revealStep >= 2 ? 0 : -180,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex-shrink-0"
              >
                <div className="w-24 h-24 bg-[#177fc9] rounded-full flex items-center justify-center text-white text-5xl shadow-xl">
                  {getConstraintEmoji(data.final_constraint)}
                </div>
              </motion.div>

              <div className="flex-1">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Your #1 Constraint Is:</h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: revealStep >= 3 ? 1 : 0,
                    scale: revealStep >= 3 ? 1 : 0.8,
                  }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="mb-4"
                >
                  <div className="text-4xl md:text-6xl font-black text-[#177fc9] mb-2">{data.final_constraint}</div>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-700">{data.primary_score}/10</span>
                    <span className="text-lg text-gray-600">{getScoreMessage(data.primary_score)}</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: revealStep >= 4 ? 1 : 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="bg-white/70 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">AI Confidence</span>
                      <span className="text-sm font-bold text-gray-700">{data.confidence}/10</span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.7 + i * 0.05 }}
                          className={`flex-1 h-6 rounded ${i < data.confidence ? "bg-[#177fc9]" : "bg-gray-300"}`}
                          style={{ transformOrigin: "bottom" }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-lg text-gray-800 leading-relaxed">{data.reasoning}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealStep >= 4 ? 1 : 0, y: revealStep >= 4 ? 0 : 20 }}
          transition={{ delay: 0.8 }}
          className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12"
        >
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📊</span>
                Your Full Scorecard
              </h3>

              <div className="aspect-square mb-6">
                <Radar data={radarData} options={radarOptions} />
              </div>

              <div className="space-y-3">
                {Object.entries(data.scores).map(([lever, score]) => (
                  <motion.div
                    key={lever}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + Object.keys(data.scores).indexOf(lever) * 0.1 }}
                    className={`group relative overflow-hidden rounded-lg transition-all ${
                      lever === data.final_constraint
                        ? "bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-[#177fc9] shadow-md"
                        : "bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${getConstraintColor(lever)} opacity-10 transition-all`}
                      style={{ width: `${(score / 10) * 100}%` }}
                    />

                    <div className="relative flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getConstraintEmoji(lever)}</span>
                        <div>
                          <span
                            className={`font-semibold block ${
                              lever === data.final_constraint ? "text-[#177fc9]" : "text-gray-700"
                            }`}
                          >
                            {lever}
                          </span>
                          <span className="text-xs text-gray-500">{getScoreMessage(score)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`text-3xl font-bold ${
                            lever === data.final_constraint ? "text-[#177fc9]" : "text-gray-600"
                          }`}
                        >
                          {score}
                        </span>
                        <span className="text-gray-400 text-sm">/10</span>
                        {lever === data.final_constraint && <span className="text-2xl animate-pulse">🎯</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">💡</span>
                Why This Is Your Bottleneck
              </h3>
              <div className="space-y-4">
                {data.evidence_points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.15 }}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:border-blue-400 transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#177fc9] to-[#42adff] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">{point}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-xl p-8 border-2 border-green-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">💰</span>
                What This Costs You
              </h3>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Current Monthly Revenue
                  </div>
                  <div className="text-4xl font-black text-gray-800">
                    Le {data.revenue_impact.currentMonthly.toLocaleString()}M
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ~${(data.revenue_impact.currentMonthly / 25000).toFixed(0)} USD
                  </div>
                </motion.div>

                <div className="flex items-center justify-center py-2">
                  <motion.svg
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.7, repeat: Number.POSITIVE_INFINITY, duration: 1, repeatType: "reverse" }}
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.9 }}
                  className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 shadow-lg"
                >
                  <div className="text-sm font-semibold text-green-100 uppercase tracking-wide mb-2">
                    Potential Monthly Revenue
                  </div>
                  <div className="text-5xl font-black text-white mb-4">
                    Le {data.revenue_impact.potentialMonthly.toLocaleString()}M
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-green-50 text-sm leading-relaxed">{data.revenue_impact.explanation}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.1 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-500 rounded-lg p-6"
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">
                      💸 Monthly Opportunity Cost
                    </div>
                    <div className="text-5xl font-black text-red-600 mb-2">
                      Le {data.revenue_impact.monthlyOpportunityCost.toLocaleString()}M
                    </div>
                    <div className="text-sm text-red-600 font-medium mb-4">
                      That's Le {data.revenue_impact.yearlyOpportunityCost.toLocaleString()}M per year
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">In USD (Annually)</div>
                      <div className="text-3xl font-black text-gray-800">
                        ${(data.revenue_impact.yearlyOpportunityCost / 25000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.3 }}
                  className="text-center p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="text-sm text-gray-600 mb-2">Potential Growth</div>
                  <div className="text-4xl font-black text-green-600">
                    +
                    {Math.round(
                      ((data.revenue_impact.potentialMonthly - data.revenue_impact.currentMonthly) /
                        data.revenue_impact.currentMonthly) *
                        100,
                    )}
                    %
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5 }}
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-8 border-l-8 border-amber-500"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3">⚡</span>
                Quick Win (Start Today!)
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Action
                  </div>
                  <div className="text-xl font-bold text-gray-900 bg-white rounded-lg p-4 shadow-sm border border-amber-200">
                    {data.quick_win.action}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Expected Impact
                  </div>
                  <div className="text-lg text-gray-800 bg-white rounded-lg p-4 shadow-sm border border-amber-200">
                    {data.quick_win.impact}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Time Required
                  </div>
                  <div className="text-lg font-medium text-gray-800 bg-white rounded-lg p-4 shadow-sm border border-amber-200">
                    ⏱️ {data.quick_win.time}
                  </div>
                </div>

                <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
                  <p className="text-sm text-amber-800 italic">
                    💡 <strong>Pro Tip:</strong> Do this TODAY. Small wins build momentum and prove the system works
                    before committing to the full 90-day plan.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black mb-4">Ready to Fix This in 90 Days?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Get your personalized 90-day roadmap + book a strategy session to discuss implementation
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href={`mailto:${data.email}?subject=Your 90-Day Roadmap - ${data.final_constraint}&body=Hi ${data.owner_name},%0D%0A%0D%0AThank you for completing the Constraint-Busting Audit!%0D%0A%0D%0AYour personalized 90-day roadmap for fixing "${data.final_constraint}" is attached.%0D%0A%0D%0AWhen you're ready to discuss implementation, book a strategy session:%0D%0Ahttps://calendly.com/joe-tenacity/audit-results%0D%0A%0D%0ALooking forward to helping you 2x your revenue!%0D%0A%0D%0A- Joe / Tenacity Ventures`}
                  className="group inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-6 h-6 mr-2 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email Me My Roadmap
                </a>

                <a
                  href="https://calendly.com/joe-tenacity/audit-results"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-all transform hover:scale-105 shadow-lg border-2 border-white"
                >
                  <svg
                    className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Book Strategy Session
                </a>
              </div>

              <div className="border-t border-white/30 pt-6 mt-6">
                <p className="text-blue-100 text-lg mb-4">Want to discuss your results right now?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href={`https://wa.me/23230600800?text=Hi Joe! I just completed my audit. My constraint is: ${encodeURIComponent(data.final_constraint)}. Can we discuss?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-white hover:text-blue-100 transition-colors"
                  >
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span className="font-semibold">WhatsApp: +232 30 600 600</span>
                  </a>
                  <span className="text-blue-200">•</span>

                  {/*<a href={`mailto:joe@10na.city?subject=Audit Results - ${data.business_name}`}
                    className="inline-flex items-center text-white hover:text-blue-100 transition-colors"
                  >
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="font-semibold">joe@10na.city</span>
                  </a>*/}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <footer className="mt-16 text-center text-gray-600">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
              <div className="mb-4">
                <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-2">
                  Startup Bodyshop
                </h4>
              </div>
              <p className="font-semibold text-gray-800 mb-2">Joe Abass Bangura | Founder & CEO</p>
              <div className="flex justify-center space-x-6 text-sm">
                <a
                  href="https://startupbodyshop.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  startupbodyshop.com
                </a>
                <a
                  href="https://wa.me/23230600800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  WhatsApp
                </a>
                <a
                  href="https://linkedin.com/in/davidpratt-sl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  LinkedIn
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-6">
                © {new Date().getFullYear()} Tenacity Ventures Limited. All rights reserved.
              </p>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  )
}
