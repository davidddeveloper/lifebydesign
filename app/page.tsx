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
      <Header />
      <main>
        <HeroSection onOpenForm={() => setFormModalOpen(true)} />
        <FreeTrainingSection />
      </main>

      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
