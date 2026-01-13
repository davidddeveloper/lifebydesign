"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"

interface BlueprintHeroProps {
  onOpenForm: () => void
}

export function BlueprintHero({ onOpenForm }: BlueprintHeroProps) {
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

  return (
    <section className="relative bg-gradient-to-b from-[#177fc9] to-[#fff] py-20 lg:py-32"> {/** to-[#8dc8f1]  */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/*<motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
              The Scaling Blueprint
            </span>
          </motion.div>*/}

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-black text-white mb-6 text-balance leading-tight"
          >
            Stop Guessing.
            <span className="text-[#fff]"> Start Growing.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-md md:text-lg text-black mb-4 max-w-2xl md:max-w-5xl mx-auto leading-relaxed text-balance"
          >
            Most businesses are stuck because they're fixing the wrong problems. The Scaling Blueprint identifies your ONE constraint—then gives you the exact 90-day plan to eliminate it.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-gray-800 font-semibold mb-8 max-w-2xl mx-auto"
          >
            Average result: 30-50% revenue increase in 90 days
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onOpenForm}
              className="px-6 py-3 bg-[#177fc9] text-white font-bold rounded-full cursor-pointer hover:bg-[#42adff] transition-colors text-lg"
            >
              Register for Next Workshop - $100
            </button>
            <Link
              href="#how-it-works"
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-full hover:bg-gray-900 hover:text-white transition-colors text-lg"
            >
              See How It Works
            </Link>
          </motion.div>

          {/*<motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gray-900">$1.5M+</p>
              <p className="text-gray-600 mt-2">Portfolio Annual Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gray-900">200+</p>
              <p className="text-gray-600 mt-2">Businesses supported</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-black text-gray-900">90 Days</p>
              <p className="text-gray-600 mt-2">To Breakthrough</p>
            </div>
          </motion.div>*/}
        </motion.div>
      </div>
    </section>
  )
}
