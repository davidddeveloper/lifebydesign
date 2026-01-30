"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { FAQReferenceSection } from "@/sanity/lib/types"

const defaultFaqs = [
  {
    question: "What is the Scaling Blueprint?",
    answer:
      "The Scaling Blueprint is a diagnostic and intervention system designed to identify and eliminate the biggest constraints in your business. It's built from real-world growth data and field execution with successful business owners. Unlike coaching programs that give general advice, we diagnose your specific constraint and prescribe a focused solution.",
  },
  {
    question: "How does the Scaling Blueprint work?",
    answer:
      "The process has three steps: First, we diagnose your business through an 8-function audit (Product, Marketing, Sales, Customer Service, IT, Recruitment, HR, Finance). Second, you attend a workshop or join our DIY program to learn how to solve your specific constraint. Third, if you want faster results, you can opt for our Done-With-You implementation where we embed alongside your team.",
  },
  {
    question: "What are the key benefits?",
    answer:
      "Businesses that apply the Scaling Blueprint experience improved clarity on where to focus, increased sales conversion and profit margins, stronger team accountability, enhanced cash flow management, and predictable, sustainable business growth.",
  },
  {
    question: "How is the Scaling Blueprint different from other programs?",
    answer:
      "Most programs are generic coaching. We're diagnostic, data-driven, and implementation-focused. We identify ONE constraint at a time and focus all energy on fixing it. We don't try to fix everything at once. This focused approach ensures measurable progress and sustainable scaling.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "Our core program is 6 months, broken into three phases: Foundation (Months 1-2), Traction (Months 3-4), and Acceleration (Months 5-6). Most participants see measurable improvement by Month 4 and hit their breakthrough milestone by Month 6. ",
  },
  {
    question: "Is this right for my business?",
    answer:
      "The Scaling Blueprint is designed for founders in three stages: Product-Market Fit Seekers (have a product but can't sell it), Chaotic Operators (making money but drowning in operations), and Overwhelmed Founders (business depends entirely on them). If you recognize yourself, it's worth exploring.",
  },
]

interface BlueprintFAQProps {
  data?: FAQReferenceSection
}

export function BlueprintFAQ({ data }: BlueprintFAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(-1)

  const faqs = data?.faq?.faqs || defaultFaqs

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#177fc9] transition-colors"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-black text-gray-900 text-left">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
