"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const [mediaOpen, setMediaOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)

  return (
    <footer className="bg-[#177fc9] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-32 md:h-20" title="Startup Bodyshop | Home">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/startupbodyshopwhite.png" alt="Startup Bodyshop" width={120} height={120} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-6 xl:gap-8 flex-wrap justify-center flex-1 mx-4 text-white">
            <Link href="/workshops" className="hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Workshops
            </Link>

            <div className="relative" onMouseEnter={() => setProductOpen(true)} onMouseLeave={() => setProductOpen(false)}>
              <button className="flex items-center gap-1 hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
                Products
                <ChevronDown className="h-4 w-4" />
              </button>
              {productOpen && (
                <div className="absolute top-full left-0 w-56 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                  <Link href="/products/scaling-blueprint" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Scaling Blueprint
                  </Link>
                  <Link href="/products/kolat-books" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Kolat Books™
                  </Link>
                  <Link href="/constraint-audit" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Constraint Audit
                  </Link>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => setMediaOpen(true)} onMouseLeave={() => setMediaOpen(false)}>
              <button className="flex items-center gap-1 hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
                Media
                <ChevronDown className="h-4 w-4" />
              </button>
              {mediaOpen && (
                <div className="absolute top-full left-0 w-56 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                  <Link href="https://www.youtube.com/@JABShow" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    YouTube
                  </Link>
                  <Link href="/media/blog" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Blog
                  </Link>
                </div>
              )}
            </div>

            <Link href="/partner" className="hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Partner With Us
            </Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              About the Firm
            </Link>
            <Link href="/careers" className="hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Careers
            </Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto flex mt-4 items-center justify-center gap-4">
        <Link href="/terms" className="text-sm hover:text-gray-300 transition-colors">
          Terms
        </Link>
        <span className="text-white/50">•</span>
        <Link href="/privacy" className="text-sm hover:text-gray-300 transition-colors">
          Privacy
        </Link>
      </div>

      <p className="text-xs text-white/70 text-center mt-6">
        © {new Date().getFullYear()} Startup Bodyshop. All rights reserved.
      </p>
    </footer>
  )
}
