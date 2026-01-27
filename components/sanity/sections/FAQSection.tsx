"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { HomeFaqSection, FAQReferenceSection } from '@/sanity/lib/types'

interface FAQSectionProps {
  data: HomeFaqSection | FAQReferenceSection
  onOpenForm?: () => void
}

export function FAQSectionComponent({ data, onOpenForm }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faq = data.faq
  if (!faq || !faq.faqs || faq.faqs.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-8 md:py-16">
      <h2 className="mx-auto text-3xl w-[250px] mb-10 text-center text-gray-900 font-black">
        {faq.title || "FAQs"}
      </h2>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {faq.faqs.map((item, index) => (
            <div key={item._key || index} className="border-none">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-[#1e293b] hover:bg-[#2d3b52] text-white px-6 py-6 rounded-lg flex items-center justify-between transition-colors"
              >
                <span className="text-base md:text-md font-bold text-left">{item.question}</span>
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
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{item.answer}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {onOpenForm && (
          <div className="text-center">
            <Button
              size="default"
              onClick={onOpenForm}
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
            >
              I'M READY TO SCALE
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
