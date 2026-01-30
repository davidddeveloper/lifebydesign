"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import type { CareersHeroSection } from "@/sanity/lib/types"

interface CareersHeroProps {
  data?: CareersHeroSection
}

export function CareersHero({ data }: CareersHeroProps) {
  const heading = data?.heading // No logical fallback for heading/subheading in provided code style, usually
    || (
      <>
        Join The <span className="text-[#177fc9]">Startup Bodyshop</span> Team
      </>
    )

  // Handling heading as string or ReactNode is tricky if data is string. 
  // If data.heading exists, it's a string. We might lose the <span> styling unless we use PortableText or regex, 
  // OR we just assume simple text for dynamic. 
  // Let's stick to simple text for Sanity, hardcoded JSX as fallback if no data.

  const headingContent = data?.heading ? data.heading : (
    <>
      Join The <span className="text-[#177fc9]">Startup Bodyshop</span> Team
    </>
  )

  const subheading = data?.subheading || "We're seeking teammates who lead with trust, work with discipline, and play to win as a team."
  const buttonText = data?.buttonText || "View Job Openings"
  const buttonUrl = data?.buttonUrl || "/careers/jobs"
  const imageSrc = data?.image ? urlFor(data.image).url() : "/images/joeabass-hands-on.jpg"

  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 text-balance">
              {headingContent}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
              {subheading}
            </p>
            <Link href={buttonUrl}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg px-12 md:px-24 py-4 rounded-full h-auto"
              >
                {buttonText}
              </motion.button>
            </Link>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full h-96 md:h-full rounded-lg overflow-hidden">
              <img
                src={imageSrc}
                alt={typeof headingContent === 'string' ? headingContent : "Careers Hero"}
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
