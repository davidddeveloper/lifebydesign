"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { AboutHero } from "@/components/about-hero"
import { LBDMission } from "@/components/lbd-mission"
import { LBDCoreValues } from "@/components/lbd-core-values"
import { LBDServices } from "@/components/lbd-services"
import { LBDImpact } from "@/components/lbd-impact"
import { AboutCTA } from "@/components/about-cta"
import { ScaleFormModal } from "@/components/scale-form-modal"
import type { AboutPageData } from "@/payload/lib/types"

interface AboutPageClientProps {
  pageData?: AboutPageData | null
}

export default function AboutPageClient({ pageData }: AboutPageClientProps) {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AboutHero data={pageData?.hero} />
        <LBDMission data={pageData?.missionVision} />
        <LBDCoreValues data={pageData?.coreValues} />
        <LBDServices data={pageData?.services} />
        <LBDImpact data={pageData?.impactStats} />
        <AboutCTA data={pageData?.cta} onOpenForm={() => setFormModalOpen(true)} />
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
