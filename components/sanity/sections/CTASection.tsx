"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { CTASection } from '@/sanity/lib/types'

interface CTASectionProps {
  data: CTASection
  onOpenForm?: () => void
}

export function CTASectionComponent({ data, onOpenForm }: CTASectionProps) {
  const { heading, text, buttonText, buttonUrl } = data

  return (
    <section className="bg-[#1e293b] py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            {heading}
          </h2>
        )}
        {text && (
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {text}
          </p>
        )}
        {buttonText && (
          buttonUrl ? (
            <Link href={buttonUrl}>
              <Button
                size="default"
                className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
              >
                {buttonText}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onOpenForm}
              size="default"
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
            >
              {buttonText}
            </Button>
          )
        )}
      </div>
    </section>
  )
}
