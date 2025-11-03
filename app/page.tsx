import { Header } from "@/components/Header"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { HeroSection } from "@/components/hero-section"
import { FreeTrainingSection } from "@/components/free-training-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/*<AnnouncementBanner />*/}
      <Header />
      <main>
        <HeroSection />
        <FreeTrainingSection />
      </main>
      {/* CO button - chat/contact widget */}
      <button
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors"
        aria-label="Contact"
      >
        CO
      </button>
    </div>
  )
}