"use client"

import Link from "next/link"
import { FileText, Mail, CalendarDays, ChevronRight, Book } from "lucide-react"

const NAV_CARDS = [
  {
    href: "/admin/audits",
    icon: FileText,
    title: "Constraint Audits",
    description: "View and manage audit submissions, track status, and export reports.",
  },
  {
    href: "/admin/bookings",
    icon: Book,
    title: "Bookings",
    description: "Manage coaching session bookings, update status, and configure availability.",
  },
  {
    href: "/admin/workshops",
    icon: CalendarDays,
    title: "Workshop Registrations",
    description: "Track registrations, manage payments, and communicate with attendees.",
  },
  {
    href: "/admin/emails",
    icon: Mail,
    title: "Email Campaigns",
    description: "Manage contacts from audits and workshops, and send targeted campaigns.",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="h-full overflow-auto bg-[#F7F7F7]">
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Welcome back</h1>
          <p className="text-sm text-[#888] mt-1">Select a section below to get started.</p>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NAV_CARDS.map(({ href, icon: Icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col gap-4 hover:border-[#1A1A1A] hover:shadow-md transition-all duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center group-hover:bg-[#1A1A1A] transition-colors">
                  <Icon className="w-5 h-5 text-[#555] group-hover:text-white transition-colors" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#CCC] group-hover:text-[#1A1A1A] group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#1A1A1A] mb-1">{title}</h2>
                <p className="text-xs text-[#888] leading-relaxed">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="max-w-3xl mx-auto px-6 pb-8">
        <p className="text-xs text-[#CCC]">
          &copy; {new Date().getFullYear()} startupbodyshop.com &mdash; Admin panel
        </p>
      </footer>
    </div>
  )
}
