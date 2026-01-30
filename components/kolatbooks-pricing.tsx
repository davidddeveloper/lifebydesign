"use client"

import { motion } from "framer-motion"
import type { PricingPlansSection } from "@/sanity/lib/types"

interface FinancePricingProps {
  onOpenForm: () => void
  data?: PricingPlansSection
}

export function FinancePricing({ onOpenForm, data }: FinancePricingProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const defaultPlans = [
    {
      name: "Starter",
      focus: "Bookkeeping + reports + basic support",
      monthlyPrice: "SLL 2,500",
      yearlyPrice: "SLL 30,000",
      features: [
        "Monthly bookkeeping & reconciliation",
        "Financial statements (P&L, Balance Sheet, Cash Flow)",
        "Basic tax support",
        "Email support",
      ],
      highlighted: false,
    },
    {
      name: "Growth",
      focus: "Starter + loan pack + profit audits + training",
      monthlyPrice: "SLL 5,000",
      yearlyPrice: "SLL 60,000",
      highlighted: true,
      features: [
        "Everything in Starter",
        "Loan-approval pack preparation",
        "Profit audits & analysis",
        "Financial training sessions",
        "Priority email + WhatsApp support",
      ],
    },
    {
      name: "VIP CFO",
      focus: "Growth + payroll + forecasting + monthly advisory",
      monthlyPrice: "Discuss pricing with our team",
      yearlyPrice: "",
      highlighted: false,
      features: [
        "Everything in Growth",
        "Payroll support",
        "Cash flow forecasting",
        "Monthly advisory calls",
        "Dedicated accountant",
        "Strategic financial planning",
      ],
    },
  ]

  const plans = data?.plans?.map(p => ({
    name: p.name || "",
    focus: p.focus || "", // focus mapped from schema 'focus'
    monthlyPrice: p.price || "",
    yearlyPrice: p.yearlyPrice || "",
    features: p.features || [],
    highlighted: p.highlighted || false
  })) || defaultPlans

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-center" variants={itemVariants}>
            Simple, Transparent Pricing
          </motion.h2>

          <motion.p className="text-center text-gray-600 mb-12" variants={itemVariants}>
            Choose the plan that fits your business stage and scale as you grow.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-lg p-8 transition-all ${plan.highlighted
                    ? "bg-[#177fc9] text-white border-2 border-[#177fc9] transform md:scale-105"
                    : "bg-white border border-gray-200"
                  }`}
                variants={itemVariants}
              >
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.highlighted ? "text-purple-100" : "text-gray-600"}`}>{plan.focus}</p>

                <div className="mb-8">
                  <div className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                    {plan.monthlyPrice}
                  </div>
                  <p className={`text-sm ${plan.highlighted ? "text-purple-100" : "text-gray-600"}`}>
                    per month • {plan.yearlyPrice} yearly
                  </p>
                </div>

                <button
                  onClick={onOpenForm}
                  className={`w-full py-3 px-6 rounded-full font-bold mb-8 transition-colors ${plan.highlighted
                      ? "bg-white text-[#177fc9] hover:bg-gray-100"
                      : "bg-[#177fc9] text-white hover:bg-[#42adff]"
                    }`}
                >
                  Get Started
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? "text-white" : "text-[#7c3aed]"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className={`text-sm ${plan.highlighted ? "text-white" : "text-gray-700"}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
