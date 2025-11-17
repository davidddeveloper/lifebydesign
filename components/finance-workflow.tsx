"use client"

import { motion } from "framer-motion"

export function FinanceWorkflow() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const phases = [
    {
      phase: "Phase I",
      title: "Data Collection & Audit",
      timeframe: "Days 1-7",
      action: "Collect data + system audit. Complete review of existing records and set up initial structure.",
      result: "Clarity on the current financial state.",
    },
    {
      phase: "Phase II",
      title: "System Configuration",
      timeframe: "Days 8-15",
      action:
        "Create a new account on a professional accounting software and set the Chart of Accounts. Begin connecting Essential Bank and Mobile Money accounts.",
      result: "System foundation and professional structure established.",
    },
    {
      phase: "Phase III",
      title: "Record Import & Reconciliation",
      timeframe: "Days 16-25",
      action:
        "Import and organize historical records for the required clean-up period. Complete initial reconciliation of imported data.",
      result: "Organised books with a verified foundation.",
    },
    {
      phase: "Phase IV",
      title: "Final Reporting & Roadmap",
      timeframe: "Days 26-30",
      action:
        "Complete final clean-up and reconciliation. Deliver comprehensive financial report (P&L, Balance Sheet, Cash Flow). Deliver savings/loan roadmap.",
      result: "Immediate ROI visible through clean books and clear financial strategy.",
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-center" variants={itemVariants}>
            30-Day Delivery Workflow
          </motion.h2>

          <motion.p className="text-center text-gray-600 mb-12" variants={itemVariants}>
            Structured onboarding over four weeks ensures thorough setup and organized start.
          </motion.p>

          <div className="space-y-6">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                className="grid md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-lg"
                variants={itemVariants}
              >
                <div>
                  <div className="text-sm font-semibold text-[#177fc9] uppercase tracking-wider">{phase.phase}</div>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">{phase.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{phase.timeframe}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Action:</span> {phase.action}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Result:</span> {phase.result}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
