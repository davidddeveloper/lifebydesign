"use client"

import { motion } from "framer-motion"
import { Users, Package, TrendingUp, Megaphone, Settings } from "lucide-react"

export function Blueprint5Levers() {
  const levers = [
    {
      number: 1,
      name: "WHO (Your Market)",
      question: "Are you targeting the right customers?",
      icon: Users,
      signs: [
        "You have a great product but struggle to find buyers",
        "Customer acquisition is expensive",
        "High churn or refund rates",
        "Constantly explaining what you do",
      ],
    },
    {
      number: 2,
      name: "WHAT (Your Offer)",
      question: "Is your offer strong enough?",
      icon: Package,
      signs: [
        "Lots of interest but few buyers",
        "Price objections constantly",
        "Competitors win on price",
        "No clear differentiation",
      ],
    },
    {
      number: 3,
      name: "HOW YOU SELL (Your Conversion)",
      question: "Can you convert leads effectively?",
      icon: TrendingUp,
      signs: [
        "Plenty of leads but low close rate",
        "Long sales cycles",
        "Lose deals at the last minute",
        "Can't articulate value clearly",
      ],
    },
    {
      number: 4,
      name: "HOW THEY FIND YOU (Your Lead Generation)",
      question: "Do you have predictable lead flow?",
      icon: Megaphone,
      signs: [
        "Inconsistent revenue (feast or famine)",
        "Relying on referrals only",
        "Marketing feels like guesswork",
        "Can't generate leads on demand",
      ],
    },
    {
      number: 5,
      name: "HOW YOU DELIVER (Your Operations)",
      question: "Do you have systems in place?",
      icon: Settings,
      signs: [
        "Quality issues at scale",
        "Customer complaints increasing",
        "You're the bottleneck",
        "Team can't deliver without you",
      ],
    },
  ]

  const scoreRanges = [
    { range: "0-3", label: "BROKEN", description: "This is likely your constraint", color: "text-red-600" },
    { range: "4-6", label: "WORKING", description: "But needs improvement", color: "text-yellow-600" },
    { range: "7-8", label: "GOOD", description: "Functioning well", color: "text-blue-600" },
    { range: "9-10", label: "EXCELLENT", description: "Optimized", color: "text-green-600" },
  ]

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Every Business Needs These 5 Things Working
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            After working with hundreds of businesses, we discovered something simple: Every business has exactly 5
            critical functions. We call them &quot;levers.&quot;
          </p>
          <p className="text-lg text-gray-900 font-semibold mt-4">
            When all 5 levers work together, you grow. When even ONE is broken, you&apos;re stuck.
          </p>
        </motion.div>

        {/* The 5 Levers */}
        <div className="space-y-6 mb-16">
          {levers.map((lever, i) => {
            const Icon = lever.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#177fc9] rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-[#177fc9]">LEVER {lever.number}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">{lever.name}</h3>
                    <p className="text-lg text-gray-700 font-semibold">{lever.question}</p>
                  </div>
                </div>

                <div className="ml-0 md:ml-16">
                  <p className="text-sm font-semibold text-gray-600 uppercase mb-3">Signs this is your constraint:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {lever.signs.map((sign, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-[#177fc9] mt-1">•</span>
                        <span className="text-gray-700 text-sm">{sign}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Scoring System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#177fc9] to-[#42adff] rounded-2xl p-8 md:p-12 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-black mb-6 text-center">How We Score</h3>
          <p className="text-lg mb-8 text-center text-white/90">
            We rate each lever 0-10:
          </p>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {scoreRanges.map((range, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 text-center"
              >
                <p className={`text-2xl font-black ${range.color} mb-1`}>{range.range}</p>
                <p className={`text-sm font-bold ${range.color} mb-2`}>{range.label}</p>
                <p className="text-xs text-gray-600">{range.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <p className="text-xl font-bold text-center mb-4">Your constraint = Your lowest score</p>
            <div className="bg-white rounded-xl p-6">
              <p className="text-sm font-semibold text-gray-600 mb-4 text-center">Example:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">WHO:</span>
                  <span className="font-bold text-red-600">3/10 ← FIX THIS FIRST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">WHAT:</span>
                  <span className="text-gray-700">6/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">HOW YOU SELL:</span>
                  <span className="text-gray-700">5/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">HOW THEY FIND YOU:</span>
                  <span className="text-gray-700">4/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">HOW YOU DELIVER:</span>
                  <span className="text-gray-700">7/10</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
                This business should focus 100% on WHO for the next 90 days. Everything else is working well enough.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
