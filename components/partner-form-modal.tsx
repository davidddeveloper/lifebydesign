"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface PartnerFormModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  businessLocation: string
  businessType: string
  businessDescription: string
  annualRevenue: string
  ebitda12Months: string
  ebitda3Months: string
  heardAbout: string
  ownershipDecision: string
  email: string
  firstName: string
  lastName: string
  phone: string
  companyName: string
  companyWebsite: string
  portfolioConsideration: string
  termsAccepted: boolean
}

export function PartnerFormModal({ isOpen, onClose }: PartnerFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState<FormData>({
    businessLocation: "",
    businessType: "",
    businessDescription: "",
    annualRevenue: "",
    ebitda12Months: "",
    ebitda3Months: "",
    heardAbout: "",
    ownershipDecision: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    portfolioConsideration: "",
    termsAccepted: false,
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStep = (step: number) => {
    const newErrors: Partial<FormData> = {}

    if (step === 1) {
      if (!formData.businessLocation) newErrors.businessLocation = "Business location is required"
      if (!formData.businessType) newErrors.businessType = "Business type is required"
      if (!formData.businessDescription.trim()) newErrors.businessDescription = "Description is required"
    } else if (step === 2) {
      if (!formData.annualRevenue) newErrors.annualRevenue = "Annual revenue is required"
      if (!formData.ebitda12Months.trim()) newErrors.ebitda12Months = "This field is required"
      if (!formData.ebitda3Months.trim()) newErrors.ebitda3Months = "This field is required"
      if (!formData.heardAbout) newErrors.heardAbout = "Please select an option"
      if (!formData.ownershipDecision) newErrors.ownershipDecision = "Please select an option"
    } else if (step === 3) {
      if (!formData.email.trim() || !formData.email.includes("@")) newErrors.email = "Valid email is required"
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!formData.phone.trim()) newErrors.phone = "Phone is required"
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
    } else if (step === 4) {
      if (!formData.portfolioConsideration) newErrors.portfolioConsideration = "Please select an option"
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms" as unknown as boolean
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(4)) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "Partner Application",
          submittedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          onClose()
          setCurrentStep(1)
          setFormData({
            businessLocation: "",
            businessType: "",
            businessDescription: "",
            annualRevenue: "",
            ebitda12Months: "",
            ebitda3Months: "",
            heardAbout: "",
            ownershipDecision: "",
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            companyName: "",
            companyWebsite: "",
            portfolioConsideration: "",
            termsAccepted: false,
          })
        }, 2000)
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

  const progress = (currentStep / 4) * 100

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              <div className="bg-[#1e293b] px-6 py-5 flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">Partner Application</h2>
                  <p className="text-white/70 text-sm mt-1">Step {currentStep} of 4</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gray-100 h-2">
                <motion.div
                  className="bg-[#177fc9] h-full"
                  initial={{ width: "25%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Business Information</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          Where is your business based? *
                        </Label>
                        <RadioGroup
                          value={formData.businessLocation}
                          onValueChange={(value) => handleFieldChange("businessLocation", value)}
                          className="space-y-3"
                        >
                          {["Freetown", "Provinces", "Other"].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={`location-${option}`} />
                              <Label htmlFor={`location-${option}`} className="font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.businessLocation && (
                          <p className="text-red-500 text-sm mt-2">{errors.businessLocation}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          What type of business do you have? *
                        </Label>
                        <RadioGroup
                          value={formData.businessType}
                          onValueChange={(value) => handleFieldChange("businessType", value)}
                          className="space-y-3"
                        >
                          {["Service", "E-commerce", "Brick & Mortar", "Software", "Other"].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={`type-${option}`} />
                              <Label htmlFor={`type-${option}`} className="font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.businessType && <p className="text-red-500 text-sm mt-2">{errors.businessType}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">
                          Please describe your business in 1-3 sentences MAX. *
                        </Label>
                        <Textarea
                          value={formData.businessDescription}
                          onChange={(e) => handleFieldChange("businessDescription", e.target.value)}
                          className={`mt-2 ${errors.businessDescription ? "border-red-500" : ""}`}
                          placeholder="Describe your business..."
                          rows={3}
                        />
                        {errors.businessDescription && (
                          <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Information</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">Annual Revenue? *</Label>
                        <Input
                          type="number"
                          value={formData.annualRevenue}
                          onChange={(e) => handleFieldChange("annualRevenue", e.target.value)}
                          className={`mt-1 ${errors.annualRevenue ? "border-red-500" : ""}`}
                          placeholder="SLL0"
                        />
                        {errors.annualRevenue && <p className="text-red-500 text-sm mt-1">{errors.annualRevenue}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">
                          How much profit (EBITDA) over past 12 months? *
                        </Label>
                        <Input
                          type="number"
                          value={formData.ebitda12Months}
                          onChange={(e) => handleFieldChange("ebitda12Months", e.target.value)}
                          className={`mt-2 ${errors.ebitda12Months ? "border-red-500" : ""}`}
                          placeholder="SLL0"
                        />
                        {errors.ebitda12Months && <p className="text-red-500 text-sm mt-1">{errors.ebitda12Months}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">
                          How much profit (EBITDA) over past 3 months? *
                        </Label>
                        <Input
                          type="number"
                          value={formData.ebitda3Months}
                          onChange={(e) => handleFieldChange("ebitda3Months", e.target.value)}
                          className={`mt-2 ${errors.ebitda3Months ? "border-red-500" : ""}`}
                          placeholder="SLL0"
                        />
                        {errors.ebitda3Months && <p className="text-red-500 text-sm mt-1">{errors.ebitda3Months}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          Where did you FIRST hear of startupbodyshop.com? *
                        </Label>
                        <RadioGroup
                          value={formData.heardAbout}
                          onValueChange={(value) => handleFieldChange("heardAbout", value)}
                          className="space-y-3"
                        >
                          {["YouTube", "Facebook", "Instagram", "TikTok", "Google Search", "Referral", "Other"].map(
                            (option) => (
                              <div key={option} className="flex items-center space-x-3">
                                <RadioGroupItem value={option} id={`heard-${option}`} />
                                <Label htmlFor={`heard-${option}`} className="font-normal cursor-pointer">
                                  {option}
                                </Label>
                              </div>
                            ),
                          )}
                        </RadioGroup>
                        {errors.heardAbout && <p className="text-red-500 text-sm mt-2">{errors.heardAbout}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          Are you a full or part owner and can you decide how to allocate equity? *
                        </Label>
                        <RadioGroup
                          value={formData.ownershipDecision}
                          onValueChange={(value) => handleFieldChange("ownershipDecision", value)}
                          className="space-y-3"
                        >
                          {["Yes", "No"].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={`ownership-${option}`} />
                              <Label htmlFor={`ownership-${option}`} className="font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.ownershipDecision && (
                          <p className="text-red-500 text-sm mt-2">{errors.ownershipDecision}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold">Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleFieldChange("email", e.target.value)}
                          className={`mt-2 ${errors.email ? "border-red-500" : ""}`}
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-700 font-semibold">First Name *</Label>
                          <Input
                            value={formData.firstName}
                            onChange={(e) => handleFieldChange("firstName", e.target.value)}
                            className={`mt-2 ${errors.firstName ? "border-red-500" : ""}`}
                            placeholder="John"
                          />
                          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                          <Label className="text-gray-700 font-semibold">Last Name *</Label>
                          <Input
                            value={formData.lastName}
                            onChange={(e) => handleFieldChange("lastName", e.target.value)}
                            className={`mt-2 ${errors.lastName ? "border-red-500" : ""}`}
                            placeholder="Doe"
                          />
                          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Phone *</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleFieldChange("phone", e.target.value)}
                          className={`mt-2 ${errors.phone ? "border-red-500" : ""}`}
                          placeholder="+232 88 223-213"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Company Name *</Label>
                        <Input
                          value={formData.companyName}
                          onChange={(e) => handleFieldChange("companyName", e.target.value)}
                          className={`mt-2 ${errors.companyName ? "border-red-500" : ""}`}
                          placeholder="Your Company"
                        />
                        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Company Website (optional)</Label>
                        <Input
                          value={formData.companyWebsite}
                          onChange={(e) => handleFieldChange("companyWebsite", e.target.value)}
                          className="mt-2"
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Final Step</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          Do you want us to consider your company to become a portfolio company? *
                        </Label>
                        <RadioGroup
                          value={formData.portfolioConsideration}
                          onValueChange={(value) => handleFieldChange("portfolioConsideration", value)}
                          className="space-y-3"
                        >
                          {["Yes, I want to apply.", "No, thank you"].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={`portfolio-${option}`} />
                              <Label htmlFor={`portfolio-${option}`} className="font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.portfolioConsideration && (
                          <p className="text-red-500 text-sm mt-2">{errors.portfolioConsideration}</p>
                        )}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Checkbox
                            id="terms"
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked) => handleFieldChange("termsAccepted", checked === true)}
                            className="mt-1"
                          />
                          <Label htmlFor="terms" className="font-normal cursor-pointer text-sm">
                            By providing your information, you give consent for us to contact you by mail, phone, text,
                            or email using automated systems. We do not sell your personal information and you can
                            withdraw consent at any time. *
                          </Label>
                        </div>
                        {errors.termsAccepted && <p className="text-red-500 text-sm mt-2">{errors.termsAccepted}</p>}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-4 pt-4">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        variant="outline"
                        className="flex-1"
                      >
                        Previous
                      </Button>
                    )}
                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-[#177fc9] hover:bg-[#42adff] text-white"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#177fc9] hover:bg-[#42adff] text-white disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : submitStatus === "success" ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Submitted!
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    )}
                  </div>

                  {submitStatus === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      Something went wrong. Please try again.
                    </motion.p>
                  )}

                  {submitStatus === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 text-sm text-center font-semibold"
                    >
                      Thank you! We'll review your application and be in touch soon.
                    </motion.p>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
