"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  //const [coursesOpen, setCoursesOpen] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false)
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [mobileProductOpen, setMobileProductOpen] = useState(false)
  return (
    <footer className="bg-[#177fc9] text-white py-12">
      {/*<div className="container mx-auto px-4 pt-10 pb-5">*/}
        {/* Main Footer Content */}
        {/*<div className="max-w-5xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">*/}
            {/* Navigation */}
            {/*<div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/workshops" className="block hover:opacity-80 transition-opacity">
                  Workshops
                </Link>
                <Link href="/partner" className="block hover:opacity-80 transition-opacity">
                  Partner With Us
                </Link>
                <Link href="/about" className="block hover:opacity-80 transition-opacity">
                  About the Firm
                </Link>
                <Link href="/careers" className="block hover:opacity-80 transition-opacity">
                  Careers
                </Link>
              </div>
            </div>*/}

            {/* Resources */}
            {/*<div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <div className="space-y-2">
                <Link href="https://www.youtube.com/@JABShow" className="block hover:opacity-80 transition-opacity">
                  YouTube
                </Link>
                <Link href="/media/blog" className="block hover:opacity-80 transition-opacity">
                  Blog
                </Link>
              </div>
            </div>
          </div>*/}

          {/* Divider */}
          {/*<div className="border-t border-white/20 pt-8">*/}
            {/* Legal Links */}
            {/*<div className="flex flex-col md:flex-row justify-center gap-4 mb-8 text-sm">
              <Link href="/terms" className="hover:opacity-80 transition-opacity">
                Terms
              </Link>
              <span className="hidden md:inline">•</span>
              <Link href="/privacy" className="hover:opacity-80 transition-opacity">
                Do Not Sell My Info
              </Link>
            </div>*/}

            {/* Disclaimer Text */}
            {/*<p className="text-sm leading-relaxed text-white/90 max-w-4xl mx-auto">
              Alex and Leila Hormozi's results are not typical and are not a guarantee of your success. Alex and Leila
              are experienced business owners and investors, and your results will vary depending on education, effort,
              application, experience, and background. Alex and Leila do not personally invest in every business they
              work with through Acquisition.com, LLC. Due to the sensitivity of financial information, we do not know or
              track the typical results of our students. We cannot guarantee that you will make more money or that you
              will be successful if you employ their business strategies specifically or generally. Consequently, your
              results may significantly vary from theirs. We do not give investment, tax, or other professional advice.
              Specific transactions and experiences are mentioned for informational purposes only. The information
              contained within this website is the property of Acquisition.com, LLC. Any use of the images, content, or
              ideas expressed herein without the express written consent of Acquisition.com, LLC, is prohibited.
              Copyright © 2025 Acquisition.com, LLC. All Rights Reserved
            </p>*/}

            {/* Copyright */}
            {/*<p className="text-xs text-white/70 text-center mt-6">© {new Date().getFullYear()} Life By Design. All rights reserved.</p>
          </div>
        </div>
      </div>*/}

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-32 md:h-20" title="Life By Design | Home">
          {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {/*<svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5L5 15L10 25L20 20L30 25L35 15L20 5Z" fill="white" />
                <path d="M10 25L15 35L20 32.5L25 35L30 25L20 30L10 25Z" fill="white" />
              </svg>*/}
              <Image src={"/images/startupbodyshopwhite.png"} alt="Life By Design" width={120} height={120}></Image>
              {/*<span className="text-xl font-bold">
                LBD<span className="text-white">.GROUP</span>
              </span>*/}
            </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-6 xl:gap-8 flex-wrap justify-center flex-1 mx-4 text-white">
            <Link href="/workshops" className="hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Workshops
            </Link>
            {/*<div
              className="relative"
              onMouseEnter={() => setCoursesOpen(true)}
              onMouseLeave={() => setCoursesOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
                Courses
                <ChevronDown className="h-4 w-4" />
              </button>
              {coursesOpen && (
                <div className="absolute top-full left-0 w-56 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/courses/scaling"
                    className="block px-4 py-2 hover:bg-gray-100 text-purple-600 font-medium"
                  >
                    Scaling Course
                  </Link>
                  <Link href="/courses/offers" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Offers Course
                  </Link>
                  <Link href="/courses/leads" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Leads Course
                  </Link>
                  <Link href="/courses/money-models" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Money Models Course
                  </Link>
                </div>
              )}
            </div>*/}
            {/* <Link href="/books" className="hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Books
            </Link> */}
            <div className="relative" onMouseEnter={() => setProductOpen(true)} onMouseLeave={() => setProductOpen(false)}>
              <button className="flex items-center gap-1 hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
                Products
                <ChevronDown className="h-4 w-4" />
              </button>
              {productOpen && (
                <div className="absolute top-full left-0 w-56 bg-white text-black rounded-lg shadow-lg py-2 z-50">
                  {/*<Link href="/media/podcast" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Podcast
                  </Link>*/}
                  <Link href="/products/scaling-blueprint" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Scaling Blueprint
                  </Link>
                  <Link href="/products/kolat-books" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Kolat Books™
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
                  {/*<Link href="/media/podcast" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Podcast
                  </Link>*/}
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
            {/*<Link href="/ventures" className="hover:text-gray-300 transition-colors text-sm whitespace-nowrap">
              Ventures
            </Link>*/}
          </nav>
        </div>
              
      </div>

      <div className="container mx-auto flex mt-4 items-center justify-center gap-4">
        <Link href="/terms" className="text-sm">Terms</Link>
        <div className="text-5xl -mt-7">.</div>
        <Link href="/privacy" className="text-sm">Do not sell my stuff</Link>
      </div>

      <p className="text-xs text-white/70 text-center mt-6">© {new Date().getFullYear()} Life By Design. All rights reserved.</p>
    </footer>
  )
}
