"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface AboutCTAProps {
  onOpenForm: () => void
}

export function AboutCTA({ onOpenForm }: AboutCTAProps) {
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
            READY TO BECOME A PORTFOLIO COMPANY?
          </h2>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let's explore if your business is a fit for Startup Bodyshop Venture Studios. Apply today to connect with our team.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Button
              onClick={onOpenForm}
              className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold py-6 px-16 rounded-full text-lg inline-flex items-center gap-3 transition-colors"
            >
              Apply Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
