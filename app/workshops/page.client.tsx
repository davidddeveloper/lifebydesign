"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { WorkshopRegistrationModal } from "@/components/workshop-registration-modal"
import { WorkshopHero } from "@/components/workshop-hero"
import { WorkshopBenefits } from "@/components/workshop-benefits"
import { WorkshopValue } from "@/components/workshop-value"
import { WorkshopFaq } from "@/components/workshop-faq"
import { SectionRenderer } from "@/components/sanity/SectionRenderer"
import type { WorkshopsPage } from "@/sanity/lib/types"

interface WorkshopPageClientProps {
    pageData?: WorkshopsPage | null
}

export default function WorkshopPageClient({ pageData }: WorkshopPageClientProps) {
    const [formModalOpen, setFormModalOpen] = useState(false)
    const [resumeId, setResumeId] = useState<string | null>(null)
    const [paymentResult, setPaymentResult] = useState<{
        status: "success" | "cancelled"
        registrationId?: string
    } | undefined>(undefined)

    const searchParams = useSearchParams()

    useEffect(() => {
        const payment = searchParams.get("payment")
        const registrationId = searchParams.get("registration")
        const resume = searchParams.get("resume_registration")

        if (payment === "success") {
            try { localStorage.removeItem("sbs_workshop_registration_progress") } catch { }
            setPaymentResult({ status: "success", registrationId: registrationId || undefined })
            setFormModalOpen(true)
        } else if (payment === "cancelled") {
            setPaymentResult({ status: "cancelled", registrationId: registrationId || undefined })
            setFormModalOpen(true)
        }

        if (resume) {
            setResumeId(resume)
            setFormModalOpen(true)
        }
    }, [searchParams])

    function handleRetry() {
        // Keep modal open, clear paymentResult, and pre-fill with saved registration
        const regId = paymentResult?.registrationId || null
        setPaymentResult(undefined)
        setResumeId(regId)
    }

    function handleModalClose() {
        setFormModalOpen(false)
        setPaymentResult(undefined)
    }

    const hasSanityContent = pageData?.sections && pageData.sections.length > 0

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                {hasSanityContent ? (
                    <SectionRenderer
                        sections={pageData.sections!}
                        onOpenForm={() => setFormModalOpen(true)}
                        page="workshop"
                    />
                ) : (
                    <>
                        <WorkshopHero />
                        <WorkshopBenefits />
                        <WorkshopValue />
                        <WorkshopFaq />
                    </>
                )}
            </main>
            <Footer />
            <WorkshopRegistrationModal
                isOpen={formModalOpen}
                onClose={handleModalClose}
                workshopTitle="Business Constraint-Breaking Workshop"
                workshopPrice={100}
                resumeId={resumeId}
                paymentResult={paymentResult}
                onRetry={handleRetry}
            />
        </div>
    )
}
