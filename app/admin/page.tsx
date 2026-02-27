"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Mail, CalendarDays, ChevronRight, LayoutDashboard, LogOut } from "lucide-react"
import Image from "next/image"

const NAV_CARDS = [
  {
    href: "/admin/audits",
    icon: FileText,
    title: "Constraint Audits",
    description: "View and manage audit submissions, track status, and export reports.",
  },
  {
    href: "/admin/emails",
    icon: Mail,
    title: "Email Campaigns",
    description: "Manage contacts from audits and workshops, and send targeted campaigns.",
  },
  {
    href: "/admin/workshops",
    icon: CalendarDays,
    title: "Workshop Registrations",
    description: "Track registrations, manage payments, and communicate with attendees.",
  },
]

export default function AdminDashboardPage() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Image src="/lifebydesignlogo" alt="Logo" width={32} height={32} />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900">Admin Dashboard</span>
              <span className="hidden sm:inline text-sm text-gray-400 ml-2">· Startup Bodyshop</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Select a section below to get started.</p>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_CARDS.map(({ href, icon: Icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:border-blue-300 hover:shadow-md transition-all duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-1">{title}</h2>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 pb-8">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} startupbodyshop.com. Admin panel.
        </p>
      </footer>
    </div>
  )
}
