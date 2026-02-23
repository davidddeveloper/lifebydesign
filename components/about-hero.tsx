"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

import type { AboutPageHero } from "@/payload/lib/types"

interface AboutHeroProps {
  data?: AboutPageHero
}

export function AboutHero({ data }: AboutHeroProps) {
  const subheading = data?.subheading || "Crafting Success, Empowering Dreams. Sierra Leone's leading entrepreneurship support organization dedicated to empowering MSMEs to start, grow, and scale sustainable businesses."

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
            {(data?.heading || "Life By Design Startup Bodyshop").split(/(Startup Bodyshop)/g).map((part, i) =>
              part === "Startup Bodyshop" ? (
                <span key={i} className="text-[#177fc9]">
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {subheading}
          </p>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="pt-8 flex justify-center"
          >
            <Link href="#our-story">
              <ChevronDown className="h-6 w-6 mx-auto text-[#177fc9]" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
