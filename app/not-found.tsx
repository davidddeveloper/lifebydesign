// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <motion.div className="text-center max-w-2xl" variants={containerVariants} initial="hidden" animate="visible">
        {/* Animated SVG */}
        <motion.div className="mb-8 flex justify-center" variants={itemVariants}>
          <motion.svg
            className="w-32 h-32 md:w-48 md:h-48"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={floatingVariants}
          >
            {/* Background circle */}
            <circle cx="100" cy="100" r="95" fill="rgba(124, 58, 237, 0.1)" />
            <circle cx="100" cy="100" r="95" stroke="url(#gradient)" strokeWidth="2" />

            {/* Construction cone */}
            <g transform="translate(100, 60)">
              {/* Cone body */}
              <path d="M -20 30 L 0 0 L 20 30 Z" fill="#7c3aed" stroke="#7c3aed" strokeWidth="2" />
              {/* Cone stripes */}
              <line x1="-15" y1="10" x2="15" y2="10" stroke="white" strokeWidth="2" />
              <line x1="-10" y1="20" x2="10" y2="20" stroke="white" strokeWidth="2" />
            </g>

            {/* Wrench */}
            <g transform="translate(60, 130)">
              <rect x="0" y="5" width="12" height="4" rx="2" fill="#7c3aed" />
              <circle cx="6" cy="7" r="6" fill="none" stroke="#7c3aed" strokeWidth="2" />
              <path d="M 12 7 L 20 15" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Hammer */}
            <g transform="translate(130, 130)">
              <rect x="0" y="0" width="4" height="16" rx="2" fill="#7c3aed" />
              <rect x="-6" y="0" width="16" height="6" rx="2" fill="#7c3aed" />
            </g>

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </motion.svg>
        </motion.div>

        {/* 404 Text */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-2">404</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto rounded-full" />
        </motion.div>

        {/* Heading */}
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
          Page Coming Soon
        </motion.h2>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          We're currently building something amazing here. This page is under development and will be ready to scale
          soon.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="inline-block px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </motion.div>

        {/* Status indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 font-medium">Scheduled for Q1 2025</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
