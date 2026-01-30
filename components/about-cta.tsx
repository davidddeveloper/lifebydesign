"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import type { CTASection } from "@/sanity/lib/types"

interface AboutCTAProps {
  data?: CTASection
  onOpenForm: () => void
}

export function AboutCTA({ data, onOpenForm }: AboutCTAProps) {
  const heading = data?.heading || "READY TO BECOME A PORTFOLIO COMPANY?"
  const description = data?.text || "Let's explore if your business is a fit for Startup Bodyshop Venture Studios. Apply today to connect with our team."
  const buttonText = data?.buttonText || "Apply Now"
  // buttonUrl logic: if data provides url, link there (but design uses modal form primarily or partner link).
  // Current component hardcodes Link href="/partner".
  // Let's defer to buttonUrl if present, OR default to /partner.
  const buttonUrl = data?.buttonUrl || "/partner"

  return (
    <section className="bg-gray-900 text-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight uppercase">
            {heading}
          </h2>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Link href={buttonUrl}>
              <Button
                onClick={onOpenForm}
                className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold py-6 px-16 rounded-full text-lg inline-flex items-center gap-3 transition-colors"
              >
                {buttonText}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
