"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false)
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false)
  const [mobileProductOpen, setMobileProductOpen] = useState(false)

  return (
    <header className="bg-[#177fc9] text-white sticky top-0 z-40">
      {" "}
      {/** bg-[#74c0fc] #177fc9 bg-[#177fc9]*/}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16 md:h-20" title="Life By Design | Home">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src={"/images/startupbodyshopwhite.png"} alt="Life By Design" width={120} height={120}></Image>
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
            <div
              className="relative"
              onMouseEnter={() => setProductOpen(true)}
              onMouseLeave={() => setProductOpen(false)}
            >
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
                  <Link href="/products/finance-freedom" className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Finance Freedom System™
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-white md:h-6 md:w-6" />
            ) : (
              <Menu className="h-5 w-5 text-white md:h-6 md:w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-white bg-[#177fc9] text-white"
            >
              <nav className="py-4">
                <div className="flex flex-col gap-4">
                  {/* Menu Items */}
                  <Link href="/workshops" className="py-2 hover:text-gray-300 transition-colors text-sm">
                    Workshops
                  </Link>

                  {/* Products submenu */}
                  <div>
                    <button
                      className="flex items-center justify-between py-2 hover:text-gray-300 transition-colors text-left w-full text-sm"
                      onClick={() => setMobileProductOpen(!mobileProductOpen)}
                    >
                      Products
                      <motion.div animate={{ rotate: mobileProductOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {mobileProductOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="pl-4 overflow-hidden flex flex-col gap-2 mt-2"
                        >
                          <Link
                            href="/products/scaling-blueprint"
                            className="py-2 hover:text-gray-300 transition-colors text-sm"
                          >
                            Scaling Blueprint
                          </Link>
                          <Link
                            href="/products/finance-freedom"
                            className="py-2 hover:text-gray-300 transition-colors text-sm"
                          >
                            Finance Freedom System™
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Media submenu */}
                  <div>
                    <button
                      className="flex items-center justify-between py-2 hover:text-gray-300 transition-colors text-left w-full text-sm"
                      onClick={() => setMobileMediaOpen(!mobileMediaOpen)}
                    >
                      Media
                      <motion.div animate={{ rotate: mobileMediaOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {mobileMediaOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="pl-4 overflow-hidden flex flex-col gap-2 mt-2"
                        >
                          <Link href="/media/podcast" className="py-2 hover:text-gray-300 transition-colors text-sm">
                            Podcast
                          </Link>
                          <Link href="/media/youtube" className="py-2 hover:text-gray-300 transition-colors text-sm">
                            YouTube
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link href="/partner" className="py-2 hover:text-gray-300 transition-colors text-sm">
                    Partner With Us
                  </Link>
                  <Link href="/about" className="py-2 hover:text-gray-300 transition-colors text-sm">
                    About the Firm
                  </Link>
                  <Link href="/careers" className="py-2 hover:text-gray-300 transition-colors text-sm">
                    Careers
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
