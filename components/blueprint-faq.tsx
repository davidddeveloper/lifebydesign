"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function BlueprintFAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(-1)

  const faqs = [
    {
      question: "1. How is this different from other business coaching?",
      answer:
        "Most coaches give generic advice: 'Do more marketing' or 'Improve your offer.' We use the Theory of Constraints to identify your specific bottleneck, then give you a tactical roadmap to eliminate it in 90 days. You're not getting general business advice—you're getting constraint-specific solutions based on data from your business.",
    },
    {
      question: "2. What if I'm not sure which constraint I have?",
      answer:
        "That's exactly why the workshop exists. In Day 1, you'll learn the 5 Levers Framework, do a structured diagnostic, score each lever 0-10, and validate with peer feedback. By the end of Day 1, you'll know exactly what's holding you back. If you still don't, we'll refund your $100.",
    },
    {
      question: "3. Can I do the workshop without joining the 90-day program?",
      answer:
        "Yes, absolutely. The workshop is a standalone product. You'll leave with the complete framework, your constraint identified, a 90-day plan outline, and Week 1 action checklist. The 90-day program is optional—for those who want expert coaching and accountability to ensure execution.",
    },
    {
      question: "4. What's the success rate of the 90-day program?",
      answer:
        "80% of participants who complete all 6 coaching calls see measurable progress on their constraint. Average revenue increase: 30-50% within 90 days. The 20% who don't succeed typically fall into two categories: (1) They didn't attend all calls, or (2) They didn't implement the plan. That's why we have a guarantee—if you do the work and see zero results, you get refunded.",
    },
    {
      question: "5. What if my business is too small (or too big) for this?",
      answer:
        "The 5 Levers Framework works at any stage. Whether you're doing Le 5M/month or Le 100M/month, every business has these 5 levers. Most of our clients are in the Le 20-60M/month range, but we've worked with businesses from Le 10M to Le 150M/month. If you have revenue and you're stuck, this will work.",
    },
    {
      question: "6. How much time do I need to commit each week?",
      answer:
        "During Workshop (Week 1-2): 2 full days (8:30 AM - 5:00 PM Friday-Saturday). During 90-Day Program (Weeks 2-12): 45 minutes every 2 weeks (coaching calls) + 5-10 hours/week (implementing your plan). The work doesn't require extra time—it's about redirecting your current effort toward the highest-leverage constraint instead of random busy work.",
    },
    {
      question: "7. What happens after 90 days?",
      answer:
        "Two things: (1) Your constraint is eliminated (or dramatically improved), and (2) You've learned a repeatable method you can use forever. Most clients then either run another 90-day sprint on their next constraint (self-directed), or join another cohort to tackle the next bottleneck with coaching. The framework becomes a tool you own.",
    },
    {
      question: "8. Do you offer refunds?",
      answer:
        "Yes. Both products have guarantees. Workshop Guarantee: Attend both days and don't get a clear constraint + 90-day plan? Full refund—no questions asked. 90-Day Program Guarantee: Attend all 6 calls + implement your plan + see zero improvement after 90 days? Full refund. We can make these guarantees because the system works when you work it.",
    },
    {
      question: "9. Is this online or in-person?",
      answer:
        "Currently in-person in [Location, Sierra Leone]. We run workshops monthly on Friday-Saturday. The 90-day program includes: in-person workshop kickoff (2 days), virtual coaching calls (Zoom or WhatsApp video, bi-weekly), and WhatsApp support (text-based, daily access).",
    },
    {
      question: "10. How many people are in each cohort?",
      answer:
        "Workshop: Up to 25 participants. 90-Day Program: Only 10 spots per cohort (to maintain quality). We limit 90-day cohort size so each participant gets personalized attention and troubleshooting.",
    },
    {
      question: "11. What if I can't attend the next workshop date?",
      answer:
        "We run workshops monthly, so you can join the following month. To reserve your spot for a future workshop, email us at [email] with your preferred date.",
    },
    {
      question: "12. Can I bring my team to the workshop?",
      answer:
        "Yes! Many founders bring their co-founder, operations manager, or head of sales/marketing. Group rates available: 2 people: $180 (save $20), 3+ people: $75/person. Email [email] for group registration.",
    },
  ]
//"Our core program is 90 days, broken into three phases: Foundation (Weeks 1-4), Traction (Weeks 5-8), and Acceleration (Weeks 9-12). Most participants see measurable improvement by Week 8 and hit their breakthrough milestone by Day 90.",
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#177fc9] transition-colors"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-black text-gray-900 text-left">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
