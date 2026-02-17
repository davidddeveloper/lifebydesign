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
    const [paymentStatus, setPaymentStatus] = useState<"success" | "cancelled" | null>(null)
    const searchParams = useSearchParams()

    const [resumeId, setResumeId] = useState<string | null>(null)

    useEffect(() => {
        const payment = searchParams.get("payment")
        const resume = searchParams.get("resume_registration")

        if (payment === "success") {
            setPaymentStatus("success")
            // Clear saved registration progress
            try { localStorage.removeItem("sbs_workshop_registration_progress") } catch { }
        } else if (payment === "cancelled") {
            setPaymentStatus("cancelled")
        }

        if (resume) {
            setResumeId(resume)
            setFormModalOpen(true)
        }
    }, [searchParams])

    // If we have Sanity data, use the section renderer
    const hasSanityContent = pageData?.sections && pageData.sections.length > 0

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                {paymentStatus === "success" && (
                    <div className="bg-green-50 border-b border-green-200 px-4 py-6 text-center">
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h3>
                            <p className="text-green-700">Your workshop registration is confirmed. We&apos;ve sent a confirmation email with all the details.</p>
                            <button onClick={() => setPaymentStatus(null)} className="mt-3 text-sm text-green-600 underline hover:text-green-800">Dismiss</button>
                        </div>
                    </div>
                )}
                {paymentStatus === "cancelled" && (
                    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-6 text-center">
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-yellow-800 mb-2">Payment Cancelled</h3>
                            <p className="text-yellow-700">Your registration is saved. You can complete payment anytime by registering again.</p>
                            <button onClick={() => setPaymentStatus(null)} className="mt-3 text-sm text-yellow-600 underline hover:text-yellow-800">Dismiss</button>
                        </div>
                    </div>
                )}
                {hasSanityContent ? (
                    // Render sections from Sanity
                    <SectionRenderer
                        sections={pageData.sections!}
                        onOpenForm={() => setFormModalOpen(true)}
                        page="workshop"
                    />
                ) : (
                    // Fallback to hardcoded content
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
                onClose={() => setFormModalOpen(false)}
                workshopTitle="Business Constraint-Breaking Workshop"
                workshopPrice={100}
                resumeId={resumeId}
            />
        </div>
    )
}
