import { generateMetadata as genMeta, pageMetadata } from "@/lib/seo"

export const metadata = genMeta({
  title: pageMetadata.constraintAudit.title,
  description: pageMetadata.constraintAudit.description,
  path: "/constraint-audit",
  tags: pageMetadata.constraintAudit.tags,
})

export default function ConstraintAuditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
