"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FinanceHero } from "@/components/kolatbooks-hero"
import { FinanceValueProposition } from "@/components/kolatbooks-value-proposition"
import { FinanceComponents } from "@/components/kolatbooks-components"
import { FinanceWorkflow } from "@/components/kolatbooks-workflow"
import { FinanceFaq } from "@/components/kolatbooks-faq"
import { FinancePricing } from "@/components/kolatbooks-pricing"
import { KolatBooksFormModal } from "@/components/kolat-books-form-modal"
import type { KolatBooksPageData } from "@/payload/lib/types"

interface KolatBooksPageClientProps {
  pageData?: KolatBooksPageData | null
}

export default function KolatBooksPageClient({ pageData }: KolatBooksPageClientProps) {
  const [kolatBooksModalOpen, setKolatBooksModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <FinanceHero data={pageData?.hero} onOpenForm={() => setKolatBooksModalOpen(true)} />
        <FinanceValueProposition data={pageData?.promise} />
        <FinanceComponents data={pageData?.deliverables} />
        <FinanceWorkflow data={pageData?.workflowPhases} />
        <FinancePricing data={pageData?.pricingPlans} onOpenForm={() => setKolatBooksModalOpen(true)} />
        <FinanceFaq data={pageData?.faq} />
      </main>
      <Footer />
      <KolatBooksFormModal isOpen={kolatBooksModalOpen} onClose={() => setKolatBooksModalOpen(false)} />
    </div>
  )
}
