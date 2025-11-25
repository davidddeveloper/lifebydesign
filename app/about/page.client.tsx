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


export default function AboutPageClient() {
  const [formModalOpen, setFormModalOpen] = useState(false)
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AboutHero />
        <LBDMission />
        <LBDCoreValues />
        <LBDServices />
        <LBDImpact />
        <AboutCTA onOpenForm={() => setFormModalOpen(true)} />
      </main>
      <Footer />
    </div>
  )
}