"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface NewsletterFormProps {
  onSuccess?: () => void
  variant?: "hero" | "inline"
}

export function NewsletterForm({ onSuccess, variant = "hero" }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim(),
          source: "Newsletter Landing Page",
          subscribedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setEmail("")
        setFirstName("")
        onSuccess?.()
      } else {
        setSubmitStatus("error")
        setError("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      setSubmitStatus("error")
      setError("Network error. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isHeroVariant = variant === "hero"

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {submitStatus === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`${
              isHeroVariant ? "bg-white/20 backdrop-blur-sm" : "bg-green-50"
            } border-2 border-green-500 rounded-2xl p-6 text-center`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className={`text-xl font-bold ${isHeroVariant ? "text-white" : "text-gray-900"} mb-2`}>
              Welcome Aboard!
            </h3>
            <p className={`${isHeroVariant ? "text-white/90" : "text-gray-600"}`}>
              Check your inbox to confirm your subscription.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="w-full"
          >
            {isHeroVariant ? (
              // Hero variant - Side by side layout
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="First Name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 h-14 px-6 text-base bg-white border-2 border-white/20 focus:border-white"
                    disabled={isSubmitting}
                  />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 h-14 px-6 text-base bg-white border-2 ${
                      error ? "border-red-500" : "border-white/20"
                    } focus:border-white`}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold text-base rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </div>
            ) : (
              // Inline variant - Stacked layout
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="First Name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 px-4"
                  disabled={isSubmitting}
                />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 px-4 ${error ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#177fc9] hover:bg-[#42adff] text-white font-bold rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

            <p
              className={`text-xs ${isHeroVariant ? "text-white/70" : "text-gray-500"} mt-3 text-center leading-relaxed`}
            >
              No spam, ever. Unsubscribe anytime. By subscribing, you agree to our{" "}
              <a href="/privacy" className="underline hover:opacity-80">
                Privacy Policy
              </a>
              .
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
