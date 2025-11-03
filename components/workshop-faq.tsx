"use client"

import { useState } from "react"
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
]

export function WorkshopFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* FAQ Items */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div key={index} className="border-none">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full bg-[#1e293b] hover:bg-[#2d3b52] text-white px-6 py-6 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span className="text-lg md:text-xl font-bold text-left">{faq.question}</span>
                  {openIndex === index ? (
                    <X className="w-6 h-6 flex-shrink-0 ml-4" />
                  ) : (
                    <Plus className="w-6 h-6 flex-shrink-0 ml-4" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 py-6 bg-gray-50 rounded-b-lg">
                    {Array.isArray(faq.answer) ? (
                      <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                        {faq.answer.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700 text-lg leading-relaxed">{faq.answer}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#74c0fc] hover:bg-[#42adff] text-white font-bold text-lg px-12 py-6 rounded-full h-auto"
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
