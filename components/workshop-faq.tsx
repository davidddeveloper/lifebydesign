"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { ScaleFormModal } from "@/components/scale-form-modal"

const faqs = [
  {
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
  },
  {
    question: "What is the Scaling Blueprint?",
    answer:
      "The Scaling Blueprint is LBD Startup Bodyshop's flagship business growth system. It's a diagnostic and intervention framework designed to help entrepreneurs identify and eliminate the single biggest constraint holding back their business growth. It focuses on clarity, control, and capacity — giving founders the structure and tools to scale sustainably and profitably.",
  },
  {
    question: "How does the Scaling Blueprint work?",
    answer: [
      "The Scaling Blueprint follows a three-step, hands-on process:",
      "1. Diagnose - A structured 8-function audit covering Product, Marketing, Sales, Customer Service, IT, HR, Recruitment, and Finance.",
      "2. Workshop (DIY Path) - A practical Scaling Workshop focused on the key constraint with frameworks, checklists, and a 90-day breakthrough plan.",
      "3. Done-With-You (DWY Path) - For faster implementation, LBD consultants work directly with teams to install systems and track growth.",
    ],
  },
  {
    question: "What are the key benefits of implementing the Scaling Blueprint?",
    answer: [
      "Businesses that apply the Scaling Blueprint experience:",
      "• Improved clarity on where to focus resources",
      "• Increased sales conversion and profit margins",
      "• Stronger team accountability and systemization",
      "• Enhanced cash flow management",
      "• Predictable, sustainable business growth",
    ],
  },
  {
    question: "How is LBD Startup Bodyshop different from other business support programs?",
    answer:
      "LBD Startup Bodyshop's approach is diagnostic, data-driven, and implementation-focused. The Scaling Blueprint focuses on one key constraint at a time, ensuring measurable progress with strategy, systems, and accountability.",
  },
  {
    question: "What is LBD Startup Bodyshop's broader vision?",
    answer:
      "Life by Design Startup Bodyshop aims to build a resilient and self-sustaining entrepreneurial ecosystem by equipping founders with the mindset, systems, and tools to scale. Through its work with ACTB Savings and Loans, iDT Labs and Inkeemedia, LBD Startup Bodyshop continues to amplify the voices of entrepreneurs, strengthen innovation capacity, and drive inclusive economic growth.",
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
