"use client"

import { Header } from "@/components/Header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Footer } from "@/components/Footer"
import { JobsSection } from "@/components/jobs-section"

export default function JobsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <JobsSection />
      </main>
      <Footer />
    </div>
  )
}
