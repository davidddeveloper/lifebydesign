// components/AuditForm.tsx
"use client"

import Link from "next/link"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const STORAGE_KEY = "sbs_audit_form_progress"
const STORAGE_STEP_KEY = "sbs_audit_form_step"

interface AuditFormProps {
  onSubmit: (data: any) => void
}

// Initial form state - extracted for reuse
const initialFormData = {
    // Basic Info
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    industry: "",
    yearsInBusiness: "",
    monthlyRevenue: "",
    numberOfCustomers: "",
    teamSize: "",

    // Lever 1: WHO
    idealCustomer: "",
    customerTypes: "",
    newCustomersLastMonth: "",
    customerSource: [],
    conversionRate: "",
    biggestProblem: "",
    turnDownBadFits: "",

    // Lever 2: WHAT
    mainProblemSolved: "",
    solution: "",
    avgTransactionValue: "",
    pricingVsCompetitors: "",
    customerSatisfaction: "",
    referralFrequency: "",
    doublePriceScenario: "",
    proofLevel: "",

    // Lever 3: HOW YOU SELL
    closingMethod: [],
    hasSalesScript: "",
    salesConversations: "",
    conversionToCustomer: "",
    timeToClose: "",
    reasonsNotBuying: "",
    followUpSystem: "",

    // Lever 4: HOW THEY FIND YOU
    trafficReferrals: "",
    trafficSocial: "",
    trafficAds: "",
    trafficPartnerships: "",
    trafficWalkIns: "",
    trafficOther: "",
    primarySocialPlatform: "",
    postingFrequency: "",
    weeklyReach: "",
    monthlyLeads: "",
    leadPredictability: "",
    hasLeadMagnet: "",

    // Lever 5: HOW YOU DELIVER
    businessWithoutYou: "",
    writtenProcedures: "",
    canDelegateEasily: "",
    repeatPurchases: "",
    hasUpsells: "",
    trackNumbers: "",
    profitMargin: "",
    hoursPerWeek: "",
    timeOnVsIn: "",

    // Final Questions
    topChallenge: "",
    oneThingToFix: "",
    twelveMonthGoal: "",
}

