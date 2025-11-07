"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  //const [coursesOpen, setCoursesOpen] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false)
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false)

  return (
    <header className="bg-[#177fc9] text-white sticky top-0 z-40"> {/** bg-[#74c0fc] #177fc9 bg-[#177fc9]*/}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16 md:h-20" title="Life By Design | Home">
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
          <nav className="hidden lg:flex items-end gap-6 xl:gap-8 flex-wrap justify-end flex-1 mx-4 text-white">
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-white md:h-6 md:w-6" /> : <Menu className="h-5 w-5 text-white md:h-6 md:w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white bg-[#177fc9] text-white">
            <div className="flex flex-col gap-4">
              <Link
                href="/workshops"
                className="py-2 hover:text-gray-300 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Workshops
              </Link>
              <div>
                <button
                  className="flex items-center justify-between py-2 hover:text-gray-300 transition-colors text-left w-full text-sm"
                  onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                >
                  Courses
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileCoursesOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileCoursesOpen && (
                  <div className="pl-4 flex flex-col gap-2 mt-2">
                    <Link
                      href="/courses/scaling"
                      className="py-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Scaling Course
                    </Link>
                    <Link
                      href="/courses/offers"
                      className="py-2 hover:text-gray-300 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Offers Course
                    </Link>
                    <Link
                      href="/courses/leads"
                      className="py-2 hover:text-gray-300 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Leads Course
                    </Link>
                    <Link
                      href="/courses/money-models"
                      className="py-2 hover:text-gray-300 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Money Models Course
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/books"
                className="py-2 hover:text-gray-300 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Books
              </Link>
              <div>
                <button
                  className="flex items-center justify-between py-2 hover:text-gray-300 transition-colors text-left w-full text-sm"
                  onClick={() => setMobileMediaOpen(!mobileMediaOpen)}
                >
                  Media
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileMediaOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileMediaOpen && (
                  <div className="pl-4 flex flex-col gap-2 mt-2">
                    <Link
                      href="/media/podcast"
                      className="py-2 hover:text-gray-300 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Podcast
                    </Link>
                    <Link
                      href="/media/youtube"
                      className="py-2 hover:text-gray-300 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      YouTube
                    </Link>
                    <Link
                      href="/media/blog"
                      className="py-2 hover:text-gray-300 transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/partner"
                className="py-2 hover:text-gray-300 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Partner With Us
              </Link>
              <Link
                href="/about"
                className="py-2 hover:text-gray-300 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                About the Firm
              </Link>
              <Link
                href="/careers"
                className="py-2 hover:text-gray-300 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
              </Link>
              <Link
                href="/ventures"
                className="py-2 hover:text-gray-300 transition-colors text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ventures
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
