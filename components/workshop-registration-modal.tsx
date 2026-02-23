"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2, CreditCard, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { PhoneInput } from "@/components/phone-input"

type RegistrationType = "workshop" | "vip_consultation"

interface WorkshopRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  workshopTitle?: string
  workshopPrice?: number // in USD (display value, e.g. 100 = $100)
  resumeId?: string | null
}

interface FormData {
  firstName: string
  lastName: string
  personalEmail: string
  businessEmail: string
  phone: string
  countryCode: string
  businessName: string
  websiteLink: string
  businessSnapshot: string
  whatYouSell: string
  targetCustomers: string
  yearsOfOperations: string
  businessGoal: string
  termsAccepted: boolean
  hearAboutUs: string
  otherSource: string
}

const STORAGE_KEY = "sbs_workshop_registration_progress"

const PATH_CONFIG: Record<RegistrationType, { title: string; price: number; label: string; color: string; hoverColor: string }> = {
  workshop: {
    title: "Business Constraint-Breaking Workshop",
    price: 100,
    label: "Workshop",
    color: "#177fc9",
    hoverColor: "#0f5b90",
  },
  vip_consultation: {
    title: "VIP Consultation",
    price: 200,
    label: "VIP Consultation",
    color: "#b45309",
    hoverColor: "#92400e",
  },
}

