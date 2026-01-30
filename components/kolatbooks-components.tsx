"use client"

import { motion } from "framer-motion"
import { FileIcon, CalendarIcon, BarcodeIcon, BookTextIcon, ShieldIcon, DollarSignIcon, PhoneIcon, HelpingHandIcon, PiggyBankIcon } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/motion-primitives/accordion';


import type { DeliverablesSection } from "@/sanity/lib/types"

interface FinanceComponentsProps {
  data?: DeliverablesSection
}

export function FinanceComponents({ data }: FinanceComponentsProps) {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  const defaultServices = [
    { title: "Monthly bookkeeping & reconciliation", description: "Our team of accountants will reconcile your financials on a monthly basis, ensuring accuracy and compliance with regulatory requirements." },
    { title: "Sales, expenses, and inventory setup", description: "Configure sales, expenses, and inventory tracking using professional accounting software, ensuring accurate financial reporting and compliance with regulatory requirements." },
    { title: "Monthly financial statements (P&L, Balance Sheet, Cash Flow)", description: "Our team of accountants will prepare your monthly financial statements, including profit and loss, balance sheet, and cash flow statements." },
    { title: "Loan Application Pack Preparation", description: "Our team of accountants will provide support with loan application pack preparation, including preparation of financial statements and projections, to support your loan application." },
    { title: "Loan-approval pack preparation", description: "Our team of accountants will prepare a loan-approval pack, including financial statements and projections, to support your loan application." },
    { title: "Dedicated accountant + WhatsApp support", description: "Dedicated accountant support via WhatsApp, including responses to ad-hoc queries and support with financial management." },
    { title: "Monthly financial review & advisory call", description: "Monthly financial review and advisory call with our team of accountants, including review of financial performance and provision of strategic advice." },
    { title: "Payroll support (Growth & VIP tiers)", description: "Payroll support, including calculation of salaries, taxes, and other deductions, as well as preparation of payslips and compliance with regulatory requirements." },
  ]

  // If data.items exists, map it; otherwise use defaultServices.
  // Note: Sanity items are { title, description }.
  const displayServices = data?.items?.map(item => ({
    title: item?.title || "",
    description: item.description || ""
  })) || defaultServices

  // Helper to get icon index safely
  const getIcon = (index: number) => {
    // Modulo mostly to prevent crashing if more items than icons
    const i = index % 9
    switch (i) {
      case 0: return <PiggyBankIcon className="w-8 h-8 text-white" />
      case 1: return <CalendarIcon className="w-8 h-8 text-white" />
      case 2: return <BarcodeIcon className="w-8 h-8 text-white" />
      case 3: return <BookTextIcon className="w-8 h-8 text-white" />
      case 4: return <ShieldIcon className="w-8 h-8 text-white" />
      case 5: return <FileIcon className="w-8 h-8 text-white" />
      case 6: return <DollarSignIcon className="w-8 h-8 text-white" />
      case 7: return <HelpingHandIcon className="w-8 h-8 text-white" />
      case 8: return <PhoneIcon className="w-8 h-8 text-white" />
      default: return <BookTextIcon className="w-8 h-8 text-white" />
    }
  }

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center"
            variants={itemVariants}
          >
            What's Included
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {displayServices.map((service, index) => (
              <Accordion key={index}>
                <motion.div
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#177fc9] transition-colors"
                  variants={itemVariants}
                >

                  <div className="">
                    <AccordionItem value={service.title}>
                      <AccordionTrigger className="flex gap-4 justify-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xs bg-[#177fc9] bg-opacity-10 flex items-center justify-center">
                          {getIcon(index)}
                        </div>
                        <p className="text-gray-700 font-medium text-left">{service.title}</p>
                      </AccordionTrigger>

                      <AccordionContent>
                        <p className="mt-4 text-sm text-gray-600">{service.description}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                </motion.div>
              </Accordion>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  )
}
