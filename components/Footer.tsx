"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#177fc9] text-white">
      <div className="container mx-auto px-4 pt-10 pb-5">
        {/* Main Footer Content */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Navigation */}
            <div>
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
            </div>

            {/* Resources */}
            <div>
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
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-8">
            {/* Legal Links */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 text-sm">
              <Link href="/terms" className="hover:opacity-80 transition-opacity">
                Terms
              </Link>
              <span className="hidden md:inline">•</span>
              <Link href="/privacy" className="hover:opacity-80 transition-opacity">
                Do Not Sell My Info
              </Link>
            </div>

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
            <p className="text-xs text-white/70 text-center mt-6">© {new Date().getFullYear()} Life By Design. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
