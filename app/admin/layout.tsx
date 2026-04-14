"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard, FileText, Book, CalendarDays, Mail,
  PencilRuler, LogOut, Menu, X, ExternalLink, Settings,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin",           label: "Dashboard",         icon: LayoutDashboard, exact: true },
  { href: "/admin/audits",    label: "Constraint Audits", icon: FileText },
  { href: "/admin/bookings",  label: "Bookings",          icon: Book },
  { href: "/admin/workshops", label: "Workshops",         icon: CalendarDays },
  { href: "/admin/emails",    label: "Emails",            icon: Mail },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#E5E5E5]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#F0F0F0]">
        <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
          <Image src="/lifebydesignlogo.png" alt="Logo" width={28} height={28} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-[#1A1A1A] leading-tight truncate">Startup Bodyshop</div>
          <div className="text-[10px] text-[#999] leading-tight">Admin Panel</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#F5F5F5] text-[#999] flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-2 py-3 border-t border-[#F0F0F0] space-y-0.5">
        <Link
          href="/admin/settings"
          onClick={onClose}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname.startsWith("/admin/settings")
              ? "bg-[#1A1A1A] text-white"
              : "text-[#555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
          }`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </Link>
        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A] transition-colors"
        >
          <PencilRuler className="w-4 h-4 flex-shrink-0" />
          Edit Website
          <ExternalLink className="w-3 h-3 ml-auto text-[#BBB]" />
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#555] hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // No sidebar on login page
  if (pathname === "/admin/login") return <>{children}</>

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F7F7]">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex md:flex-col md:w-56 md:flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 w-64 z-40 flex flex-col transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Page content ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex-shrink-0 bg-white border-b border-[#E5E5E5] h-12 flex items-center px-4 gap-3 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#555]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-6 h-6 rounded overflow-hidden">
            <Image src="/lifebydesignlogo.png" alt="Logo" width={24} height={24} />
          </div>
          <span className="text-sm font-semibold text-[#1A1A1A]">Admin</span>
        </div>

        {/* Children fill remaining space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