export default function AuditForm({ onSubmit }: AuditFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialFormData)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [hasRestoredData, setHasRestoredData] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load saved progress on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY)

      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
        setHasRestoredData(true)
      }

      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10)
        if (!isNaN(parsedStep) && parsedStep >= 0 && parsedStep < 7) {
          setCurrentStep(parsedStep)
        }
      }
    } catch (error) {
      console.error("Error restoring form progress:", error)
    }
  }, [])

  // Debounced save to localStorage
  const saveProgress = useCallback((data: typeof formData, step: number) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        localStorage.setItem(STORAGE_STEP_KEY, step.toString())
      } catch (error) {
        console.error("Error saving form progress:", error)
      }
    }, 500) // 500ms debounce
  }, [])

  // Clear saved progress
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_STEP_KEY)
    } catch (error) {
      console.error("Error clearing form progress:", error)
    }
  }, [])

  // Handle clearing and starting over
  const handleClearAndStartOver = () => {
    clearProgress()
    setFormData(initialFormData)
    setCurrentStep(0)
    setShowClearConfirm(false)
    setHasRestoredData(false)
    window.scrollTo(0, 0)
  }

  const steps = [
    { title: "Basic Info", short: "Info", fields: "basic", intro: "" },
    { title: "Your Market", short: "Market", fields: "who", intro: "Let's look at who you're selling to and whether you're reaching the right people." },
    { title: "Your Offer", short: "Offer", fields: "what", intro: "Now let's look at what you're selling and whether it's priced and packaged to grow." },
    { title: "Your Traffic", short: "Traffic", fields: "traffic", intro: "This is about how consistently people find out you exist." },
    { title: "Your Sales", short: "Sales", fields: "sell", intro: "Let's look at what happens between someone showing interest and actually paying you." },
    { title: "Your Operations", short: "Ops", fields: "deliver", intro: "This is about whether your business can grow without burning you out." },
    { title: "Almost Done", short: "Final", fields: "final", intro: "Three final questions to make your diagnosis as accurate as possible." },
  ]

  const stepDescriptions: Record<string, string> = {
    basic: "Share your business basics—contact info, industry, revenue, and team size—so the audit is tailored to you.",
    who: "Clarify who you serve and how well they convert to uncover positioning and targeting gaps.",
    what: "Describe the problem you solve, your offer, pricing, and proof to gauge value strength.",
    traffic: "Outline how people find you, which channels work, and lead flow to assess predictability.",
    sell: "Explain your sales process, scripts, and follow-up so we can spot where deals stall.",
    deliver: "Detail operations, delegation, and repeat purchases to surface delivery bottlenecks.",
    final: "Call out your top challenge and 12-month goal so recommendations can be prioritized.",
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      saveProgress(newData, currentStep)
      return newData
    })
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      saveProgress(formData, newStep)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      saveProgress(formData, newStep)
      window.scrollTo(0, 0)
    }
  }

  const handleGoToStep = (index: number) => {
    setCurrentStep(index)
    saveProgress(formData, index)
    window.scrollTo(0, 0)
  }

  const isFormValid = () => {
    // Check Basic Info - at least one field filled
    const hasBasicInfo =
      formData.businessName &&
      formData.ownerName &&
      formData.phone &&
      formData.email &&
      formData.industry &&
      formData.yearsInBusiness &&
      formData.monthlyRevenue &&
      formData.numberOfCustomers &&
      formData.teamSize

    // Check WHO - at least one field filled
    const hasWhoInfo =
      formData.idealCustomer &&
      formData.customerTypes &&
      formData.newCustomersLastMonth &&
      formData.conversionRate &&
      formData.biggestProblem &&
      formData.turnDownBadFits

    // Check WHAT - at least one field filled
    const hasWhatInfo =
      formData.mainProblemSolved &&
      formData.solution &&
      formData.avgTransactionValue &&
      formData.pricingVsCompetitors &&
      formData.customerSatisfaction &&
      formData.referralFrequency &&
      formData.doublePriceScenario &&
      formData.proofLevel

    // Check HOW THEY FIND YOU - at least one field filled
    const hasTrafficInfo =
      formData.trafficReferrals &&
      formData.trafficSocial &&
      formData.trafficAds &&
      formData.trafficPartnerships &&
      formData.trafficWalkIns &&
      formData.trafficOther &&
      formData.primarySocialPlatform &&
      formData.postingFrequency &&
      formData.weeklyReach &&
      formData.monthlyLeads &&
      formData.leadPredictability &&
      formData.hasLeadMagnet

    // Check HOW YOU SELL - at least one field filled
    const hasSellInfo =
      formData.hasSalesScript &&
      formData.salesConversations &&
      formData.conversionToCustomer &&
      formData.timeToClose &&
      formData.reasonsNotBuying &&
      formData.followUpSystem

    // Check HOW YOU DELIVER - at least one field filled
    const hasDeliverInfo =
      formData.businessWithoutYou &&
      formData.writtenProcedures &&
      formData.canDelegateEasily &&
      formData.repeatPurchases &&
      formData.hasUpsells &&
      formData.trackNumbers &&
      formData.profitMargin &&
      formData.hoursPerWeek &&
      formData.timeOnVsIn

    // Check Final Questions - at least one field filled
    const hasFinalInfo = formData.topChallenge && formData.oneThingToFix && formData.twelveMonthGoal

    return hasBasicInfo && hasWhoInfo && hasWhatInfo && hasSellInfo && hasTrafficInfo && hasDeliverInfo && hasFinalInfo
  }

  const handleSubmit = () => {
    // Clear saved progress on successful submission
    clearProgress()
    onSubmit(formData)
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#177fc9] hover:text-[#0f5b90] transition-colors"
          >
            <span aria-hidden>←</span>
            Back home
          </Link>
          {hasRestoredData && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear & Start Over
            </button>
          )}
        </div>

        {/* Progress Restored Notification */}
        <AnimatePresence>
          {hasRestoredData && currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center gap-2"
            >
              <span>✓</span>
              <span>Your previous progress has been restored. Continue where you left off!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowClearConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Start Over?</h3>
                <p className="text-gray-600 mb-4">
                  This will clear all your progress and start the audit from the beginning.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAndStartOver}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            Business Constraint <br />
            <span className="text-[#177fc9]">Audit</span>
          </motion.h1>
          <p className="text-xl text-gray-600 mb-2">
            Find the #1 bottleneck keeping your revenue stuck — and exactly what to fix first
          </p>
          <p className="text-gray-500">Takes 15 minutes · Get your diagnosis instantly</p>
        </div>

        {/* Context Block */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-5 mb-8 text-center"
        >
          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            Your business doesn't have 10 problems. It has <strong>ONE constraint</strong> that's blocking everything else. This audit scores your business across 5 growth levers, pinpoints your weakest link, and tells you exactly where to focus your next 90 days.
          </p>
          <p className="text-xs text-[#177fc9] font-semibold">Used by 3,000+ businesses across Sierra Leone.</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-semibold text-[#177fc9]">{Math.round(progress)}% Complete</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#177fc9] to-[#42adff] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleGoToStep(index)}
                className={`text-xs text-left transition-colors cursor-pointer ${
                  index === currentStep
                    ? "text-[#177fc9] font-semibold"
                    : index < currentStep
                      ? "text-[#0f5b90]"
                      : "text-gray-400 hover:text-gray-600"
                }`}
                title={stepDescriptions[step.fields] ?? step.title}
                aria-current={index === currentStep ? "step" : undefined}
              >
                <span className="block md:hidden">{step.short}</span>
                <span className="hidden md:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <span className="mr-3">{getStepIcon(currentStep)}</span>
            {steps[currentStep].title}
          </h2>
          {steps[currentStep].intro && (
            <p className="text-gray-500 text-base mb-6">{steps[currentStep].intro}</p>
          )}
          {!steps[currentStep].intro && <div className="mb-6" />}

          <AnimatePresence mode="wait">
            {currentStep === 0 && <BasicInfoStep formData={formData} onChange={handleInputChange} />}
            {currentStep === 1 && <WhoStep formData={formData} onChange={handleInputChange} />}
            {currentStep === 2 && <WhatStep formData={formData} onChange={handleInputChange} />}
            {currentStep === 3 && <TrafficStep formData={formData} onChange={handleInputChange} />}
            {currentStep === 4 && <SellStep formData={formData} onChange={handleInputChange} />}
            {currentStep === 5 && <DeliverStep formData={formData} onChange={handleInputChange} />}
            {currentStep === 6 && <FinalStep formData={formData} onChange={handleInputChange} />}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              ← Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                  isFormValid()
                    ? "bg-gradient-to-r from-[#177fc9] to-[#42adff] text-white hover:from-[#42adff] hover:to-[#177fc9] transform hover:scale-105 shadow-lg cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                🎯 Get My Results
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-[#177fc9] to-[#42adff] text-white rounded-lg font-semibold hover:from-[#42adff] hover:to-[#177fc9] transition-all"
              >
                Next →
              </button>
            )}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🔒 Your data is secure • 🎁 100% Free • ⚡ Instant results</p>
        </div>
      </div>
    </div>
  )
}

