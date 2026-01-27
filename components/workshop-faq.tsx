"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { ScaleFormModal } from "@/components/scale-form-modal"

{/*{
    question: "What actually happens during the 2 days?",
    answer:
      "You'll participate in intensive workshops, receive personalized coaching from our directors, learn our proven scaling frameworks, and have direct access to Alex Hormozi for Q&A sessions.",
  },
  {
    question: "What do I walk away with?",
    answer: [
      "The aim: you walk away with 3-5 tactical next steps.",
      "You spend time with our team (and me.) We tailor the advice to your business size, industry, goals, and leadership style.",
      "It's hands-on help specific to your biggest challenge.",
      "Plus; you get a thick packet w/ key takeaways & strategies.",
    ],
  },
  {
    question: "Is this right for my business size/industry?",
    answer:
      "This workshop is designed for entrepreneurs doing $1M+ in annual revenue who are serious about scaling. We work with businesses across all industries and tailor our advice to your specific situation.",
  },
  {
    question: "How much are tickets?",
    answer:
      "Investment details are provided during the application process. This ensures we're working with entrepreneurs who are the right fit for the intensive nature of the workshop.",
  },
  {
    question: "How to register for a workshop",
    answer:
      'Register by clicking "I\'m Ready to Scale" to fill out an application form. We review applications to ensure fit and reach out within 48 hours with next steps and investment details.',
  },*/}
const faqs = [
  {
    question: "What is the Scaling Blueprint?",
    answer:
      "The Scaling Blueprint is LBD Startup Bodyshop's flagship business growth system. It's a diagnostic and intervention framework designed to help entrepreneurs identify and eliminate the single biggest constraint holding back their business growth. It focuses on clarity, control, and capacity — giving founders the structure and tools to scale sustainably and profitably. We use the 5 Levers Framework to diagnose your business, then give you a tactical roadmap to fix your bottleneck. Average result: 30-50% revenue increase in 90-180 days.",
  },
  {
    question: "How does the Scaling Blueprint work?",
    answer: [
      "Step 1: Attend the 2-day workshop. Learn the 5 Levers Framework, identify your constraint, and build your 90-day plan.",
      "Step 2: Choose your path:",
      "DIY: Execute the plan yourself )",
      "Done-With-You: Get expert coaching. Includes deep audit, 6 coaching calls, and daily WhatsApp support.",
      "Step 3: Eliminate your constraint in 90 days. See measurable results (average 30-50% revenue increase).",
    ],
  },
  {
    question: "What are the key benefits of implementing the Scaling Blueprint?",
    answer: [
      "Clarity: Know exactly what's holding you back—no more guessing.",
      "Focus: Stop wasting time on problems that don't matter. Attack the ONE constraint choking your growth.",
      "Results: Average 30-50% revenue increase in 90 - 180 days. 80% of Done-With-You participants execute fully (vs 5% DIY success rate).",
      "System: Learn a repeatable method you can use endlessly. After fixing one constraint, you can tackle the next.",
      
    ],
  },
  {
    question: "How is LBD Startup Bodyshop different from other business support programs?",
    answer: [
      "Most programs give generic advice. \"Do more marketing.\" \"Improve your operations.\" \"Work on your mindset.\"",
      "We use the Theory of Constraints to identify your specific bottleneck, then give you a constraint-specific solution.",
      "The Difference?",
      "We diagnose before prescribing (most programs guess)",
      "We focus on ONE constraint at a time (most programs overwhelm you)",
      "We track results (30-50% average increase, not vague promises)",
      "We guarantee it (If you do the work and see zero results, we work with you until you get the results at no additional costs)",
    ]
  },
  {
    question: "What is LBD Startup Bodyshop's broader vision?",
    answer:
      [
          "To build the most successful businesses in Sierra Leone by eliminating the constraints holding them back, one business at a time.",
          "We believe most businesses aren't stuck because they lack ideas or effort—they're stuck because they don't know which problem to solve first. The Scaling Blueprint gives them that clarity, then the tools to execute.",
          "Our vision: A thriving Sierra Leone business ecosystem where founders stop guessing and start growing.",
      ]
  },
]

export function WorkshopFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="bg-white py-8 md:py-16">
        <h2 className="mx-auto text-3xl w-[250px mb-10 text-center text-gray-900 font-black">FAQs</h2>
        <div className="container mx-auto px-4 max-w-4xl">
          {/* FAQ Items */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div key={index} className="border-none">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full bg-[#1e293b] hover:bg-[#2d3b52] text-white px-6 py-6 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span className="text-base md:text-md font-bold text-left">{faq.question}</span>
                  <motion.div animate={{ rotate: openIndex === index ? 45 : 0 }} transition={{ duration: 0.3 }}>
                    {openIndex === index ? (
                      <X className="w-6 h-6 flex-shrink-0 ml-4" />
                    ) : (
                      <Plus className="w-6 h-6 flex-shrink-0 ml-4" />
                    )}
                  </motion.div>
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: openIndex === index ? "auto" : 0, opacity: openIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-6 bg-gray-50 rounded-b-lg">
                    {Array.isArray(faq.answer) ? (
                      <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                        {faq.answer.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700 text-lg leading-relaxed">{faq.answer}</p>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              size="default"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
            >
              I'M READY TO SCALE
            </Button>
          </div>
        </div>
      </section>

      <ScaleFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
