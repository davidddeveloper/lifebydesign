"use client"

import { motion } from "framer-motion"
import { FileIcon, CalendarIcon, BarcodeIcon, BookTextIcon, ShieldIcon, DollarSignIcon, PhoneIcon, HelpingHandIcon, PiggyBankIcon } from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/motion-primitives/accordion';


export function FinanceComponents() {

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

  const services = [
    /*"Zoho Books setup & configuration",*/
    "Monthly bookkeeping & reconciliation",
    "Sales, expenses, and inventory setup",
    "Monthly financial statements (P&L, Balance Sheet, Cash Flow)",
    "Loan Application Pack Preparation",
    "Loan-approval pack preparation",
    "Dedicated accountant + WhatsApp support",
    "Monthly financial review & advisory call",
    "Payroll support (Growth & VIP tiers)",
  ]

  const serviceDescriptions = [
    /*"Configure Zoho Books according to your business needs, including chart of accounts, customer and supplier setup, and initial transaction setup.",*/
    "Our team of accountants will reconcile your financials on a monthly basis, ensuring accuracy and compliance with regulatory requirements.",
    "Configure sales, expenses, and inventory tracking in Zoho Books, ensuring accurate financial reporting and compliance with regulatory requirements.",
    "Our team of accountants will prepare your monthly financial statements, including profit and loss, balance sheet, and cash flow statements.",
    "Our team of accountants will provide support with loan application pack preparation, including preparation of financial statements and projections, to support your loan application.",
    "Our team of accountants will prepare a loan-approval pack, including financial statements and projections, to support your loan application.",
    "Dedicated accountant support via WhatsApp, including responses to ad-hoc queries and support with financial management.",
    "Monthly financial review and advisory call with our team of accountants, including review of financial performance and provision of strategic advice.",
    "Payroll support, including calculation of salaries, taxes, and other deductions, as well as preparation of payslips and compliance with regulatory requirements.",
  ]

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
            {services.map((service, index) => (
              <Accordion>
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-[#177fc9] transition-colors"
                  variants={itemVariants}
                  onClick={() => {}}
                >
                    
                  <div className="">
                    <AccordionItem value={service}>
                      <AccordionTrigger className="flex gap-4 justify-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xs bg-[#177fc9] bg-opacity-10 flex items-center justify-center">
                          {index === 0 && <PiggyBankIcon className="w-8 h-8 text-white" />}
                          {index === 1 && <CalendarIcon className="w-8 h-8 text-white" />}
                          {index === 2 && <BarcodeIcon className="w-8 h-8 text-white" />}
                          {index === 3 && <BookTextIcon className="w-8 h-8 text-white" />}
                          {index === 4 && <ShieldIcon className="w-8 h-8 text-white" />}
                          {index === 5 && <FileIcon className="w-8 h-8 text-white" />}
                          {index === 6 && <DollarSignIcon className="w-8 h-8 text-white" />}
                          {index === 7 && <HelpingHandIcon className="w-8 h-8 text-white" />}
                          {index === 8 && <PhoneIcon className="w-8 h-8 text-white" />}
                          
                        </div>
                          <p className="text-gray-700 font-medium">{service}</p>
                        </AccordionTrigger>

                        <AccordionContent>
                          <p className="mt-4 text-sm text-gray-600">{serviceDescriptions[index]}</p>
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
