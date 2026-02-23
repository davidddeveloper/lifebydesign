"use client"

import { motion } from "framer-motion"
import type { KolatPromise } from "@/payload/lib/types"

interface FinanceValuePropositionProps {
  data?: KolatPromise
}

export function FinanceValueProposition({ data }: FinanceValuePropositionProps) {
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

  const benefits = [
    "Professional setup and managed monthly execution",
    /*"Automated accounting using Zoho Books",*/
    "Credit-ready financial statements",
    "Real-time visibility into profits and cash flow",
    "Full compliance support",
    "Dedicated accountant support",
  ]
  // Note: ProductPromise schema only has heading, description, guarantee. No benefits list?
  // Schema check: productPromise.ts -> heading, description, guarantee.
  // The benefits list in the component seems hardcoded or belongs to another section?
  // It's inside the "Guaranteed Outcome" box visual, but logically might be part of "deliverables" or just supporting text.
  // If schema doesn't support it, I'll keep it hardcoded or I need to update schema.
  // "benefits" here seem generic value props.
  // I will keep them hardcoded for now or use description field if multiple paragraphs.

  const heading = data?.heading || "Our Promise to You"
  const description = data?.subheading || "We organize your SME finances, automate your accounting, and make you fully credit-ready — giving you the confidence to grow."
  const guarantee = data?.guarantee || "Clean books, credit-ready financial statements, and full confidence in your numbers."

  return (
    <section id="our-promise" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 text-center" variants={itemVariants}>
            {heading}
          </motion.h2>

          <motion.p className="text-lg text-gray-700 text-center mb-12" variants={itemVariants}>
            {description}
          </motion.p>

          <motion.div className="bg-gray-50 rounded-lg p-8 md:p-12" variants={itemVariants}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Guaranteed Outcome:</h3>
            <p className="text-lg text-gray-700 font-semibold mb-8">
              {guarantee}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div key={index} className="flex items-start gap-3" variants={itemVariants}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#177fc9] flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
