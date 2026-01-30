"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import type { ProductHeroSection } from "@/sanity/lib/types"

interface BlueprintHeroProps {
  data?: ProductHeroSection
  onOpenForm: () => void
}

export function BlueprintHero({ data, onOpenForm }: BlueprintHeroProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const heading = data?.heading // Sanity heading, could include span logic if handled, but text simple for now.
    || (
      <>
        Stop Guessing.
        <span className="text-[#fff]"> Start Growing.</span>
      </>
    )

  const headingContent = data?.heading ? (
    <span className="text-white">{data.heading}</span>
  ) : (
    <>
      Stop Guessing.
      <span className="text-[#fff]"> Start Growing.</span>
    </>
  )

  const subheading = data?.subheading || "Most businesses are stuck because they're fixing the wrong problems. The Scaling Blueprint identifies your ONE constraint—then gives you the exact 90-day plan to eliminate it."

  const primaryCtaText = data?.primaryCta?.text || "Get Started"
  // primaryCta?.url handling might need logic if it's a modal trigger vs link.
  // The original component uses onOpenForm for "Get Started".
  // If data.primaryCta.url is empty or "#", we might assume modal?
  // Or we just map text and keep onOpenForm.

  const secondaryCtaText = data?.secondaryCta?.text || "Learn More"
  const secondaryCtaUrl = data?.secondaryCta?.url || "#how-it-works"

  return (
    <section className="relative bg-gradient-to-b from-[#177fc9] to-[#fff] py-20 lg:py-32"> {/** to-[#8dc8f1]  */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-black text-white mb-6 text-balance leading-tight"
          >
            {headingContent}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-md md:text-lg text-black mb-8 max-w-2xl md:max-w-5xl mx-auto leading-relaxed text-balance"
          >
            {subheading}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onOpenForm}
              className="px-4 py-2 bg-[#177fc9] text-white font-bold rounded-full cursor-pointer hover:bg-[#42adff] transition-colors text-lg"
            >
              {primaryCtaText}
            </button>
            <Link
              href={secondaryCtaUrl}
              className="px-4 py-2 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-colors text-lg"
            >
              {secondaryCtaText}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
