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
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {heading && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              {heading}
            </h1>
          )}

          {subheading && (
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {subheading}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {primaryCta?.text && (
              primaryCta.url ? (
                <Link href={primaryCta.url}>
                  <Button
                    size="default"
                    className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 py-4 rounded-full h-auto"
                  >
                    {primaryCta.text}
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={onOpenForm}
                  size="default"
                  className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 py-4 rounded-full h-auto"
                >
                  {primaryCta.text}
                </Button>
              )
            )}

            {secondaryCta?.text && secondaryCta.url && (
              <Link href={secondaryCta.url}>
                <Button
                  variant="outline"
                  size="default"
                  className="border-[#177fc9] text-[#177fc9] hover:bg-[#177fc9] hover:text-white font-bold text-lg px-12 py-4 rounded-full h-auto"
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