export function WorkshopRegistrationModal({
  isOpen,
  onClose,
  resumeId
}: WorkshopRegistrationModalProps) {
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "payment">("idle")
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    personalEmail: "",
    businessEmail: "",
    phone: "",
    countryCode: "+232",
    businessName: "",
    websiteLink: "",
    businessSnapshot: "",
    whatYouSell: "",
    targetCustomers: "",
    yearsOfOperations: "",
    businessGoal: "",
    termsAccepted: false,
    hearAboutUs: "",
    otherSource: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // Derived config from selected path
  const pathConfig = registrationType ? PATH_CONFIG[registrationType] : null
  const workshopTitle = pathConfig?.title ?? "Business Constraint-Breaking Workshop"
  const workshopPrice = pathConfig?.price ?? 100
  const accentColor = pathConfig?.color ?? "#177fc9"
  const accentHoverColor = pathConfig?.hoverColor ?? "#0f5b90"

  // Load saved progress on mount or when resumeId changes
  useEffect(() => {
    if (isOpen) {
      const loadResumeData = async () => {
        if (resumeId) {
          try {
            const response = await fetch(`/api/workshop-registration?id=${resumeId}`)
            if (response.ok) {
              const data = await response.json()
              if (data.success && data.registration) {
                const reg = data.registration
                setFormData(prev => ({
                  ...prev,
                  firstName: reg.first_name || "",
                  lastName: reg.last_name || "",
                  personalEmail: reg.personal_email || "",
                  businessEmail: reg.business_email || "",
                  phone: reg.phone || "",
                  countryCode: reg.country_code || "+232",
                  businessName: reg.business_name || "",
                  websiteLink: reg.website_link || "",
                  businessSnapshot: reg.business_snapshot || "",
                  whatYouSell: reg.what_you_sell || "",
                  targetCustomers: reg.target_customers || "",
                  yearsOfOperations: reg.years_of_operations || "",
                  businessGoal: reg.business_goal || "",
                  hearAboutUs: reg.hear_about_us || "",
                  otherSource: reg.other_source || "",
                  termsAccepted: true,
                }))
                setRegistrationId(reg.registration_id)

                // Detect registration type from stored workshop_title
                if (reg.workshop_title === "VIP Consultation") {
                  setRegistrationType("vip_consultation")
                } else {
                  setRegistrationType("workshop")
                }

                if (reg.status === "pending_payment" || reg.status === "in_progress") {
                  setCurrentStep(3)
                }
                return
              }
            }
          } catch (error) {
            console.error("Error fetching registration:", error)
          }
        }

        // Fallback to local storage if no resumeId or fetch failed
        try {
          const savedData = localStorage.getItem(STORAGE_KEY)
          if (savedData) {
            const parsed = JSON.parse(savedData)
            setFormData(prev => ({ ...prev, ...parsed.formData }))
            if (parsed.registrationId) {
              setRegistrationId(parsed.registrationId)
            }
            if (parsed.currentStep) {
              setCurrentStep(parsed.currentStep)
            }
            if (parsed.registrationType) {
              setRegistrationType(parsed.registrationType)
            }
          }
        } catch (error) {
          console.error("Error restoring workshop registration progress:", error)
        }
      }
      loadResumeData()
    }
  }, [isOpen, resumeId])

  // Debounced save to localStorage and server
  const saveProgress = useCallback(async (
    data: FormData,
    step: number,
    regId: string | null,
    regType: RegistrationType | null
  ) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          formData: data,
          currentStep: step,
          registrationId: regId,
          registrationType: regType,
        }))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      // Save to server if we have enough data (name + email or phone)
      const hasMinimumData = data.firstName && (data.personalEmail || data.businessEmail || data.phone)
      if (hasMinimumData && regType) {
        const config = PATH_CONFIG[regType]
        try {
          const response = await fetch("/api/workshop-registration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...data,
              registrationId: regId,
              status: "in_progress",
              currentStep: step,
              workshopTitle: config.title,
              workshopPrice: config.price,
            }),
          })

          if (response.ok) {
            const result = await response.json()
            if (result.registrationId && !regId) {
              setRegistrationId(result.registrationId)
              localStorage.setItem(STORAGE_KEY, JSON.stringify({
                formData: data,
                currentStep: step,
                registrationId: result.registrationId,
                registrationType: regType,
              }))
            }
          }
        } catch (error) {
          console.error("Error saving progress to server:", error)
        }
      }
    }, 1000) // 1 second debounce
  }, [])

  // Clear saved progress
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Error clearing progress:", error)
    }
  }, [])

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.personalEmail.trim() && !formData.businessEmail.trim()) {
      newErrors.personalEmail = "At least one email is required"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (formData.personalEmail.trim() && !emailRegex.test(formData.personalEmail)) {
        newErrors.personalEmail = "Invalid email format"
      }
      if (formData.businessEmail.trim() && !emailRegex.test(formData.businessEmail)) {
        newErrors.businessEmail = "Invalid email format"
      }
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!formData.yearsOfOperations) newErrors.yearsOfOperations = "Please select your years of operation"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      saveProgress(newData, currentStep, registrationId, registrationType)
      return newData
    })

    if (field === "personalEmail" || field === "businessEmail") {
      setErrors((prev) => ({ ...prev, personalEmail: "", businessEmail: "" }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Auto-advance logic
    const updatedData = { ...formData, [field]: value }
    if (currentStep === 1) {
      if (
        updatedData.firstName &&
        (updatedData.personalEmail || updatedData.businessEmail) &&
        updatedData.phone
      ) {
        setTimeout(() => setCurrentStep(2), 300)
      }
    } else if (currentStep === 2) {
      if (updatedData.businessName && updatedData.yearsOfOperations) {
        setTimeout(() => setCurrentStep(3), 300)
      }
    }
  }

  const handleSelectPath = (type: RegistrationType) => {
    setRegistrationType(type)
    setCurrentStep(1)
  }

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep3()) return
    if (!registrationType) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    const config = PATH_CONFIG[registrationType]

    try {
      const response = await fetch("/api/workshop-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          registrationId,
          status: "pending_payment",
          currentStep: 3,
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: `${formData.countryCode}${formData.phone}`,
          workshopTitle: config.title,
          workshopPrice: config.price,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setRegistrationId(result.registrationId)
        setSubmitStatus("payment")
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMonimePayment = async () => {
    if (!registrationId || !registrationType) return

    setIsSubmitting(true)
    const config = PATH_CONFIG[registrationType]
    try {
      const payload = {
        registrationId,
        workshopTitle: config.title,
        workshopPrice: config.price,
        currency: "USD",
      }
      console.log("Sending checkout payload:", payload)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { checkoutUrl } = await response.json()

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Payment initiation error:", error)
      alert("Unable to start payment. Please try again or contact us for help.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    // Don't clear progress on close - let them resume later
  }

  const handleSuccessClose = () => {
    clearProgress()
    setFormData({
      firstName: "",
      lastName: "",
      personalEmail: "",
      businessEmail: "",
      phone: "",
      countryCode: "+232",
      businessName: "",
      websiteLink: "",
      businessSnapshot: "",
      whatYouSell: "",
      targetCustomers: "",
      yearsOfOperations: "",
      businessGoal: "",
      termsAccepted: false,
      hearAboutUs: "",
      otherSource: "",
    })
    setCurrentStep(1)
    setSubmitStatus("idle")
    setRegistrationId(null)
    setRegistrationType(null)
    onClose()
  }

  const handleChangePath = () => {
    setRegistrationType(null)
    setCurrentStep(1)
    setSubmitStatus("idle")
  }

  const progress = (currentStep / 3) * 100

  const isVip = registrationType === "vip_consultation"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div
                className="px-6 py-5 flex items-center justify-between"
                style={{ backgroundColor: registrationType === null ? "#1e293b" : isVip ? "#78350f" : "#1e293b" }}
              >
                <div className="flex-1">
                  {registrationType === null ? (
                    <h2 className="text-2xl font-bold text-white">Choose Your Path</h2>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-white">
                        {isVip ? "VIP Consultation" : "Workshop"} Registration
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white/70 text-sm">{workshopTitle}</p>
                        <button
                          onClick={handleChangePath}
                          className="text-white/50 hover:text-white/90 text-xs underline transition-colors"
                        >
                          change
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress bar (only shown after path selection) */}
              {registrationType !== null && (
                <div className="bg-gray-100 h-2">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: accentColor }}
                    initial={{ width: "33%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
                {/* ── Path Selection ── */}
                {registrationType === null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-2"
                  >
                    <p className="text-gray-600 text-center mb-6 text-base">
                      How would you like to work with us?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Workshop card */}
                      <button
                        onClick={() => handleSelectPath("workshop")}
                        className="text-left border-2 border-gray-200 hover:border-[#177fc9] rounded-2xl p-5 transition-all hover:shadow-md group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Users className="w-5 h-5 text-[#177fc9]" />
                          </div>
                          <span className="text-[#177fc9] font-bold text-lg">$100 <span className="text-xs font-normal text-gray-500">USD</span></span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">Workshop</h3>
                        <p className="text-sm text-gray-500 mb-4">2-day group training event</p>
                        <ul className="space-y-1.5 mb-5">
                          {[
                            "Identify your #1 business constraint",
                            "Group training with peer entrepreneurs",
                            "Build your 90-day action plan",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-[#177fc9] mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="w-full bg-[#177fc9] group-hover:bg-[#0f5b90] text-white text-sm font-semibold py-2.5 px-4 rounded-full text-center transition-colors">
                          Register for Workshop
                        </div>
                      </button>

                      {/* VIP Consultation card */}
                      <button
                        onClick={() => handleSelectPath("vip_consultation")}
                        className="text-left border-2 border-gray-200 hover:border-amber-500 rounded-2xl p-5 transition-all hover:shadow-md group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                            <Star className="w-5 h-5 text-amber-600" />
                          </div>
                          <span className="text-amber-600 font-bold text-lg">$200 <span className="text-xs font-normal text-gray-500">USD</span></span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">VIP Consultation</h3>
                        <p className="text-sm text-gray-500 mb-4">Private 1-on-1 strategy session</p>
                        <ul className="space-y-1.5 mb-5">
                          {[
                            "Deep-dive into your specific challenges",
                            "Personalized strategy for your business",
                            "Direct 1-on-1 time with our team",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                              <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="w-full bg-amber-600 group-hover:bg-amber-700 text-white text-sm font-semibold py-2.5 px-4 rounded-full text-center transition-colors">
                          Book VIP Consultation
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Main form (shown after path selection) ── */}
                {registrationType !== null && (
                  <>
                    {submitStatus === "payment" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8"
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                          style={{ backgroundColor: isVip ? "#fef3c7" : "#dbeafe" }}
                        >
                          <CreditCard className="w-8 h-8" style={{ color: accentColor }} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Registration</h3>
                        <p className="text-gray-600 mb-6">
                          Your spot is reserved! Complete payment to confirm your{" "}
                          {isVip ? "consultation" : "registration"}.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6 max-w-sm mx-auto">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{isVip ? "Consultation Fee" : "Workshop Fee"}</span>
                            <span className="font-bold text-gray-900">${workshopPrice.toLocaleString()} USD</span>
                          </div>
                          {isVip && (
                            <p className="text-xs text-gray-500 mt-2 text-left">
                              ≈ {(workshopPrice * 24).toLocaleString()} SLE
                            </p>
                          )}
                          {!isVip && (
                            <p className="text-xs text-gray-500 mt-2 text-left">
                              ≈ {(workshopPrice * 24).toLocaleString()} SLE
                            </p>
                          )}
                        </div>

                        <Button
                          onClick={handleMonimePayment}
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full max-w-sm text-white font-bold text-lg py-6 rounded-full disabled:opacity-50"
                          style={{ backgroundColor: accentColor }}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Redirecting to payment...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-5 h-5 mr-2" />
                              Pay with Monime
                            </>
                          )}
                        </Button>

                        <p className="text-sm text-gray-500 mt-4">
                          Secure payment powered by Monime
                        </p>

                        <button
                          onClick={handleSuccessClose}
                          className="text-sm text-gray-500 hover:text-gray-700 mt-4 underline"
                        >
                          I&apos;ll pay later
                        </button>
                      </motion.div>
                    ) : submitStatus === "success" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8"
                      >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h3>
                        <p className="text-gray-600 mb-6">
                          Thank you for registering for the {workshopTitle}.
                          We&apos;ve sent a confirmation email with all the details.
                        </p>
                        <Button
                          onClick={handleSuccessClose}
                          className="text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          Close
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleProceedToPayment} className="space-y-6">
                        {/* Step 1: Personal Information */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
                              style={{
                                backgroundColor:
                                  formData.firstName &&
                                  (formData.personalEmail || formData.businessEmail) &&
                                  formData.phone
                                    ? "#22c55e"
                                    : accentColor,
                              }}
                            >
                              {formData.firstName &&
                              (formData.personalEmail || formData.businessEmail) &&
                              formData.phone ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                "1"
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                          </div>

                          {/* Data Collection Notice */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700">
                              <strong>Data Collection Notice:</strong> We save your responses as you fill out this form to help improve our services and follow up if needed.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName" className="text-gray-700 font-semibold">
                                First Name *
                              </Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                                className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                                placeholder="John"
                              />
                              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                              <Label htmlFor="lastName" className="text-gray-700 font-semibold">
                                Last Name
                              </Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                                className="mt-1"
                                placeholder="Doe"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="personalEmail" className="text-gray-700 font-semibold">
                                Email {!formData.businessEmail && "*"}
                              </Label>
                              <Input
                                id="personalEmail"
                                type="email"
                                value={formData.personalEmail}
                                onChange={(e) => handleFieldChange("personalEmail", e.target.value)}
                                className={`mt-1 ${errors.personalEmail ? "border-red-500" : ""}`}
                                placeholder="john@example.com"
                              />
                              {errors.personalEmail && <p className="text-red-500 text-sm mt-1">{errors.personalEmail}</p>}
                            </div>

                            <div>
                              <Label htmlFor="businessEmail" className="text-gray-700 font-semibold">
                                Business Email
                              </Label>
                              <Input
                                id="businessEmail"
                                type="email"
                                value={formData.businessEmail}
                                onChange={(e) => handleFieldChange("businessEmail", e.target.value)}
                                className={`mt-1 ${errors.businessEmail ? "border-red-500" : ""}`}
                                placeholder="john@company.com"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="phone" className="text-gray-700 font-semibold">
                              Phone Number *
                            </Label>
                            <PhoneInput
                              value={formData.phone}
                              countryCode={formData.countryCode}
                              onPhoneChange={(value) => handleFieldChange("phone", value)}
                              onCountryCodeChange={(value) => handleFieldChange("countryCode", value)}
                              error={errors.phone}
                            />
                          </div>
                        </motion.div>

                        {/* Step 2: Business Info */}
                        {currentStep >= 2 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 pt-6 border-t"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
                                style={{
                                  backgroundColor:
                                    formData.businessName && formData.yearsOfOperations
                                      ? "#22c55e"
                                      : accentColor,
                                }}
                              >
                                {formData.businessName && formData.yearsOfOperations ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  "2"
                                )}
                              </div>
                              <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
                            </div>

                            <div>
                              <Label htmlFor="businessName" className="text-gray-700 font-semibold">
                                Business Name *
                              </Label>
                              <Input
                                id="businessName"
                                value={formData.businessName}
                                onChange={(e) => handleFieldChange("businessName", e.target.value)}
                                className={`mt-1 ${errors.businessName ? "border-red-500" : ""}`}
                                placeholder="Your Business Name"
                              />
                              {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                            </div>

                            <div>
                              <Label htmlFor="websiteLink" className="text-gray-700 font-semibold">
                                Website / Instagram / Facebook Link
                              </Label>
                              <Input
                                id="websiteLink"
                                value={formData.websiteLink}
                                onChange={(e) => handleFieldChange("websiteLink", e.target.value)}
                                className="mt-1"
                                placeholder="https://yourwebsite.com or @instagram"
                              />
                            </div>

                            <div>
                              <Label htmlFor="businessSnapshot" className="text-gray-700 font-semibold">
                                Business Snapshot (optional)
                              </Label>
                              <Textarea
                                id="businessSnapshot"
                                value={formData.businessSnapshot}
                                onChange={(e) => handleFieldChange("businessSnapshot", e.target.value)}
                                className="mt-1"
                                placeholder="Brief overview of your business..."
                                rows={2}
                                maxLength={500}
                              />
                            </div>

                            <div>
                              <Label htmlFor="yearsOfOperations" className="text-gray-700 font-semibold">
                                Years in Business *
                              </Label>
                              <select
                                id="yearsOfOperations"
                                value={formData.yearsOfOperations}
                                onChange={(e) => handleFieldChange("yearsOfOperations", e.target.value)}
                                className={`w-full mt-1 px-4 py-2 border rounded-lg font-medium text-gray-900 bg-white cursor-pointer transition-colors ${
                                  errors.yearsOfOperations ? "border-red-500" : "border-gray-300 hover:border-[#177fc9]"
                                } focus:outline-none focus:border-[#177fc9]`}
                              >
                                <option value="">Select years in business...</option>
                                <option value="Pre-launch">Pre-launch (planning stage)</option>
                                <option value="Under 1 Year">Under 1 Year</option>
                                <option value="1-2 Years">1-2 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                                <option value="6-10 Years">6-10 Years</option>
                                <option value="10+ Years">10+ Years</option>
                              </select>
                              {errors.yearsOfOperations && (
                                <p className="text-red-500 text-sm mt-1">{errors.yearsOfOperations}</p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="businessGoal" className="text-gray-700 font-semibold">
                                {isVip
                                  ? "What do you hope to achieve from this consultation? (optional)"
                                  : "What do you hope to achieve from this workshop? (optional)"}
                              </Label>
                              <Textarea
                                id="businessGoal"
                                value={formData.businessGoal}
                                onChange={(e) => handleFieldChange("businessGoal", e.target.value)}
                                className="mt-1"
                                placeholder={
                                  isVip
                                    ? "Your goals and what you'd like to cover in the session..."
                                    : "Your goals and expectations..."
                                }
                                rows={2}
                                maxLength={500}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Confirmation */}
                        {currentStep >= 3 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 pt-6 border-t"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: accentColor }}
                              >
                                3
                              </div>
                              <h3 className="text-xl font-bold text-gray-900">Confirm & Pay</h3>
                            </div>

                            <div>
                              <Label className="text-gray-700 font-semibold mb-3 block">How did you hear about us?</Label>
                              <RadioGroup
                                value={formData.hearAboutUs}
                                onValueChange={(value) => handleFieldChange("hearAboutUs", value)}
                                className="grid grid-cols-2 gap-2"
                              >
                                {["YouTube", "Facebook", "Instagram", "WhatsApp", "Google Search", "Referral", "Other"].map(
                                  (option) => (
                                    <div key={option} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option} id={`source-${option}`} />
                                      <Label htmlFor={`source-${option}`} className="font-normal cursor-pointer text-sm">
                                        {option}
                                      </Label>
                                    </div>
                                  ),
                                )}
                              </RadioGroup>
                            </div>

                            {formData.hearAboutUs === "Other" && (
                              <Input
                                placeholder="Please specify..."
                                value={formData.otherSource}
                                onChange={(e) => handleFieldChange("otherSource", e.target.value)}
                                className="mt-2"
                              />
                            )}

                            {/* Summary */}
                            <div
                              className="rounded-xl p-4 mt-4"
                              style={{ backgroundColor: isVip ? "#fffbeb" : "#f9fafb" }}
                            >
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {isVip ? "Consultation Summary" : "Workshop Summary"}
                              </h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{workshopTitle}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t mt-2">
                                  <span className="font-semibold text-gray-900">Total</span>
                                  <span className="font-bold" style={{ color: accentColor }}>
                                    ${workshopPrice.toLocaleString()} USD
                                  </span>
                                </div>
                                <div className="flex justify-end">
                                  <span className="text-xs text-gray-500">
                                    ≈ {(workshopPrice * 24).toLocaleString()} SLE
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex gap-3">
                                <Checkbox
                                  id="terms"
                                  checked={formData.termsAccepted}
                                  onCheckedChange={(checked) => handleFieldChange("termsAccepted", checked === true)}
                                  className="mt-0.5"
                                />
                                <Label htmlFor="terms" className="font-normal cursor-pointer text-sm">
                                  {isVip
                                    ? "I agree to the consultation terms and conditions and understand that my booking is confirmed upon payment. *"
                                    : "I agree to the workshop terms and conditions and understand that my registration is confirmed upon payment. *"}
                                </Label>
                              </div>
                              {errors.termsAccepted && <p className="text-red-500 text-sm mt-2">{errors.termsAccepted}</p>}
                            </div>

                            <div className="pt-4">
                              <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="w-full text-white font-bold text-lg py-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: accentColor }}
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    {isVip
                                      ? `Book VIP Consultation - $${workshopPrice.toLocaleString()} USD`
                                      : `Proceed to Payment - $${workshopPrice.toLocaleString()} USD`}
                                  </>
                                )}
                              </Button>

                              {submitStatus === "error" && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-red-500 text-sm mt-2 text-center"
                                >
                                  Something went wrong. Please try again.
                                </motion.p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
