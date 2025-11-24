"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Job {
  id: string
  title: string
  email: string
}

interface JobApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  job: Job
}

interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  portfolio: string
  coverLetter: string
}

export function JobApplicationModal({ isOpen, onClose, job }: JobApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    portfolio: "",
    coverLetter: "",
  })
  const [errors, setErrors] = useState<Partial<ApplicationData>>({})

  const validateStep1 = () => {
    const newErrors: Partial<ApplicationData> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Partial<ApplicationData> = {}
    if (!formData.portfolio.trim()) newErrors.portfolio = "Portfolio link is required"
    if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field: keyof ApplicationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))

    // Auto-advance to step 2
    if (currentStep === 1 && field === "phone" && formData.firstName && formData.lastName && formData.email && value) {
      setTimeout(() => setCurrentStep(2), 300)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/job-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          portfolio: formData.portfolio,
          coverLetter: formData.coverLetter,
          jobTitle: job.title,
          jobId: job.id,
          submittedAt: new Date().toISOString(),
          source: "Job Application",
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          onClose()
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            portfolio: "",
            coverLetter: "",
          })
          setCurrentStep(1)
          setSubmitStatus("idle")
        }, 2000)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Application submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / 2) * 100

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
                  <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                  <p className="text-white/70 text-sm mt-1">Apply Now</p>
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
                  initial={{ width: "50%" }}
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
                    <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>

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

                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-semibold">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-700 font-semibold">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
                        placeholder="+232 76 123 456"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </motion.div>

                  {currentStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-6 border-t"
                    >
                      <h3 className="text-xl font-bold text-gray-900">Application Details</h3>

                      <div>
                        <Label htmlFor="portfolio" className="text-gray-700 font-semibold">
                          Portfolio / CV Link *
                        </Label>
                        <Input
                          id="portfolio"
                          value={formData.portfolio}
                          onChange={(e) => handleFieldChange("portfolio", e.target.value)}
                          className={`mt-1 ${errors.portfolio ? "border-red-500" : ""}`}
                          placeholder="https://yourportfolio.com or LinkedIn URL"
                        />
                        {errors.portfolio && <p className="text-red-500 text-sm mt-1">{errors.portfolio}</p>}
                      </div>

                      <div>
                        <Label htmlFor="coverLetter" className="text-gray-700 font-semibold">
                          Why do you want to join us? *
                        </Label>
                        <Textarea
                          id="coverLetter"
                          value={formData.coverLetter}
                          onChange={(e) => handleFieldChange("coverLetter", e.target.value)}
                          className={`mt-1 ${errors.coverLetter ? "border-red-500" : ""}`}
                          placeholder="Tell us why you're excited about this opportunity..."
                          rows={4}
                        />
                        {errors.coverLetter && <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>}
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full bg-[#177fc9] hover:bg-[#42adff] text-white font-bold text-lg py-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : submitStatus === "success" ? (
                            <>
                              <Check className="w-5 h-5 mr-2" />
                              Application Sent!
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
                            Thank you for applying! We'll review your application soon.
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
