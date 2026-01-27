"use client"

import { Button } from "@/components/ui/button"
import { urlFor } from '@/sanity/lib/image'
import type { HeroSection } from '@/sanity/lib/types'

interface HeroSectionProps {
  data: HeroSection
  onOpenForm?: () => void
}

export function HeroSectionComponent({ data, onOpenForm }: HeroSectionProps) {
  const { heading, subheading, image, primaryCta } = data

  return (
    <section className="bg-gray-100 py-24 md:py-16 lg:py-16 relative overflow-hidden">
      <div className="container mx-auto pt-10 z-10">
        <div className="items-center gap-8 grid lg:grid-cols-[220px_1fr_0px]">
          {/* Left Person Image */}
          {image && (
            <div className="hidden mt-20 absolute bottom-0 lg:block">
              <img
                src={urlFor(image).url()}
                alt="Team member"
                className="w-[38%] h-auto object-cover"
              />
            </div>
          )}
          <div className="hidden lg:block"></div>

          {/* Center Content */}
          <div className="text-center max-w-5xl md:pr-2 md:min-w-[650px] lg:max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-5xl font-black text-gray-900 mb-6 leading-tight text-balance">
              {heading || "ARE YOU READY TO SCALE YOUR BUSINESS?"}
            </h1>
            {subheading && (
              <p className="text-lg md:text-xl lg:text-[17px] xl:text-xl text-gray-700 mb-8 leading-relaxed">
                {subheading}
              </p>
            )}
            {primaryCta?.text && (
              <Button
                onClick={onOpenForm}
                size="default"
                className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
              >
                {primaryCta.text}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Images */}
      </div>
      {image && (
        <div className="lg:hidden z-0 max-w-[300px] mx-auto gap-4 mt-8 flex justify-center">
          <img
            src={urlFor(image).url()}
            alt="Team member"
            className="w-[80%] h-auto object-top object-cover rounded-lg"
          />
        </div>
      )}
    </section>
  )
}
