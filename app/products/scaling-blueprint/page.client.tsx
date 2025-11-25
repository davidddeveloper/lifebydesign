"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Footer } from "@/components/Footer"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { BlueprintHero } from "@/components/blueprint-hero"
import { BlueprintProcess } from "@/components/blueprint-process"
import { BlueprintTargetSegments } from "@/components/blueprint-target-segments"
import { BlueprintValueLadder } from "@/components/blueprint-value-ladder"
import { BlueprintFAQ } from "@/components/blueprint-faq"
import { BlueprintPromise } from "@/components/blueprint-promise"

export default function ScalingBlueprintPageClient() {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <BlueprintHero onOpenForm={() => setFormModalOpen(true)} />
        <BlueprintProcess />
        <BlueprintTargetSegments />
        <BlueprintValueLadder onOpenForm={() => setFormModalOpen(true)} />
        <BlueprintPromise />
        <BlueprintFAQ />
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}