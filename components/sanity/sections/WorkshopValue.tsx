"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { WorkshopValueSection } from '@/sanity/lib/types'

interface WorkshopValueProps {
  data: WorkshopValueSection
}

export function WorkshopValueComponent({ data }: WorkshopValueProps) {
  const { introText, animatedReasons, cta } = data
  const [currentReasonIndex, setCurrentReasonIndex] = useState(0)

  useEffect(() => {
    if (!animatedReasons || animatedReasons.length === 0) return

    const interval = setInterval(() => {
      setCurrentReasonIndex((prev) => (prev + 1) % animatedReasons.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [animatedReasons])

  if (!animatedReasons || animatedReasons.length === 0) {
    return null
  }

  return (
    <section className="bg-[#1e293b] py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {introText && (
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            {introText}
          </p>
        )}

        <div className="h-24 md:h-32 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReasonIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-4xl font-black text-[#177fc9]"
            >
              {animatedReasons[currentReasonIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mb-8">
          {animatedReasons.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReasonIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentReasonIndex ? 'bg-[#177fc9]' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {cta?.text && (
          cta.url ? (
            <Link href={cta.url}>
              <Button
                size="default"
                className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
              >
                {cta.text}
              </Button>
            </Link>
          ) : (
            <Button
              size="default"
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
            >
              {cta.text}
            </Button>
          )
        )}
      </div>
    </section>
  )
}