function getStepIcon(step: number) {
  const icons = ["📋", "👥", "💎", "📢", "🤝", "⚙️", "🎯"]
  return icons[step]
}

// Individual Step Components
function BasicInfoStep({ formData, onChange }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <FormField
        label="Business Name"
        value={formData.businessName}
        onChange={(v: any) => onChange("businessName", v)}
        placeholder="e.g., Joe's Accounting Services"
        required
      />
      <FormField
        label="Your Name"
        value={formData.ownerName}
        onChange={(v: any) => onChange("ownerName", v)}
        placeholder="e.g., Joe Abass"
        required
      />
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          label="Phone/WhatsApp"
          value={formData.phone}
          onChange={(v: any) => onChange("phone", v)}
          placeholder="+232 30 600 600"
          required
        />
        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(v: any) => onChange("email", v)}
          placeholder="joe@example.com"
          required
        />
      </div>
      <FormSelect
        label="Industry"
        value={formData.industry}
        onChange={(v: any) => onChange("industry", v)}
        options={[
          "Retail",
          "Restaurant/Food",
          "Professional Services",
          "Technology",
          "Construction",
          "Healthcare",
          "Education",
          "Manufacturing",
          "Transportation",
          "Agriculture",
          "Real Estate",
          "Financial Services",
          "Beauty/Salon",
          "Entertainment",
          "Other",
        ]}
        required
      />
      <div className="grid md:grid-cols-3 gap-6">
        <FormField
          label="Years in Business"
          type="number"
          value={formData.yearsInBusiness}
          onChange={(v: any) => onChange("yearsInBusiness", v)}
          placeholder="e.g., 3"
          required
        />
        <FormField
          label="Number of Customers"
          type="number"
          value={formData.numberOfCustomers}
          onChange={(v: any) => onChange("numberOfCustomers", v)}
          placeholder="e.g., 5"
          required
        />
        <FormField
          label="Monthly Revenue (New Leones / SLE)"
          type="number"
          value={formData.monthlyRevenue}
          onChange={(v: any) => onChange("monthlyRevenue", v)}
          placeholder="e.g., 20000"
          helpText="Enter in New Leones (SLE). Last 3 months average."
          required
        />
        <FormField
          label="Team Size"
          type="number"
          value={formData.teamSize}
          onChange={(v: any) => onChange("teamSize", v)}
          placeholder="e.g., 5"
          required
        />
      </div>
    </motion.div>
  )
}

