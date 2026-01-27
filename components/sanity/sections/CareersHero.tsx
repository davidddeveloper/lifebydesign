"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { urlFor } from '@/sanity/lib/image'
import type { CareersHeroSection } from '@/sanity/lib/types'

interface CareersHeroProps {
  data: CareersHeroSection
}

export function CareersHeroComponent({ data }: CareersHeroProps) {
  const { heading, subheading, image, buttonText, buttonUrl } = data

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

          {buttonText && buttonUrl && (
            <div className="pt-4">
              <Link href={buttonUrl}>
                <Button
                  size="default"
                  className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 py-4 rounded-full h-auto"
                >
                  {buttonText}
                </Button>
              </Link>
            </div>
          )}

          {image && (
            <div className="pt-8">
              <img
                src={urlFor(image).width(800).url()}
                alt={heading || "Careers"}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
