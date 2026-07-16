"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { JobsSection, type Job } from "@/components/jobs-section"

export default function JobsPageClient({ jobs }: { jobs: Job[] }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <JobsSection jobs={jobs} />
      </main>
      <Footer />
    </div>
  )
}
