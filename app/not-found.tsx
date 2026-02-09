"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { Footer } from "@/components/Footer"

export default function NotFound() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="text-center max-w-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 Number */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="text-8xl md:text-9xl font-black text-[#177fc9]">404</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
          >
            Page Not Found
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-gray-600 mb-8 leading-relaxed"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-[#177fc9] text-white font-semibold rounded-lg hover:bg-[#1269a8] transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/constraint-audit"
              className="px-6 py-3 bg-white text-[#177fc9] font-semibold rounded-lg border-2 border-[#177fc9] hover:bg-blue-50 transition-colors"
            >
              Take Free Audit
            </Link>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
