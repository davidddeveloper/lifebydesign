"use client"

import { motion } from "framer-motion"
import { Check, X, TrendingUp } from "lucide-react"

export function BlueprintComparison() {
  const comparisonData = {
    diy: {
      name: "DIY PATH",
      subtitle: "Workshop Only",
      investment: "$100",
      whatYouGet: [
        "5 Levers Framework",
        "Self-diagnostic tool",
        "90-Day Plan Outline",
        "Week 1 Action Checklist",
        "Accountability Partner (from workshop)",
        "20-page Workbook",
      ],
      support: [
        "Peer accountability partner (weekly check-ins)",
        "Email support (as available)",
        "Self-discipline and execution",
      ],
      successRate: {
        executeFully: "5%",
        executePartially: "15%",
        dontExecute: "80%",
      },
      typicalResult: "Some improvement if you're very disciplined",
      bestFor: [
        "Very self-motivated founders",
        "Have successfully completed programs before",
        "Limited budget right now",
      ],
    },
    doneWithYou: {
      name: "DONE-WITH-YOU PATH",
      subtitle: "Workshop + 90-Day Program",
      investment: "$700 total",
      investmentBreakdown: "($100 workshop + $600 program)",
      whatYouGet: [
        "Everything in DIY path PLUS:",
        "41-Question Complete Audit",
        "Detailed 90-Day Roadmap",
        "6 Coaching Calls (45 min each)",
        "Daily WhatsApp Support",
        "Progress Tracking Dashboard",
        "All Templates & Tools",
        "Troubleshooting on Demand",
      ],
      support: [
        "Professional coach (bi-weekly calls)",
        "Daily WhatsApp access (24hr response)",
        "Structured accountability system",
        "Expert troubleshooting when stuck",
      ],
      successRate: {
        executeFully: "80%",
        executePartially: "15%",
        dontExecute: "5%",
      },
      typicalResult: "30-50% revenue increase, constraint eliminated",
      bestFor: [
        "Serious about growth this year",
        "Want expert guidance and accountability",
        "Value speed and certainty",
        "Can invest in results",
      ],
    },
  }

  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Two Paths: Choose Your Speed</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Both paths start with the same 2-day workshop. The difference is what happens next.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* DIY PATH */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 border-2 border-gray-200"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-black text-gray-900 mb-1">{comparisonData.diy.name}</h3>
              <p className="text-sm text-gray-600 font-semibold">{comparisonData.diy.subtitle}</p>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-black text-gray-900">{comparisonData.diy.investment}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 uppercase mb-3">What You Get:</p>
              <ul className="space-y-2">
                {comparisonData.diy.whatYouGet.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900 uppercase mb-3">Support:</p>
              <ul className="space-y-2">
                {comparisonData.diy.support.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 bg-red-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Success Rate:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Execute fully:</span>
                  <span className="text-sm font-bold text-red-600">{comparisonData.diy.successRate.executeFully}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Execute partially:</span>
                  <span className="text-sm font-bold text-gray-700">{comparisonData.diy.successRate.executePartially}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Don't execute:</span>
                  <span className="text-sm font-bold text-gray-700">{comparisonData.diy.successRate.dontExecute}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 uppercase mb-2">Typical Result:</p>
              <p className="text-sm text-gray-700">{comparisonData.diy.typicalResult}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 uppercase mb-3">Best For:</p>
              <ul className="space-y-2">
                {comparisonData.diy.bestFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* DONE-WITH-YOU PATH */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#177fc9] to-[#42adff] rounded-2xl p-8 border-4 border-[#177fc9] relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-xs font-black uppercase">
              Recommended
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-black text-white mb-1">{comparisonData.doneWithYou.name}</h3>
              <p className="text-sm text-white/90 font-semibold">{comparisonData.doneWithYou.subtitle}</p>
            </div>

            <div className="mb-6">
              <p className="text-4xl font-black text-white mb-1">{comparisonData.doneWithYou.investment}</p>
              <p className="text-sm text-white/80">{comparisonData.doneWithYou.investmentBreakdown}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-white uppercase mb-3">What You Get:</p>
              <ul className="space-y-2">
                {comparisonData.doneWithYou.whatYouGet.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 pb-6 border-b border-white/20">
              <p className="text-sm font-semibold text-white uppercase mb-3">Support:</p>
              <ul className="space-y-2">
                {comparisonData.doneWithYou.support.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-white text-sm">•</span>
                    <span className="text-sm text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 bg-white/10 rounded-lg p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white mb-3">Success Rate:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Execute fully:</span>
                  <span className="text-sm font-bold text-green-300">{comparisonData.doneWithYou.successRate.executeFully}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Execute partially:</span>
                  <span className="text-sm font-bold text-white">{comparisonData.doneWithYou.successRate.executePartially}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Don't execute:</span>
                  <span className="text-sm font-bold text-white">{comparisonData.doneWithYou.successRate.dontExecute}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-white uppercase mb-2">Typical Result:</p>
              <p className="text-sm text-white font-bold">{comparisonData.doneWithYou.typicalResult}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-white uppercase mb-3">Best For:</p>
              <ul className="space-y-2">
                {comparisonData.doneWithYou.bestFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-white text-sm">•</span>
                    <span className="text-sm text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom Line Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12 bg-white rounded-2xl p-8 border-2 border-[#177fc9]"
        >
          <div className="flex items-start gap-4">
            <TrendingUp className="w-12 h-12 text-[#177fc9] flex-shrink-0" />
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Bottom Line</h3>
              <p className="text-gray-700 leading-relaxed">
                The Done-With-You path delivers <span className="font-black text-[#177fc9]">16x better execution rate</span> (80% vs 5%) with professional coaching and accountability. Average ROI: <span className="font-black">6-11x</span> within 90 days for a Le 40M/month business.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
