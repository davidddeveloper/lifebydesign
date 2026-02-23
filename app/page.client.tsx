"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/hero-section"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { WorkshopFaq } from "@/components/workshop-faq"
import { FoundersSection } from "@/components/founders-section"
import { PartnersSection } from "@/components/partners-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/Footer"
import type { HomePageData } from "@/payload/lib/types"

interface HomeClientProps {
  pageData?: HomePageData | null
}

export default function HomeClient({ pageData }: HomeClientProps) {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection data={pageData?.hero} onOpenForm={() => setFormModalOpen(true)} />
        <WorkshopFaq data={pageData?.faq} onOpenForm={() => setFormModalOpen(true)} />
        <FoundersSection data={pageData?.founder} />
        <PartnersSection data={pageData?.partners} />
        {pageData?.cta?.heading && (
          <CTASection data={pageData.cta} onOpenForm={() => setFormModalOpen(true)} />
        )}
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
