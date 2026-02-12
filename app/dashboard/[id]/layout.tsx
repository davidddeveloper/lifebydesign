import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Business Dashboard",
  description: "View your Business Constraint Audit results, track progress, and get personalized insights to grow your business.",
  robots: {
    index: false, // Don't index individual dashboards
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
