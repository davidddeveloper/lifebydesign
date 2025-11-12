"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Footer } from "@/components/Footer"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { FinanceHero } from "@/components/finance-hero"
import { FinanceValueProposition } from "@/components/finance-value-proposition"
import { FinanceComponents } from "@/components/finance-components"
import { FinanceWorkflow } from "@/components/finance-workflow"
import { FinancePricing } from "@/components/finance-pricing"
import { FinanceFaq } from "@/components/finance-faq"

export default function FinanceFreedomPage() {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <FinanceHero onOpenForm={() => setFormModalOpen(true)} />
        <FinanceValueProposition />
        <FinanceComponents />
        <FinanceWorkflow />
        {/*<FinancePricing onOpenForm={() => setFormModalOpen(true)} />*/}
        <FinanceFaq />
      </main>
      <Footer />
      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}