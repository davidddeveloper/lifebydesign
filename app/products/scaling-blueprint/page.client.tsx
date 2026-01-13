"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Footer } from "@/components/Footer"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { BlueprintHero } from "@/components/blueprint-hero"
import { BlueprintTargetSegments } from "@/components/blueprint-target-segments"
import { BlueprintProcess } from "@/components/blueprint-process"
import { Blueprint5Levers } from "@/components/blueprint-5-levers"
import { BlueprintValueLadder } from "@/components/blueprint-value-ladder"
import { BlueprintResults } from "@/components/blueprint-results"
import { BlueprintComparison } from "@/components/blueprint-comparison"
import { BlueprintFAQ } from "@/components/blueprint-faq"
import { BlueprintPromise } from "@/components/blueprint-promise"

export default function ScalingBlueprintPageClient() {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <BlueprintHero onOpenForm={() => setFormModalOpen(true)} />
        <BlueprintTargetSegments />
        <BlueprintProcess />
        <Blueprint5Levers />
        <BlueprintValueLadder onOpenForm={() => setFormModalOpen(true)} />
        <BlueprintResults />
        <BlueprintComparison />
        <BlueprintFAQ />
        <BlueprintPromise />
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}