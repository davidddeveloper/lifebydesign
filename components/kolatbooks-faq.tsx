"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"


{/*
  question: "How does the onboarding process work?",
  answer:
    "Onboarding happens in four phases over 30 days: Phase I (Data Collection & Audit) ensures clarity on your current state, Phase II (System Configuration) establishes your professional structure, Phase III (Record Import & Reconciliation) organizes your books, and Phase IV (Final Reporting & Roadmap) delivers your first comprehensive financial report and growth strategy.",
},
{
  question: "What is included in each pricing tier?",
  answer:
    "Starter ($100/month) includes monthly bookkeeping, financial statements, and basic support. Growth ($200/month) adds loan-approval packs, profit audits, and training. VIP CFO ($450/month) includes everything plus payroll support, cash flow forecasting, monthly advisory calls, and a dedicated accountant.",
*/}
export function FinanceFaq() {
  const [openIndex, setOpenIndex] = useState(-1)

  const faqs = [
    {
      question: "What is the Kolat Books™?",
      answer:
        "The Kolat Books™ is a Done-For-You Smart Accounting and Credit Ready Books service for SMEs in Sierra Leone. We professionally set up and manage your monthly financial systems, automate your accounting, and make you credit-ready so you can access capital and grow with confidence.",
    },
    {
      question: "Who is this service for?",
      answer:
        "This service is designed for small business owners in Sierra Leone who need proper financial systems without hiring a full-time accountant. It's ideal for founders who want credit and investor readiness, freedom from manual record-keeping, and professional financial management.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Yes, you can adjust your plan based on your business needs. We work with you to ensure you're on the right tier for your current stage, and you can upgrade as your business grows or downgrade if your needs change.",
    },
    {
      question: "What if I need help beyond accounting?",
      answer:
        "If you need business scaling support or strategy sessions, you can combine Kolat Books™ with our Scaling Blueprint program. This gives you both financial clarity and business growth guidance for a comprehensive business transformation.",
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-bold text-gray-900 text-left">{faq.question}</span>
                  <motion.svg
                    className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
