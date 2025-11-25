import { generateMetadata, pageMetadata } from "@/lib/seo"

import JobsPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.jobs.title,
  description: pageMetadata.jobs.description,
  path: "/careers/jobs",
  tags: pageMetadata.jobs.tags,
})

export default function JobsPage() {
  return <JobsPageClient />
}