function WhoStep({ formData, onChange }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <FormField
        label="Who is your ideal customer? Describe them in one sentence."
        value={formData.idealCustomer}
        onChange={(v: any) => onChange("idealCustomer", v)}
        placeholder="e.g., Manufacturing companies in Freetown with 10+ employees"
        multiline
        required
      />
      <FormRadio
        label="How many different types of customers do you serve?"
        value={formData.customerTypes}
        onChange={(v: any) => onChange("customerTypes", v)}
        options={[
          { value: "1-2", label: "1-2 (focused)" },
          { value: "3-5", label: "3-5 (somewhat focused)" },
          { value: "6+", label: "6+ (serving everyone)" },
        ]}
        required
      />
      <FormRadio
        label="How many NEW customers did you get last month?"
        value={formData.newCustomersLastMonth}
        onChange={(v: any) => onChange("newCustomersLastMonth", v)}
        options={[
          { value: "0-5", label: "0-5" },
          { value: "6-10", label: "6-10" },
          { value: "11-20", label: "11-20" },
          { value: "20+", label: "20+" },
        ]}
        required
      />
      <FormRadio
        label="Out of 10 people who learn about your business, how many become customers?"
        value={formData.conversionRate}
        onChange={(v: any) => onChange("conversionRate", v)}
        options={[
          { value: "0-1", label: "0-1 (less than 10%)" },
          { value: "2-3", label: "2-3 (20-30%)" },
          { value: "4-5", label: "4-5 (40-50%)" },
          { value: "6+", label: "6+ (60%+)" },
        ]}
        required
      />
      <FormField
        label="Can you describe your ideal customer's biggest problem in one sentence?"
        value={formData.biggestProblem}
        onChange={(v: any) => onChange("biggestProblem", v)}
        placeholder="e.g., They waste too much time on manual inventory tracking"
        multiline
        required
      />
      <FormRadio
        label="Do you turn down customers who aren't a good fit?"
        value={formData.turnDownBadFits}
        onChange={(v: any) => onChange("turnDownBadFits", v)}
        options={[
          { value: "never", label: "Never (we need the money)" },
          { value: "sometimes", label: "Sometimes (if they're really bad)" },
          { value: "often", label: "Often (we're selective)" },
          { value: "always", label: "Always (we only work with ideal clients)" },
        ]}
        required
      />
    </motion.div>
  )
}

