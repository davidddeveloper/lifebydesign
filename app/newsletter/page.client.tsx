"use client"

import { NewsletterForm } from "@/components/newsletter/newsletter-form"
import { Header } from "@/components/Header"

export default function NewsletterPageClient() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 bg-gray-100 rounded-full">
              Weekly newsletter
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Stay sharp in under 5 minutes</h1>
            <p className="text-sm text-gray-600">One concise email each week. Zero fluff. Unsubscribe anytime.</p>
          </div>

          <NewsletterForm variant="inline" />

          <p className="text-xs text-gray-500">No spam. Just signal.</p>
        </div>
      </div>
    </>
  )
}
