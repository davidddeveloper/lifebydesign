"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { FinanceHero } from "@/components/kolatbooks-hero"
import { FinanceValueProposition } from "@/components/kolatbooks-value-proposition"
import { FinanceComponents } from "@/components/kolatbooks-components"
import { FinanceWorkflow } from "@/components/kolatbooks-workflow"
import { FinanceFaq } from "@/components/kolatbooks-faq"
import { FinancePricing } from "@/components/kolatbooks-pricing"
import { KolatBooksFormModal } from "@/components/kolat-books-form-modal"
import { SectionRenderer } from "@/components/sanity/SectionRenderer"
import type { KolatBooksPage } from "@/sanity/lib/types"

interface KolatBooksPageClientProps {
  pageData?: KolatBooksPage | null
}

export default function KolatBooksPageClient({ pageData }: KolatBooksPageClientProps) {
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [kolatBooksModalOpen, setKolatBooksModalOpen] = useState(false)

  // If we have Sanity data, use the section renderer
  const hasSanityContent = pageData?.sections && pageData.sections.length > 0
  console.log(pageData)
  console.log(hasSanityContent)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {hasSanityContent ? (
          // Render sections from Sanity
          <SectionRenderer
            sections={pageData.sections!}
            onOpenForm={() => setKolatBooksModalOpen(true)}
            page="kolat"
          />
        ) : (
          // Fallback to hardcoded content
          <>
            <FinanceHero onOpenForm={() => setKolatBooksModalOpen(true)} />
            <FinanceValueProposition />
            <FinanceComponents />
            <FinanceWorkflow />
            <FinancePricing onOpenForm={() => setKolatBooksModalOpen(true)} />
            <FinanceFaq />
          </>
        )}
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
      <KolatBooksFormModal isOpen={kolatBooksModalOpen} onClose={() => setKolatBooksModalOpen(false)} />
    </div>
  )
}
