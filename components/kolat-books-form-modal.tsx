"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface KolatBooksFormModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  businessName: string
  businessIndustry: string
  businessAddress: string
  businessEmail: string
  businessPhone: string
  primaryContact: string
  contactPosition: string
  contactPhone: string
  contactEmail: string
  numberOfEmployees: string
  monthlyRevenue: string
  bookkeepingMethod: string
  currentBookkeeper: string
  financialChallenges: string
  servicesInterested: string[]
  communicationPreference: string[]
  termsAccepted: boolean
}

export function KolatBooksFormModal({ isOpen, onClose }: KolatBooksFormModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessIndustry: "",
    businessAddress: "",
    businessEmail: "",
    businessPhone: "",
    primaryContact: "",
    contactPosition: "",
    contactPhone: "",
    contactEmail: "",
    numberOfEmployees: "",
    monthlyRevenue: "",
    bookkeepingMethod: "",
    currentBookkeeper: "",
    financialChallenges: "",
    servicesInterested: [],
    communicationPreference: [],
    termsAccepted: false,
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleFieldChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentArray = (formData[field] as string[]) || []
    const updatedArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value)
    handleFieldChange(field, updatedArray)
  }

  const validateStep = (step: number) => {
    const newErrors: Partial<FormData> = {}

    if (step === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
      if (!formData.businessIndustry.trim()) newErrors.businessIndustry = "Industry/Sector is required"
      if (!formData.businessAddress.trim()) newErrors.businessAddress = "Business address is required"
      if (!formData.businessEmail.trim()) newErrors.businessEmail = "Business email is required"
      if (!formData.businessPhone.trim()) newErrors.businessPhone = "Telephone is required"
    } else if (step === 2) {
      if (!formData.primaryContact.trim()) newErrors.primaryContact = "Primary contact name is required"
      if (!formData.contactPosition.trim()) newErrors.contactPosition = "Position/Role is required"
      if (!formData.contactPhone.trim()) newErrors.contactPhone = "Phone/WhatsApp is required"
      if (!formData.contactEmail.trim()) newErrors.contactEmail = "Email is required"
    } else if (step === 3) {
      if (!formData.numberOfEmployees) newErrors.numberOfEmployees = "Number of employees is required"
      if (!formData.monthlyRevenue) newErrors.monthlyRevenue = "Monthly revenue is required"
    } else if (step === 4) {
      if (!formData.bookkeepingMethod) newErrors.bookkeepingMethod = "Please select your bookkeeping method"
      if (!formData.currentBookkeeper) newErrors.currentBookkeeper = "Please select an option"
      if (formData.servicesInterested.length === 0)
        newErrors.servicesInterested = "Please select at least one service" as unknown as string[]
    } else if (step === 5) {
      if (formData.communicationPreference.length === 0)
        newErrors.communicationPreference = "Please select at least one communication method" as unknown as string[]
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
    if (!validateStep(5)) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/kolat-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "Finance Freedom Page",
          submittedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          onClose()
          setCurrentStep(1)
          setFormData({
            businessName: "",
            businessIndustry: "",
            businessAddress: "",
            businessEmail: "",
            businessPhone: "",
            primaryContact: "",
            contactPosition: "",
            contactPhone: "",
            contactEmail: "",
            numberOfEmployees: "",
            monthlyRevenue: "",
            bookkeepingMethod: "",
            currentBookkeeper: "",
            financialChallenges: "",
            servicesInterested: [],
            communicationPreference: [],
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

  const progress = (currentStep / 5) * 100

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
                  <h2 className="text-2xl font-bold text-white">Bookkeeping Services Inquiry</h2>
                  <p className="text-white/70 text-sm mt-1">Step {currentStep} of 5</p>
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
                  initial={{ width: "20%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* STEP 1: Business Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Business Information</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold">Business Name *</Label>
                        <Input
                          value={formData.businessName}
                          onChange={(e) => handleFieldChange("businessName", e.target.value)}
                          className={`mt-2 ${errors.businessName ? "border-red-500" : ""}`}
                          placeholder="Your Business Name"
                        />
                        {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Industry/Sector *</Label>
                        <Input
                          value={formData.businessIndustry}
                          onChange={(e) => handleFieldChange("businessIndustry", e.target.value)}
                          className={`mt-2 ${errors.businessIndustry ? "border-red-500" : ""}`}
                          placeholder="e.g., Retail, Manufacturing, Services"
                        />
                        {errors.businessIndustry && (
                          <p className="text-red-500 text-sm mt-1">{errors.businessIndustry}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Business Address *</Label>
                        <Input
                          value={formData.businessAddress}
                          onChange={(e) => handleFieldChange("businessAddress", e.target.value)}
                          className={`mt-2 ${errors.businessAddress ? "border-red-500" : ""}`}
                          placeholder="Full business address"
                        />
                        {errors.businessAddress && (
                          <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Business Email *</Label>
                        <Input
                          type="email"
                          value={formData.businessEmail}
                          onChange={(e) => handleFieldChange("businessEmail", e.target.value)}
                          className={`mt-2 ${errors.businessEmail ? "border-red-500" : ""}`}
                          placeholder="business@company.com"
                        />
                        {errors.businessEmail && <p className="text-red-500 text-sm mt-1">{errors.businessEmail}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Telephone *</Label>
                        <Input
                          value={formData.businessPhone}
                          onChange={(e) => handleFieldChange("businessPhone", e.target.value)}
                          className={`mt-2 ${errors.businessPhone ? "border-red-500" : ""}`}
                          placeholder="+232 88 000-000"
                        />
                        {errors.businessPhone && <p className="text-red-500 text-sm mt-1">{errors.businessPhone}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Contact Information */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold">Primary Contact Person *</Label>
                        <Input
                          value={formData.primaryContact}
                          onChange={(e) => handleFieldChange("primaryContact", e.target.value)}
                          className={`mt-2 ${errors.primaryContact ? "border-red-500" : ""}`}
                          placeholder="Full name"
                        />
                        {errors.primaryContact && (
                          <p className="text-red-500 text-sm mt-1">{errors.primaryContact}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Position/Role *</Label>
                        <Input
                          value={formData.contactPosition}
                          onChange={(e) => handleFieldChange("contactPosition", e.target.value)}
                          className={`mt-2 ${errors.contactPosition ? "border-red-500" : ""}`}
                          placeholder="e.g., Business Owner, Manager"
                        />
                        {errors.contactPosition && (
                          <p className="text-red-500 text-sm mt-1">{errors.contactPosition}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Phone/WhatsApp No. *</Label>
                        <Input
                          value={formData.contactPhone}
                          onChange={(e) => handleFieldChange("contactPhone", e.target.value)}
                          className={`mt-2 ${errors.contactPhone ? "border-red-500" : ""}`}
                          placeholder="+232 88 000-000"
                        />
                        {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold">Email Address *</Label>
                        <Input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => handleFieldChange("contactEmail", e.target.value)}
                          className={`mt-2 ${errors.contactEmail ? "border-red-500" : ""}`}
                          placeholder="contact@email.com"
                        />
                        {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Business Financial Overview */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Business Financial Overview</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">Number of Employees *</Label>
                        <select
                          value={formData.numberOfEmployees}
                          onChange={(e) => handleFieldChange("numberOfEmployees", e.target.value)}
                          className={`w-full px-4 py-2 border-2 rounded-lg font-medium text-gray-900 bg-white cursor-pointer transition-colors ${
                            errors.numberOfEmployees ? "border-red-500" : "border-[#177fc9] hover:border-[#0e5f9e]"
                          } focus:outline-none appearance-none`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23177fc9' strokeWidth='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 0.75rem center",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2.5rem",
                          }}
                        >
                          <option value="">Select number of employees...</option>
                          <option value="Just me">Just me</option>
                          <option value="2 to 4">2 to 4</option>
                          <option value="5 to 9">5 to 9</option>
                          <option value="10 to 19">10 to 19</option>
                          <option value="20 to 49">20 to 49</option>
                          <option value="50+">50+</option>
                        </select>
                        {errors.numberOfEmployees && (
                          <p className="text-red-500 text-sm mt-1">{errors.numberOfEmployees}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">Current Monthly Revenue *</Label>
                        <RadioGroup
                          value={formData.monthlyRevenue}
                          onValueChange={(value) => handleFieldChange("monthlyRevenue", value)}
                          className="space-y-3"
                        >
                          {[
                            "Less than SLL 5,000",
                            "SLL 5,000 - SLL 20,000",
                            "SLL 20,001 - SLL 100,000",
                            "SLL 100,001 - SLL 500,000",
                            "Over SLL 500,000",
                          ].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={`revenue-${option}`} />
                              <Label htmlFor={`revenue-${option}`} className="font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.monthlyRevenue && (
                          <p className="text-red-500 text-sm mt-1">{errors.monthlyRevenue}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Service Requirements */}
                  {currentStep === 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Service Requirements</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          Which services are you interested in? (Select all that apply) *
                        </Label>
                        <div className="space-y-3">
                          {[
                            "Bookkeeping, Financial Reporting",
                            "Business Performance Analysis and Advisory",
                            "Credit/Loan Readiness",
                          ].map((service) => (
                            <div key={service} className="flex items-center space-x-3">
                              <Checkbox
                                id={`service-${service}`}
                                checked={formData.servicesInterested.includes(service)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("servicesInterested", service, checked === true)
                                }
                              />
                              <Label htmlFor={`service-${service}`} className="font-normal cursor-pointer">
                                {service}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.servicesInterested && (
                          <p className="text-red-500 text-sm mt-2">{errors.servicesInterested}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          What are your current bookkeeping methods? *
                        </Label>
                        <RadioGroup
                          value={formData.bookkeepingMethod}
                          onValueChange={(value) => handleFieldChange("bookkeepingMethod", value)}
                          className="space-y-3"
                        >
                          {[
                            "Manual (paper records)",
                            "Excel Sheet",
                            "Accounting Software (QuickBooks, Xero, etc.)",
                            "No formal bookkeeping system",
                          ].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={`method-${option}`} />
                              <Label htmlFor={`method-${option}`} className="font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.bookkeepingMethod && (
                          <p className="text-red-500 text-sm mt-1">{errors.bookkeepingMethod}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          Do you have someone currently keeping your books? *
                        </Label>
                        <RadioGroup
                          value={formData.currentBookkeeper}
                          onValueChange={(value) => handleFieldChange("currentBookkeeper", value)}
                          className="space-y-3"
                        >
                          {["Yes", "No"].map((option) => (
                            <div key={option} className="flex items-center space-x-3">
                              <RadioGroupItem value={option} id={`bookkeeper-${option}`} />
                              <Label htmlFor={`bookkeeper-${option}`} className="font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.currentBookkeeper && (
                          <p className="text-red-500 text-sm mt-1">{errors.currentBookkeeper}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: Additional Information & Submission */}
                  {currentStep === 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h3>

                      <div>
                        <Label className="text-gray-700 font-semibold">
                          What are your biggest financial management challenges?
                        </Label>
                        <Textarea
                          value={formData.financialChallenges}
                          onChange={(e) => handleFieldChange("financialChallenges", e.target.value)}
                          className="mt-2"
                          placeholder="Describe your main challenges..."
                          rows={3}
                          maxLength={500}
                        />
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold mb-3 block">
                          Preferred Mode of Communication (Select all that apply) *
                        </Label>
                        <div className="space-y-3">
                          {["Email", "Phone Call", "WhatsApp"].map((method) => (
                            <div key={method} className="flex items-center space-x-3">
                              <Checkbox
                                id={`comm-${method}`}
                                checked={formData.communicationPreference.includes(method)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("communicationPreference", method, checked === true)
                                }
                              />
                              <Label htmlFor={`comm-${method}`} className="font-normal cursor-pointer">
                                {method}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {errors.communicationPreference && (
                          <p className="text-red-500 text-sm mt-2">{errors.communicationPreference}</p>
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
                            I confirm that the information provided is accurate, and I agree to the terms of service
                            for the Bookkeeping Services Product. *
                          </Label>
                        </div>
                        {errors.termsAccepted && <p className="text-red-500 text-sm mt-2">{errors.termsAccepted}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
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
                    {currentStep < 5 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-[#177fc9] hover:bg-[#0e5f9e] text-white"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#177fc9] hover:bg-[#0e5f9e] text-white disabled:opacity-50"
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