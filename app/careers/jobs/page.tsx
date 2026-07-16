import { generateMetadata, pageMetadata } from "@/lib/seo"
import { getPublishedJobPostings } from "@/lib/sanity"
import JobsPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.jobs.title,
  description: pageMetadata.jobs.description,
  path: "/careers/jobs",
  tags: pageMetadata.jobs.tags,
})

export const revalidate = 60

export default async function JobsPage() {
  const postings = await getPublishedJobPostings()

  const jobs = postings.map((j) => ({
    id: j.slug || j._id,
    title: j.title,
    department: j.department || "",
    type: j.type || "",
    description: j.description || "",
    keyResponsibilities: j.responsibilities || [],
    requirements: j.requirements || [],
    compensation: j.compensation || "",
    email: j.applicationEmail || "info@lbd.sl",
    sanityDocumentId: j._id,
  }))

  return <JobsPageClient jobs={jobs} />
}
