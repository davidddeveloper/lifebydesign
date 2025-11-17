"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface BlueprintValueLadderProps {
  onOpenForm: () => void
}

export function BlueprintValueLadder({ onOpenForm }: BlueprintValueLadderProps) {
  const tiers = [
    {
      stage: "Stage 1",
      name: "Diagnostic (Free)",
      description: "Start here to identify your constraint",
      features: [
        "Structured 8-function audit",
        "Constraint identification",
        "Personalized diagnostic report",
        "Clear next steps",
      ],
      cta: "Get Your Diagnostic",
      highlighted: false,
      price: "Free",
    },
    {
      stage: "Stage 2",
      name: "Paid Workshop",
      description: "DIY transformation with our frameworks",
      features: [
        "Live or On-Demand Workshop",
        "Complete workbook & exercises",
        "Frameworks & checklists",
        "90-Day Breakthrough Plan",
        "Access to resource library",
      ],
      cta: "Enroll in Workshop",
      highlighted: true,
      price: "SLE 5,000",
    },
    {
      stage: "Stage 3",
      name: "Done-With-You",
      description: "We implement alongside your team",
      features: [
        "24 weeks of guided implementation",
        "Weekly 1:1 coaching calls",
        "Complete SOP library",
        "Accountability system",
        "Community access",
        "Results guarantee",
      ],
      cta: "Invite only after the Workshop",
      highlighted: false,
      price: "Discuss pricing with our team",
    },
  ]

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Choose Your Path</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Pick the option that fits your stage and speed</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className={`rounded-2xl overflow-hidden transition-all ${
                tier.highlighted
                  ? "ring-2 ring-[#177fc9] transform md:scale-105"
                  : "border border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`${tier.highlighted ? "bg-[#177fc9] text-white" : "bg-gray-50"} px-8 py-6`}>
                <p className="text-sm font-black uppercase tracking-wider opacity-75">{tier.stage}</p>
                <h3 className="text-2xl font-black mt-2">{tier.name}</h3>
              </div>

              <div className="p-8">
                <p className="text-sm text-gray-600 mb-6">{tier.description}</p>

                <div className={`text-3xl font-black mb-8 ${tier.highlighted ? "text-[#177fc9]" : "text-gray-900"}`}>
                  {tier.price}
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#177fc9]" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={tier.stage !== "Stage 3" ? onOpenForm : () => {}}
                  className={`w-full py-3 px-6 font-bold rounded-lg transition-colors ${
                    tier.highlighted
                      ? "bg-[#177fc9] text-white hover:bg-[#177fc9]"
                      : "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                  }
                    ${tier.stage !== "Stage 3" ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  {tier.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
