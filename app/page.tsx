"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { HeroSection } from "@/components/hero-section"
import { FreeTrainingSection } from "@/components/free-training-section"
import { ScaleFormModal } from "@/components/scale-form-modal"

export default function Home() {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <AnnouncementBanner />
      <Header />
      <main>
        <HeroSection onOpenForm={() => setFormModalOpen(true)} />
        <FreeTrainingSection />
      </main>

      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />

      <button
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors"
        aria-label="Contact"
      >
        CO
      </button>
    </div>
  )
}
