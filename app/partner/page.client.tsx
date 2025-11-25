"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { PartnerFormModal } from "@/components/partner-form-modal"

export default function PartnerPageClient() {
  const [formModalOpen, setFormModalOpen] = useState(true)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="min-h-[60vh] bg-gradient-to-b from-white to-gray-50 py-20 md:py-32 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Become a <span className="text-[#177fc9]">Portfolio Company</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Join our ecosystem and scale your business with expert support, capital, and proven systems.
          </p>
          <button
            onClick={() => setFormModalOpen(true)}
            className="inline-block bg-[#177fc9] hover:bg-[#42adff] text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Start Your Application
          </button>
        </div>
      </main>
      <Footer />
      <PartnerFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
