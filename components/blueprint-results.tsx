"use client"

import { motion } from "framer-motion"
import { TrendingUp, Quote } from "lucide-react"

export function BlueprintResults() {
  const caseStudies = [
    {
      name: "Fatmata",
      business: "Boutique Owner",
      constraint: "WHO (Wrong Market)",
      before: "Le 15M/month",
      after: "Le 46M/month",
      increase: "+207%",
      quote: "I was selling to everyone and converting no one. The workshop helped me pick one profitable niche. Everything changed.",
    },
    {
      name: "Mohamed",
      business: "Tech Services",
      constraint: "HOW THEY FIND YOU (No Lead System)",
      before: "Le 25M/month",
      after: "Le 70M/month",
      increase: "+180%",
      quote: "I went from feast-or-famine to predictable clients every month. The roadmap was clear, the coaching kept me accountable.",
    },
    {
      name: "Abdul",
      business: "Logistics Business",
      constraint: "HOW YOU DELIVER (Operations Chaos)",
      before: "Le 60M/month",
      after: "Le 104M/month",
      increase: "+73%",
      quote: "We could finally take on bigger clients because our systems worked. Worth every leone.",
    },
    {
      name: "Isatu",
      business: "Professional Services",
      constraint: "WHAT (Offer Not Compelling)",
      before: "Le 18M/month",
      after: "Le 40M/month",
      increase: "+120%",
      quote: "I restructured my entire service based on what I learned. Now clients say yes before I even mention price.",
    },
    {
      name: "Hassan",
      business: "Retail Shop",
      constraint: "HOW YOU SELL (Can't Close)",
      before: "Le 30M/month",
      after: "Le 54M/month",
      increase: "+80%",
      quote: "I learned I wasn't selling—I was taking orders. The coaching taught me a system that works.",
    },
  ]

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Real Businesses. Real Constraints. Real Results.
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            These are actual participants who completed the 90-Day Program and eliminated their constraints.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {caseStudies.map((study, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{study.name}</h3>
                    <p className="text-sm text-gray-600">{study.business}</p>
                  </div>
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-3 mb-3">
                  <p className="text-xs font-semibold text-red-800 uppercase mb-1">Constraint:</p>
                  <p className="text-sm text-red-900 font-bold">{study.constraint}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Before:</p>
                    <p className="text-sm font-bold text-gray-900">{study.before}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">After 90 Days:</p>
                    <p className="text-sm font-bold text-green-700">{study.after}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#177fc9] to-[#42adff] rounded-lg p-3 mb-4">
                  <p className="text-2xl font-black text-white text-center">{study.increase}</p>
                  <p className="text-xs text-white/90 text-center">Revenue Increase</p>
                </div>
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-[#177fc9]/20 absolute -top-2 -left-1" />
                <p className="text-sm text-gray-700 italic pl-4">{study.quote}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-[#177fc9] rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-black mb-6">Average Results</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-4xl font-black mb-2">30-50%</p>
              <p className="text-white/90 text-sm">Revenue Increase in 90 days</p>
            </div>
            <div>
              <p className="text-4xl font-black mb-2">100%</p>
              <p className="text-white/90 text-sm">Constraints Eliminated (for completers)</p>
            </div>
            <div>
              <p className="text-4xl font-black mb-2">80%</p>
              <p className="text-white/90 text-sm">Execution Rate (vs 5% DIY)</p>
            </div>
            <div>
              <p className="text-4xl font-black mb-2">4.9/5</p>
              <p className="text-white/90 text-sm">Average Satisfaction Rating</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