function WhatStep({ formData, onChange }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <FormField
        label="What is the main problem you solve for customers?"
        value={formData.mainProblemSolved}
        onChange={(v: any) => onChange("mainProblemSolved", v)}
        placeholder="e.g., We help them reduce inventory waste by 30%"
        multiline
        required
      />
      <FormField
        label="What is your solution?"
        value={formData.solution}
        onChange={(v: any) => onChange("solution", v)}
        placeholder="e.g., Monthly inventory audits + automated tracking system"
        multiline
        required
      />
      <FormRadio
        label="What is your average transaction value?"
        value={formData.avgTransactionValue}
        onChange={(v: any) => onChange("avgTransactionValue", v)}
        options={[
          { value: "under_1m", label: "Under NLe 1M ($40)" },
          { value: "1m-5m", label: "NLe 1M-5M ($40-$200)" },
          { value: "5m-15m", label: "NLe 5M-15M ($200-$600)" },
          { value: "15m-50m", label: "NLe 15M-50M ($600-$2,000)" },
          { value: "over_50m", label: "Over NLe 50M ($2,000+)" },
        ]}
        required
      />
      <FormRadio
        label="Compared to competitors, your prices are:"
        value={formData.pricingVsCompetitors}
        onChange={(v: any) => onChange("pricingVsCompetitors", v)}
        options={[
          { value: "much_lower", label: "Much lower (50%+ below)" },
          { value: "lower", label: "Lower (20-50% below)" },
          { value: "similar", label: "Similar (within 20%)" },
          { value: "higher", label: "Higher (20-50% above)" },
          { value: "much_higher", label: "Much higher (50%+ above)" },
        ]}
        required
      />
      <FormRadio
        label="What percentage of customers are satisfied with results?"
        value={formData.customerSatisfaction}
        onChange={(v: any) => onChange("customerSatisfaction", v)}
        options={[
          { value: "less_50", label: "Less than 50%" },
          { value: "50-70", label: "50-70%" },
          { value: "70-90", label: "70-90%" },
          { value: "90-100", label: "90-100%" },
        ]}
        required
      />
      <FormRadio
        label="Do customers refer others to you?"
        value={formData.referralFrequency}
        onChange={(v: any) => onChange("referralFrequency", v)}
        options={[
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely (1-2 per year)" },
          { value: "sometimes", label: "Sometimes (1-2 per quarter)" },
          { value: "often", label: "Often (1+ per month)" },
        ]}
        required
      />
        <FormRadio
          label="If you doubled your prices tomorrow, what would happen?"
          value={formData.doublePriceScenario}
          onChange={(v: any) => onChange("doublePriceScenario", v)}
          options={[
            { value: "lose_all", label: "We'd lose all our customers" },
            { value: "lose_most", label: "We'd lose most customers" },
            { value: "lose_some", label: "We'd lose some, but keep core clients" },
            { value: "nothing", label: "Nothing - we're worth it" },
            { value: "still_value", label: "Customers would still see it as good value" },
          ]}
          required
        />
      <FormRadio
        label="Do you have proof your solution works? (testimonials, case studies, results)"
        value={formData.proofLevel}
        onChange={(v: any) => onChange("proofLevel", v)}
        options={[
          { value: "no_proof", label: "No proof" },
          { value: "some", label: "Some testimonials" },
          { value: "multiple", label: "Multiple testimonials" },
          { value: "case_studies", label: "Case studies with numbers" },
          { value: "extensive", label: "Extensive proof + results data" },
        ]}
        required
      />
    </motion.div>
  )
}

