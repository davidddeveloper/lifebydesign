"use client"

import { motion, type Variants } from "framer-motion"
import { CheckCircle2, BarChart3, Zap } from "lucide-react"

export function BlueprintProcess() {
  const stepVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  }

  const steps = [
    {
      number: "01",
      title: "Attend the 2-Day Workshop",
      subtitle: "Learn the Framework. Find Your Constraint.",
      description:
        "In 2 days (Friday-Saturday), you'll learn the 5 Levers Framework, score your business on each lever, identify your #1 constraint, build a 90-day plan outline, and find an accountability partner.",
      details: ["Investment: $100", "Next Workshop: [Date & Location]"],
      icon: BarChart3,
    },
    {
      number: "02",
      title: "Execute (With or Without Coaching)",
      subtitle: "Two Paths Forward",
      description:
        "DIY Path: Execute your plan alone with the framework ($100 total, 5% success rate). Done-With-You Path: Get expert coaching for 90 days ($600 pilot, 80% success rate).",
      details: [],
      icon: CheckCircle2,
    },
    {
      number: "03",
      title: "Measure Results",
      subtitle: "See Real Growth in 90 Days",
      description:
        "Average results: 30-50% revenue increase, constraint eliminated, working fewer hours, clear system in place.",
      details: [],
      icon: Zap,
    },
  ]

  return (
    <section id="how-it-works" className="pt-14 pb-4 md:pt-16 md:pb-5 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">The Complete Constraint-Busting System</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Three simple steps to identify and eliminate your constraint</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-[#42adff] transition-colors">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-[#177fc9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>

                  <Icon className="w-8 h-8 text-[#177fc9] mb-6 mt-4" />
                  <h3 className="text-xl font-black text-gray-900 mb-2">{step.title}</h3>
                  {"subtitle" in step && <p className="text-sm font-semibold text-[#177fc9] mb-4">{step.subtitle}</p>}
                  <p className="text-gray-600 leading-relaxed text-base mb-4">{step.description}</p>
                  {"details" in step && step.details.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {step.details.map((detail, j) => (
                        <p key={j} className="text-sm text-gray-700 font-semibold">{detail}</p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 p-8 bg-[#42adff]/10 border-l-4 border-[#42adff] rounded-lg"
        >
          <p className="text-lg text-gray-900">
            <span className="font-black">The Done-With-You path delivers 16x better execution rate</span> (80% vs 5%) with professional coaching and accountability. Average ROI: 6-11x within 90 days.
          </p>
        </motion.div>
      </div>
    </section>
  )
}