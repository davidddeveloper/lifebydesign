"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

const faqs = [
  {
    question: "What is the Scaling Blueprint?",
    answer:
      "The Scaling Blueprint is LBD Startup Bodyshop's flagship business growth system. It's a diagnostic and intervention framework designed to help entrepreneurs identify and eliminate the single biggest constraint holding back their business growth. It focuses on clarity, control, and capacity — giving founders the structure and tools to scale sustainably and profitably.",
  },
  {
    question: "How to register for a workshop",
    answer:
      'Register by clicking "I\'m Ready to Scale" to fill out an application form. We review applications to ensure fit and reach out within 48 hours with next steps and investment details.',
  },
  {
    question: "How does the Scaling Blueprint work?",
    answer:
      `The Scaling Blueprint follows a three-step, hands-on process:
      1. Diagnose - A structured 8-function audit covering Product, Marketing, Sales, Customer Service, IT, HR, Recruitment, and Finance.
      2. Workshop (DIY Path) - A practical Scaling Workshop focused on the key constraint with frameworks, checklists, and a 90-day breakthrough plan.
      3. Done-With-You (DWY Path) - For faster implementation, LBD consultants work directly with teams to install systems and track growth.`
  },
  {
    question: "What are the key benefits of implementing the Scaling Blueprint?",
    answer:
      `Businesses that apply the Scaling Blueprint experience:
• Improved clarity on where to focus resources
• Increased sales conversion and profit margins
• Stronger team accountability and systemization
• Enhanced cash flow management
• Predictable, sustainable business growth`,
  },
  {
    question: "How is LBD different from other business support programs?",
    answer:
      "LBD's approach is diagnostic, data-driven, and implementation-focused. The Scaling Blueprint focuses on one key constraint at a time, ensuring measurable progress with strategy, systems, and accountability.",
  },
  {
    question: "What is LBD Startup Bodyshop broader vision?",
    answer: "Life by Design Startup Bodyshop aims to build a resilient and self-sustaining entrepreneurial ecosystem by equipping founders with the mindset, systems, and tools to scale. Through partnerships with IDT Labs and Inkee Media, LBD continues to amplify the voices of entrepreneurs, strengthen innovation capacity, and drive inclusive economic growth."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">FAQs</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-[#1e293b] hover:bg-[#2d3b52] text-white px-6 py-5 rounded-lg flex items-center justify-between transition-colors"
              >
                <span className="text-base md:text-lg font-bold text-left">{faq.question}</span>
                {openIndex === index ? (
                  <X className="w-6 h-6 flex-shrink-0 ml-4" />
                ) : (
                  <Plus className="w-6 h-6 flex-shrink-0 ml-4" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 py-5 bg-gray-50 rounded-b-lg border border-t-0 border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
