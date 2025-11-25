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

export default function KolatBooksPageClient() {
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [kolatBooksModalOpen, setKolatBooksModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <FinanceHero onOpenForm={() => setKolatBooksModalOpen(true)} />
        <FinanceValueProposition />
        <FinanceComponents />
        <FinanceWorkflow />
        <FinancePricing onOpenForm={() => setKolatBooksModalOpen(true)} />
        <FinanceFaq />
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
      <KolatBooksFormModal isOpen={kolatBooksModalOpen} onClose={() => setKolatBooksModalOpen(false)} />
    </div>
  )
}