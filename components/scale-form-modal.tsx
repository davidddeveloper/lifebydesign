"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { PhoneInput } from "@/components/phone-input"

interface ScaleFormModalProps {
  isOpen: boolean
  onClose: () => void
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
  monthlyRevenue: string
  volumeIssueRating: number
  conversionIssueRating: number
  economicsIssueRating: number
  capacityIssueRating: number
  businessGoal: string
  scaleHelp: string
  previousCoaching: string
  termsAccepted: boolean
  hearAboutUs: string
  otherSource: string
}

export function ScaleFormModal({ isOpen, onClose }: ScaleFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
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
    monthlyRevenue: "",
    volumeIssueRating: 0,
    conversionIssueRating: 0,
    economicsIssueRating: 0,
    capacityIssueRating: 0,
    businessGoal: "",
    scaleHelp: "",
    previousCoaching: "",
    termsAccepted: false,
    hearAboutUs: "",
    otherSource: "",
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateStep1 = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.personalEmail.trim() && !formData.businessEmail.trim()) {
      newErrors.personalEmail = "At least one email is required"
      newErrors.businessEmail = "At least one email is required"
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
    const newErrors: Partial<FormData> = {}
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!formData.websiteLink.trim()) newErrors.websiteLink = "At least one link is required"
    if (!formData.businessSnapshot.trim()) newErrors.businessSnapshot = "Business snapshot is required"
    if (!formData.whatYouSell.trim()) newErrors.whatYouSell = "This field is required"
    if (!formData.targetCustomers.trim()) newErrors.targetCustomers = "This field is required"
    if (!formData.monthlyRevenue) newErrors.monthlyRevenue = "Please select your revenue range"
    if (
      formData.volumeIssueRating === 0 &&
      formData.conversionIssueRating === 0 &&
      formData.economicsIssueRating === 0 &&
      formData.capacityIssueRating === 0
    ) {
      newErrors.volumeIssueRating = "Please rate at least one challenge" as unknown as number
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.businessGoal.trim()) newErrors.businessGoal = "This field is required"
    if (!formData.scaleHelp.trim()) newErrors.scaleHelp = "This field is required"
    if (!formData.previousCoaching.trim()) newErrors.previousCoaching = "This field is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep4 = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms" as unknown as number
    if (!formData.hearAboutUs) newErrors.hearAboutUs = "Please select how you heard about us"
    if (formData.hearAboutUs === "Other" && !formData.otherSource.trim()) {
      newErrors.otherSource = "Please specify your source"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "personalEmail" || field === "businessEmail") {
      setErrors((prev) => ({ ...prev, personalEmail: "", businessEmail: "" }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    const updatedData = { ...formData, [field]: value }
    if (currentStep === 1) {
      if (
        updatedData.firstName &&
        updatedData.lastName &&
        (updatedData.personalEmail || updatedData.businessEmail) &&
        updatedData.phone
      ) {
        setTimeout(() => setCurrentStep(2), 300)
      }
    } else if (currentStep === 2) {
      if (
        updatedData.businessName &&
        updatedData.websiteLink &&
        updatedData.businessSnapshot &&
        updatedData.whatYouSell &&
        updatedData.targetCustomers &&
        updatedData.monthlyRevenue &&
        (updatedData.volumeIssueRating > 0 ||
          updatedData.conversionIssueRating > 0 ||
          updatedData.economicsIssueRating > 0 ||
          updatedData.capacityIssueRating > 0)
      ) {
        setTimeout(() => setCurrentStep(3), 300)
      }
    } else if (currentStep === 3) {
      if (updatedData.businessGoal && updatedData.scaleHelp && updatedData.previousCoaching) {
        setTimeout(() => setCurrentStep(4), 300)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep4()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/scale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: `${formData.firstName} ${formData.lastName}`,
          personalEmail: formData.personalEmail,
          businessEmail: formData.businessEmail,
          phone: `${formData.countryCode}${formData.phone}`,
          countryCode: formData.countryCode,
          businessName: formData.businessName,
          websiteLink: formData.websiteLink,
          businessSnapshot: formData.businessSnapshot,
          whatYouSell: formData.whatYouSell,
          targetCustomers: formData.targetCustomers,
          monthlyRevenue: formData.monthlyRevenue,
          volumeIssueRating: formData.volumeIssueRating,
          conversionIssueRating: formData.conversionIssueRating,
          economicsIssueRating: formData.economicsIssueRating,
          capacityIssueRating: formData.capacityIssueRating,
          businessGoal: formData.businessGoal,
          scaleHelp: formData.scaleHelp,
          previousCoaching: formData.previousCoaching,
          hearAboutUs: formData.hearAboutUs,
          otherSource: formData.otherSource,
          submittedAt: new Date().toISOString(),
          source: "Workshop Page",
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          onClose()
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
            monthlyRevenue: "",
            volumeIssueRating: 0,
            conversionIssueRating: 0,
            economicsIssueRating: 0,
            capacityIssueRating: 0,
            businessGoal: "",
            scaleHelp: "",
            previousCoaching: "",
            termsAccepted: false,
            hearAboutUs: "",
            otherSource: "",
          })
          setCurrentStep(1)
          setSubmitStatus("idle")
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

  // Updated progress calculation for 4 steps
  const progress = (currentStep / 4) * 100

  const RatingStars = ({
    value,
    onChange,
  }: {
    value: number
    onChange: (rating: number) => void
  }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="transition-transform hover:scale-110"
          >
            <Star className={`w-6 h-6 ${rating <= value ? "fill-[#7c3aed] text-[#7c3aed]" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    )
  }

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden pointer-events-auto">
              <div className="bg-[#1e293b] px-6 py-5 flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">Ready to Scale Your Business?</h2>
                  <p className="text-white/70 text-sm mt-1">Complete the form to secure your spot</p>
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
                  className="bg-[#7c3aed] h-full"
                  // Updated progress bar initial width for 4 steps
                  initial={{ width: "25%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          formData.firstName &&
                          formData.lastName &&
                          (formData.personalEmail || formData.businessEmail) &&
                          formData.phone
                            ? "bg-green-500"
                            : "bg-[#7c3aed]"
                        } text-white font-bold`}
                      >
                        {formData.firstName &&
                        formData.lastName &&
                        (formData.personalEmail || formData.businessEmail) &&
                        formData.phone ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          "1"
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
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
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleFieldChange("lastName", e.target.value)}
                          className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="personalEmail" className="text-gray-700 font-semibold">
                          Personal Email {!formData.businessEmail && "*"}
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
                          Business Email {!formData.personalEmail && "*"}
                        </Label>
                        <Input
                          id="businessEmail"
                          type="email"
                          value={formData.businessEmail}
                          onChange={(e) => handleFieldChange("businessEmail", e.target.value)}
                          className={`mt-1 ${errors.businessEmail ? "border-red-500" : ""}`}
                          placeholder="john@company.com"
                        />
                        {errors.businessEmail && <p className="text-red-500 text-sm mt-1">{errors.businessEmail}</p>}
                      </div>
                    </div>
                    {!formData.personalEmail && !formData.businessEmail && (
                      <p className="text-gray-600 text-sm -mt-2">At least one email address is required</p>
                    )}

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

                  {currentStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-6 border-t"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            formData.businessName &&
                            formData.websiteLink &&
                            formData.businessSnapshot &&
                            formData.whatYouSell &&
                            formData.targetCustomers &&
                            formData.monthlyRevenue &&
                            (
                              formData.volumeIssueRating > 0 ||
                                formData.conversionIssueRating > 0 ||
                                formData.economicsIssueRating > 0 ||
                                formData.capacityIssueRating > 0
                            )
                              ? "bg-green-500"
                              : "bg-[#7c3aed]"
                          } text-white font-bold`}
                        >
                          {formData.businessName &&
                          formData.websiteLink &&
                          formData.businessSnapshot &&
                          formData.whatYouSell &&
                          formData.targetCustomers &&
                          formData.monthlyRevenue &&
                          (formData.volumeIssueRating > 0 ||
                            formData.conversionIssueRating > 0 ||
                            formData.economicsIssueRating > 0 ||
                            formData.capacityIssueRating > 0) ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            "2"
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Business Info/Snapshot</h3>
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
                          Website / Instagram / Facebook Link *
                        </Label>
                        <Input
                          id="websiteLink"
                          value={formData.websiteLink}
                          onChange={(e) => handleFieldChange("websiteLink", e.target.value)}
                          className={`mt-1 ${errors.websiteLink ? "border-red-500" : ""}`}
                          placeholder="https://yourwebsite.com or @instagram"
                        />
                        {errors.websiteLink && <p className="text-red-500 text-sm mt-1">{errors.websiteLink}</p>}
                      </div>

                      <div>
                        <Label htmlFor="businessSnapshot" className="text-gray-700 font-semibold">
                          Business Snapshot *
                        </Label>
                        <Textarea
                          id="businessSnapshot"
                          value={formData.businessSnapshot}
                          onChange={(e) => handleFieldChange("businessSnapshot", e.target.value)}
                          className={`mt-1 ${errors.businessSnapshot ? "border-red-500" : ""}`}
                          placeholder="Brief overview of your business..."
                          rows={3}
                        />
                        {errors.businessSnapshot && (
                          <p className="text-red-500 text-sm mt-1">{errors.businessSnapshot}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="whatYouSell" className="text-gray-700 font-semibold">
                          What does your business sell? *
                        </Label>
                        <Input
                          id="whatYouSell"
                          value={formData.whatYouSell}
                          onChange={(e) => handleFieldChange("whatYouSell", e.target.value)}
                          className={`mt-1 ${errors.whatYouSell ? "border-red-500" : ""}`}
                          placeholder="Products, services, etc."
                        />
                        {errors.whatYouSell && <p className="text-red-500 text-sm mt-1">{errors.whatYouSell}</p>}
                      </div>

                      <div>
                        <Label htmlFor="targetCustomers" className="text-gray-700 font-semibold">
                          Who are your target customers? *
                        </Label>
                        <Input
                          id="targetCustomers"
                          value={formData.targetCustomers}
                          onChange={(e) => handleFieldChange("targetCustomers", e.target.value)}
                          className={`mt-1 ${errors.targetCustomers ? "border-red-500" : ""}`}
                          placeholder="Describe your ideal customer"
                        />
                        {errors.targetCustomers && (
                          <p className="text-red-500 text-sm mt-1">{errors.targetCustomers}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">Current monthly revenue *</Label>
                        <RadioGroup
                          value={formData.monthlyRevenue}
                          onValueChange={(value) => handleFieldChange("monthlyRevenue", value)}
                          className="space-y-3"
                        >
                          {[
                            "Less than SLL 5,000",
                            "SLL 5,000 - SLL 20,000",
                            "SLL 20,001 - SLL 100,000",
                            "Over SLL 100,000",
                          ].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={option} />
                              <Label htmlFor={option} className="font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.monthlyRevenue && <p className="text-red-500 text-sm mt-1">{errors.monthlyRevenue}</p>}
                      </div>

                      {/* Replaced radio group with star rating for challenges */}
                      <div>
                        <Label className="text-gray-700 font-semibold mb-4 block">
                          On a scale of 1-5, rate how these challenges affect your business *
                        </Label>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-600 font-medium mb-2 block">
                              Not enough customers (Volume issue)
                            </Label>
                            <RatingStars
                              value={formData.volumeIssueRating}
                              onChange={(value) => handleFieldChange("volumeIssueRating", value)}
                            />
                          </div>

                          <div>
                            <Label className="text-gray-600 font-medium mb-2 block">
                              Low conversions (Sales process issue)
                            </Label>
                            <RatingStars
                              value={formData.conversionIssueRating}
                              onChange={(value) => handleFieldChange("conversionIssueRating", value)}
                            />
                          </div>

                          <div>
                            <Label className="text-gray-600 font-medium mb-2 block">
                              Pricing or profit margins too low (Economics issue)
                            </Label>
                            <RatingStars
                              value={formData.economicsIssueRating}
                              onChange={(value) => handleFieldChange("economicsIssueRating", value)}
                            />
                          </div>

                          <div>
                            <Label className="text-gray-600 font-medium mb-2 block">
                              Operations/team can't keep up (Capacity issue)
                            </Label>
                            <RatingStars
                              value={formData.capacityIssueRating}
                              onChange={(value) => handleFieldChange("capacityIssueRating", value)}
                            />
                          </div>
                        </div>
                        {errors.volumeIssueRating && (
                          <p className="text-red-500 text-sm mt-2">{errors.volumeIssueRating}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-6 border-t"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#7c3aed] text-white font-bold">
                          3
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Goals and Expectations</h3>
                      </div>

                      <div>
                        <Label htmlFor="businessGoal" className="text-gray-700 font-semibold">
                          What is your #1 business goal for the next 90 days? *
                        </Label>
                        <Textarea
                          id="businessGoal"
                          value={formData.businessGoal}
                          onChange={(e) => handleFieldChange("businessGoal", e.target.value)}
                          className={`mt-1 ${errors.businessGoal ? "border-red-500" : ""}`}
                          placeholder="Describe your primary goal..."
                          rows={3}
                        />
                        {errors.businessGoal && <p className="text-red-500 text-sm mt-1">{errors.businessGoal}</p>}
                      </div>

                      <div>
                        <Label htmlFor="scaleHelp" className="text-gray-700 font-semibold">
                          What do you hope Joe Abass & the team will help you with? *
                        </Label>
                        <Textarea
                          id="scaleHelp"
                          value={formData.scaleHelp}
                          onChange={(e) => handleFieldChange("scaleHelp", e.target.value)}
                          className={`mt-1 ${errors.scaleHelp ? "border-red-500" : ""}`}
                          placeholder="What specific help are you looking for..."
                          rows={3}
                        />
                        {errors.scaleHelp && <p className="text-red-500 text-sm mt-1">{errors.scaleHelp}</p>}
                      </div>

                      <div>
                        <Label htmlFor="previousCoaching" className="text-gray-700 font-semibold">
                          Have you received business coaching or accelerator support before? *
                        </Label>
                        <Textarea
                          id="previousCoaching"
                          value={formData.previousCoaching}
                          onChange={(e) => handleFieldChange("previousCoaching", e.target.value)}
                          className={`mt-1 ${errors.previousCoaching ? "border-red-500" : ""}`}
                          placeholder="Yes/No and details if applicable..."
                          rows={2}
                        />
                        {errors.previousCoaching && (
                          <p className="text-red-500 text-sm mt-1">{errors.previousCoaching}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Added step 4 for submission confirmation */}
                  {currentStep >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-6 border-t"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#7c3aed] text-white font-bold">
                          4
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Submission Confirmation</h3>
                      </div>

                      <div>
                        <Textarea
                          id="description"
                          value={formData.otherSource}
                          onChange={(e) => handleFieldChange("otherSource", e.target.value)}
                          className="mt-1"
                          placeholder="Any additional information you'd like to share..."
                          rows={3}
                        />
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
                            By submitting this form, I grant Startup Bodyshop and Joe Abass Bangura permission to use my
                            information for screening purposes. I have read and agree to the above terms *
                          </Label>
                        </div>
                        {errors.termsAccepted && <p className="text-red-500 text-sm mt-2">{errors.termsAccepted}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">How did you hear about us? *</Label>
                        <RadioGroup
                          value={formData.hearAboutUs}
                          onValueChange={(value) => handleFieldChange("hearAboutUs", value)}
                          className="space-y-3"
                        >
                          {["YouTube", "Facebook", "Instagram", "TikTok", "Google Search", "Referral", "Other"].map(
                            (option) => (
                              <div key={option} className="flex items-center space-x-3">
                                <RadioGroupItem value={option} id={option} />
                                <Label htmlFor={option} className="font-normal cursor-pointer">
                                  {option}
                                </Label>
                              </div>
                            ),
                          )}
                        </RadioGroup>
                        {errors.hearAboutUs && <p className="text-red-500 text-sm mt-2">{errors.hearAboutUs}</p>}
                      </div>

                      {formData.hearAboutUs === "Other" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            placeholder="Please specify your source..."
                            value={formData.otherSource}
                            onChange={(e) => handleFieldChange("otherSource", e.target.value)}
                            className={`mt-2 ${errors.otherSource ? "border-red-500" : ""}`}
                          />
                          {errors.otherSource && <p className="text-red-500 text-sm mt-1">{errors.otherSource}</p>}
                        </motion.div>
                      )}

                      <div className="pt-4">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-lg py-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : submitStatus === "success" ? (
                            <>
                              <Check className="w-5 h-5 mr-2" />
                              Application Submitted!
                            </>
                          ) : submitStatus === "error" ? (
                            "Try Again"
                          ) : (
                            "Submit Application"
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

                        {submitStatus === "success" && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-green-600 text-sm mt-2 text-center font-semibold"
                          >
                            Thank you! We'll be in touch soon.
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
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