function SellStep({ formData, onChange }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <FormRadio
        label="Do you have a written sales script or process?"
        value={formData.hasSalesScript}
        onChange={(v: any) => onChange("hasSalesScript", v)}
        options={[
          { value: "wing_it", label: "No, I just wing it" },
          { value: "notes", label: "I have some notes" },
          { value: "basic", label: "Yes, I have a basic script" },
          { value: "detailed", label: "Yes, I have a detailed process I follow every time" },
        ]}
        required
      />
      <FormRadio
        label="In the last month, how many sales conversations did you have?"
        value={formData.salesConversations}
        onChange={(v: any) => onChange("salesConversations", v)}
        options={[
          { value: "0-5", label: "0-5" },
          { value: "6-10", label: "6-10" },
          { value: "11-20", label: "11-20" },
          { value: "20+", label: "20+" },
        ]}
        required
      />
      <FormRadio
        label="How many of those conversations turned into paying customers?"
        value={formData.conversionToCustomer}
        onChange={(v: any) => onChange("conversionToCustomer", v)}
        options={[
          { value: "0-10", label: "0-10%" },
          { value: "11-25", label: "11-25%" },
          { value: "26-40", label: "26-40%" },
          { value: "41+", label: "41%+" },
        ]}
        required
      />
      <FormRadio
        label="How long does it typically take from first conversation to payment?"
        value={formData.timeToClose}
        onChange={(v: any) => onChange("timeToClose", v)}
        options={[
          { value: "same_day", label: "Same day" },
          { value: "2-7days", label: "2-7 days" },
          { value: "1-4weeks", label: "1-4 weeks" },
          { value: "month+", label: "Over a month" },
        ]}
        required
      />
      <FormField
        label="What is the main reason people DON'T buy from you?"
        value={formData.reasonsNotBuying}
        onChange={(v: any) => onChange("reasonsNotBuying", v)}
        placeholder="e.g., They say it's too expensive"
        multiline
        required
      />
      <FormRadio
        label="Do you follow up with people who don't buy immediately?"
        value={formData.followUpSystem}
        onChange={(v: any) => onChange("followUpSystem", v)}
        options={[
          { value: "never", label: "Never" },
          { value: "sometimes", label: "Sometimes (if I remember)" },
          { value: "always", label: "Always (I have a system)" },
        ]}
        required
      />
    </motion.div>
  )
}

function TrafficStep({ formData, onChange }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <p className="text-sm font-bold">What percentage of your customers come from each source? *</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> The percentages below should add up to 100%
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="Referrals/Word of mouth (%)"
          type="number"
          value={formData.trafficReferrals}
          onChange={(v: any) => onChange("trafficReferrals", v)}
          placeholder="e.g., 60"
        />
        <FormField
          label="Social media (%)"
          type="number"
          value={formData.trafficSocial}
          onChange={(v: any) => onChange("trafficSocial", v)}
          placeholder="e.g., 20"
        />
        <FormField
          label="Paid advertising (%)"
          type="number"
          value={formData.trafficAds}
          onChange={(v: any) => onChange("trafficAds", v)}
          placeholder="e.g., 10"
        />
        <FormField
          label="Partnerships (%)"
          type="number"
          value={formData.trafficPartnerships}
          onChange={(v: any) => onChange("trafficPartnerships", v)}
          placeholder="e.g., 5"
        />
        <FormField
          label="Walk-ins/Physical location (%)"
          type="number"
          value={formData.trafficWalkIns}
          onChange={(v: any) => onChange("trafficWalkIns", v)}
          placeholder="e.g., 5"
        />
        <FormField
          label="Other (%)"
          type="number"
          value={formData.trafficOther}
          onChange={(v: any) => onChange("trafficOther", v)}
          placeholder="e.g., 0"
        />
      </div>
      
      <FormRadio
        label="Which social media platform do you use most for business?"
        value={formData.primarySocialPlatform}
        onChange={(v: any) => onChange("primarySocialPlatform", v)}
        options={[
          { value: "linkedin", label: "LinkedIn" },
          { value: "facebook", label: "Facebook" },
          { value: "instagram", label: "Instagram" },
          { value: "whatsapp", label: "WhatsApp Status" },
          { value: "twitter", label: "Twitter/X" },
          { value: "none", label: "None" },
        ]}
        required
      />
              
      <FormRadio
        label="How often do you post content about your business?"
        value={formData.postingFrequency}
        onChange={(v: any) => onChange("postingFrequency", v)}
        options={[
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely (less than once/week)" },
          { value: "sometimes", label: "Sometimes (1-2 times/week)" },
          { value: "consistently", label: "Consistently (3+ times/week)" },
          { value: "daily", label: "Daily" },
        ]}
        required
      />
      <FormRadio
        label="How many people see your business content each week?"
        value={formData.weeklyReach}
        onChange={(v: any) => onChange("weeklyReach", v)}
        options={[
          { value: "0-100", label: "0-100" },
          { value: "100-500", label: "100-500" },
          { value: "500-1k", label: "500-1,000" },
          { value: "1k-5k", label: "1,000-5,000" },
          { value: "5k+", label: "5,000+" },
        ]}
        required
      />
      <FormRadio
        label="How many NEW inquiries/leads do you get per month?"
        value={formData.monthlyLeads}
        onChange={(v: any) => onChange("monthlyLeads", v)}
        options={[
          { value: "0-10", label: "0-10" },
          { value: "11-25", label: "11-25" },
          { value: "26-50", label: "26-50" },
          { value: "51-100", label: "51-100" },
          { value: "100+", label: "100+" },
        ]}
        required
      />
      <FormRadio
        label="Can you predict how many leads you'll get next month?"
        value={formData.leadPredictability}
        onChange={(v: any) => onChange("leadPredictability", v)}
        options={[
          { value: "no_idea", label: "No idea (completely unpredictable)" },
          { value: "rough", label: "Rough guess (within 50%)" },
          { value: "pretty_sure", label: "Pretty sure (within 25%)" },
          { value: "very_confident", label: "Very confident (within 10%)" },
        ]}
        required
      />
      <FormRadio
        label="Do you have a lead magnet (free tool, checklist, guide) to attract customers?"
        value={formData.hasLeadMagnet}
        onChange={(v: any) => onChange("hasLeadMagnet", v)}
        options={[
          { value: "no", label: "No" },
          { value: "thinking", label: "I'm thinking about it" },
          { value: "yes_no_work", label: "Yes, but it doesn't work well" },
          { value: "yes_works", label: "Yes, and it generates leads consistently" },
        ]}
        required
      />
    </motion.div>
  )
}

