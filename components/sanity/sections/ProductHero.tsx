"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { ProductHeroSection } from '@/sanity/lib/types'

interface ProductHeroProps {
  data: ProductHeroSection
  onOpenForm?: () => void
}

export function ProductHeroComponent({ data, onOpenForm }: ProductHeroProps) {
  const { heading, subheading, primaryCta, secondaryCta } = data

  return (
    <section className="relative bg-gradient-to-b from-[#177fc9] to-[#fff] py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {heading && (
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 text-balance leading-tight">
              {heading}
            </h1>
          )}

          {subheading && (
            <p className="text-md md:text-lg text-black mb-8 max-w-2xl md:max-w-5xl mx-auto leading-relaxed text-balance">
              {subheading}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {primaryCta?.text && (
              primaryCta.url ? (
                <Link href={primaryCta.url}>
                  <Button
                    className="px-4 py-2 bg-[#177fc9] text-white font-bold rounded-full cursor-pointer hover:bg-[#42adff] transition-colors text-lg"
                  >
                    {primaryCta.text}
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={onOpenForm}
                  className="px-4 py-2 bg-[#177fc9] text-white font-bold rounded-full cursor-pointer hover:bg-[#42adff] transition-colors text-lg"
                >
                  {primaryCta.text}
                </Button>
              )
            )}

            {secondaryCta?.text && (
              <Link href={secondaryCta.url || "#how-it-works"}>
                <Button
                  className="px-4 py-2 bg-[#177fc9] text-white font-bold rounded-full cursor-pointer hover:bg-[#42adff] transition-colors text-lg"
                >
                  {secondaryCta.text}
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
