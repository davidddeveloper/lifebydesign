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
import { CheckCircle, XCircle, X, RefreshCw } from "lucide-react"

interface WorkshopPageClientProps {
    pageData?: WorkshopsPage | null
}

interface RegistrationData {
    registration_id: string
    full_name: string | null
    first_name: string | null
    last_name: string | null
    personal_email: string | null
    business_email: string | null
    business_name: string | null
    workshop_title: string | null
    workshop_price: number | null
    payment_completed_at: string | null
}

export default function WorkshopPageClient({ pageData }: WorkshopPageClientProps) {
    const [formModalOpen, setFormModalOpen] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<"success" | "cancelled" | null>(null)
    const [regData, setRegData] = useState<RegistrationData | null>(null)
    const [regLoading, setRegLoading] = useState(false)
    const searchParams = useSearchParams()

    const [resumeId, setResumeId] = useState<string | null>(null)
    const [cancelResumeId, setCancelResumeId] = useState<string | null>(null)

    useEffect(() => {
        const payment = searchParams.get("payment")
        const resume = searchParams.get("resume_registration")
        const registrationId = searchParams.get("registration")

        if (payment === "success") {
            setPaymentStatus("success")
            try { localStorage.removeItem("sbs_workshop_registration_progress") } catch { }

            if (registrationId) {
                setRegLoading(true)
                fetch(`/api/workshop-registration?id=${registrationId}`)
                    .then(r => r.json())
                    .then(data => {
                        if (data.success && data.registration) setRegData(data.registration)
                    })
                    .catch(() => { })
                    .finally(() => setRegLoading(false))
            }
        } else if (payment === "cancelled") {
            setPaymentStatus("cancelled")
            if (registrationId) setCancelResumeId(registrationId)
        }

        if (resume) {
            setResumeId(resume)
            setFormModalOpen(true)
        }
    }, [searchParams])

    const hasSanityContent = pageData?.sections && pageData.sections.length > 0

    function displayName(r: RegistrationData) {
        return r.full_name || `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—"
    }

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                {/* ── Payment Success Overlay ── */}
                {paymentStatus === "success" && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

                            {/* Header */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-8 pt-8 pb-6 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Payment Confirmed!</h2>
                                <p className="text-gray-500 mt-1.5 text-sm">Your spot is secured. We&apos;ll see you there!</p>
                            </div>

                            {/* Details */}
                            <div className="px-6 py-5 space-y-4">
                                {regLoading ? (
                                    <div className="py-6 flex flex-col items-center gap-2 text-gray-400">
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        <span className="text-sm">Loading your details…</span>
                                    </div>
                                ) : regData ? (
                                    <>
                                        <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 overflow-hidden">
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {displayName(regData)}
                                                </span>
                                            </div>
                                            <div className="flex items-start justify-between px-4 py-3 gap-4">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0">Registration</span>
                                                <span className="text-sm font-semibold text-gray-900 text-right">
                                                    {regData.workshop_title || "Workshop"}
                                                </span>
                                            </div>
                                            {regData.business_name && (
                                                <div className="flex items-center justify-between px-4 py-3">
                                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Business</span>
                                                    <span className="text-sm font-medium text-gray-800">{regData.business_name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount Paid</span>
                                                <span className="text-sm font-bold text-green-600">
                                                    {regData.workshop_price != null ? `$${regData.workshop_price} USD` : "Paid"}
                                                </span>
                                            </div>
                                        </div>

                                        {(regData.personal_email || regData.business_email) && (
                                            <p className="text-xs text-center bg-blue-50 text-blue-700 rounded-xl px-4 py-3 leading-relaxed">
                                                A confirmation email has been sent to{" "}
                                                <span className="font-semibold">{regData.personal_email || regData.business_email}</span>
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400 text-center">
                                            Ref: <span className="font-mono">{regData.registration_id}</span>
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-2">
                                        Your registration is confirmed. Check your email for details.
                                    </p>
                                )}

                                <button
                                    onClick={() => setPaymentStatus(null)}
                                    className="w-full py-3 bg-[#177fc9] hover:bg-[#0f5b90] text-white font-semibold rounded-xl transition-colors text-sm"
                                >
                                    Continue to Workshop Page
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Payment Cancelled Overlay ── */}
                {paymentStatus === "cancelled" && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

                            {/* Header */}
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 px-8 pt-8 pb-6 text-center relative">
                                <button
                                    onClick={() => setPaymentStatus(null)}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-red-100 text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Payment Not Completed</h2>
                                <p className="text-gray-500 mt-1.5 text-sm">No worries — your details are saved.</p>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-3">
                                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800 leading-relaxed">
                                    Your registration has been saved. Click <span className="font-semibold">Try Again</span> to return to the payment screen without re-entering your information.
                                </div>

                                <button
                                    onClick={() => {
                                        setPaymentStatus(null)
                                        if (cancelResumeId) setResumeId(cancelResumeId)
                                        setFormModalOpen(true)
                                    }}
                                    className="w-full py-3 bg-[#177fc9] hover:bg-[#0f5b90] text-white font-semibold rounded-xl transition-colors text-sm"
                                >
                                    Try Again
                                </button>

                                <button
                                    onClick={() => setPaymentStatus(null)}
                                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl transition-colors text-sm"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                onClose={() => setFormModalOpen(false)}
                workshopTitle="Business Constraint-Breaking Workshop"
                workshopPrice={100}
                resumeId={resumeId}
            />
        </div>
    )
}