function DeliverStep({ formData, onChange }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <FormRadio
        label="If you took a 1-week vacation with no phone/internet, what would happen?"
        value={formData.businessWithoutYou}
        onChange={(v: any) => onChange("businessWithoutYou", v)}
        options={[
          { value: "stop", label: "Business would completely stop" },
          { value: "major_problems", label: "Major problems would occur" },
          { value: "some_issues", label: "Some issues, but team could handle most things" },
          { value: "run_smoothly", label: "Business would run smoothly" },
        ]}
        required
      />
      <FormRadio
        label="Do you have written procedures for how to deliver your service?"
        value={formData.writtenProcedures}
        onChange={(v: any) => onChange("writtenProcedures", v)}
        options={[
          { value: "in_head", label: "No, it's all in my head" },
          { value: "basic_notes", label: "Some basic notes" },
          { value: "main_processes", label: "Yes, for main processes" },
          { value: "comprehensive", label: "Yes, comprehensive documentation" },
        ]}
        required
      />
        <FormRadio
          label="Could someone new use your procedures to deliver your service without asking you questions?"
          value={formData.canDelegateEasily}
          onChange={(v: any) => onChange("canDelegateEasily", v)}
          options={[
            { value: "no_way", label: "No way" },
            { value: "lots_questions", label: "With lots of questions" },
            { value: "minimal_questions", label: "With minimal questions" },
            { value: "yes_completely", label: "Yes, completely" },
          ]}
          required
        />
      <FormRadio
        label="How many times does the average customer buy from you?"
        value={formData.repeatPurchases}
        onChange={(v: any) => onChange("repeatPurchases", v)}
        options={[
          { value: "once", label: "Once (never come back)" },
          { value: "1-2", label: "1-2 times" },
          { value: "3-5", label: "3-5 times" },
          { value: "6+", label: "6+ times (ongoing relationship)" },
        ]}
        required
      />
      <FormRadio
        label="Do you have additional offers for existing customers? (upsells, add-ons, premium services)"
        value={formData.hasUpsells}
        onChange={(v: any) => onChange("hasUpsells", v)}
        options={[
          { value: "no", label: "No" },
          { value: "thought", label: "I've thought about it" },
          { value: "rarely_sell", label: "Yes, but rarely sell them" },
          { value: "regularly", label: "Yes, and customers regularly buy them" },
        ]}
        required
      />
      <FormRadio
        label="Do you track your key business numbers weekly? (revenue, new customers, expenses, profit)"
        value={formData.trackNumbers}
        onChange={(v: any) => onChange("trackNumbers", v)}
        options={[
          { value: "never", label: "Never" },
          { value: "sometimes", label: "Sometimes" },
          { value: "usually", label: "Usually" },
          { value: "always", label: "Always (I have a dashboard)" },
        ]}
        required
      />
      <FormRadio
        label="What was your profit margin last month? (Profit ÷ Revenue × 100)"
        value={formData.profitMargin}
        onChange={(v: any) => onChange("profitMargin", v)}
        options={[
          { value: "dont_know", label: "Don't know" },
          { value: "negative", label: "Negative (losing money)" },
          { value: "0-10", label: "0-10%" },
          { value: "11-20", label: "11-20%" },
          { value: "21-30", label: "21-30%" },
          { value: "31+", label: "31%+" },
        ]}
        required
      />
      <FormRadio
        label="How many hours per week do you personally work?"
        value={formData.hoursPerWeek}
        onChange={(v: any) => onChange("hoursPerWeek", v)}
        options={[
          { value: "under_30", label: "Under 30" },
          { value: "30-40", label: "30-40" },
          { value: "41-60", label: "41-60" },
          { value: "60+", label: "60+" },
        ]}
        required
      />
      <FormRadio
        label="What percentage of your time is spent ON the business (strategy, marketing, systems) vs IN the business (doing the work)?"
        value={formData.timeOnVsIn}
        onChange={(v: any) => onChange("timeOnVsIn", v)}
        options={[
          { value: "0-100", label: "0% ON / 100% IN (all doing)" },
          { value: "25-75", label: "25% ON / 75% IN" },
          { value: "50-50", label: "50% ON / 50% IN" },
          { value: "75-25", label: "75% ON / 25% IN" },
          { value: "100-0", label: "100% ON / 0% IN (all strategy)" },
        ]}
        required
      />
    </motion.div>
  )
}

