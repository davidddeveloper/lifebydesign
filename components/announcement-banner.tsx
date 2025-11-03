import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function AnnouncementBanner() {
  return (
    <div className="bg-[#7c3aed] text-white py-4 px-4">
      <Link href="/workshop">
        <div className="container mx-auto flex items-center justify-center gap-3 text-center flex-wrap">
          <span className="inline-flex items-center gap-2">
            <span className="bg-white text-[#7c3aed] text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
            <span className="font-bold">2025 Scaling Workshop Dates Announced:</span>
            <span>Find out if you are a fit</span>
          </span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </Link>
    </div>
  )
}