function FinalStep({ formData, onChange }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <FormField
        label="What is your #1 business challenge right now?"
        value={formData.topChallenge}
        onChange={(v: any) => onChange("topChallenge", v)}
        placeholder="e.g., Not enough customers, low profit margins, too much work..."
        multiline
        required
      />
      <FormField
        label="If you could only fix ONE thing in your business, what would it be?"
        value={formData.oneThingToFix}
        onChange={(v: any) => onChange("oneThingToFix", v)}
        placeholder="e.g., Get more qualified leads consistently"
        multiline
        required
      />
      <FormField
        label="Where do you want your business to be in 12 months?"
        value={formData.twelveMonthGoal}
        onChange={(v: any) => onChange("twelveMonthGoal", v)}
        placeholder="e.g., Le 50M/month in revenue with a team of 10"
        multiline
        required
      />

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-3">🎉 You're Almost Done!</h3>
        <p className="text-gray-700 mb-4">In the next screen, you'll discover:</p>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Your scores on all 5 growth levers</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Your #1 constraint (the bottleneck holding you back)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>What this is costing you in lost revenue</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>A quick win you can implement today</span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

// Reusable Form Components
function FormField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  multiline = false,
  required = false,
  helpText = "",
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-[#177fc9] ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#177fc9] focus:border-transparent transition-all"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#177fc9] focus:border-transparent transition-all"
        />
      )}
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  )
}

function FormSelect({ label, value, onChange, options, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-[#177fc9] ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#177fc9] focus:border-transparent transition-all"
      >
        <option value="">-- Select --</option>
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function FormRadio({ label, value, onChange, options, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
        {required && <span className="text-[#177fc9] ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option: any) => (
          <label
            key={option.value}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
              value === option.value ? "border-[#177fc9] bg-blue-50" : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              className="mr-3 text-[#177fc9] focus:ring-[#177fc9]"
            />
            <span className={`${value === option.value ? "font-semibold text-gray-900" : "text-gray-700"}`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
