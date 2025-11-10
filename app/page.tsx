"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
//import { AnnouncementBanner } from "@/components/announcement-banner"
import { HeroSection } from "@/components/hero-section"
import { FreeTrainingSection } from "@/components/free-training-section"
import { ScaleFormModal } from "@/components/scale-form-modal"
import { WorkshopFaq } from "@/components/workshop-faq"
import { FoundersSection } from "@/components/founders-section"
import { Footer } from "@/components/Footer"
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"

export default function Home() {
  const [formModalOpen, setFormModalOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection onOpenForm={() => setFormModalOpen(true)} />
        {/*<FreeTrainingSection />*/}
        <WorkshopFaq />
        <FoundersSection />

        <InfiniteSlider gap={24} reverse>
          <img
            src='/images/partners/sierraleonelogo.png'
            alt='Sierra Leone logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/world-bank-group.png'
            alt='World Bank Group logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/rcbank.png'
            alt='Rokel Commercial Bank logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/sledp.jpg'
            alt='Sierra Leone Economic Diversification Project logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/smeda.png'
            alt='SMEDA logo'
            className='h-[50px] w-auto'
          />
          <img
            src='//partners/germancooperation.webp'
            alt='German Cooperation logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/afrimoney.jpg'
            alt='Afrimoney logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/africell.jpeg'
            alt='Africell Sierra Leone'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/ymca.png'
            alt='YMCA logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/goal.png'
            alt='GOAL logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/savethechildren.png'
            alt='Save The Children logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/cordaid.png'
            alt='CordAid logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/osiwa.png'
            alt='OSIWA logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/iom.webp'
            alt='IOM logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/oxfam.webp'
            alt='OXFAM logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/unitedstatesofamerica.webp'
            alt='United States Of America logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/undp.webp'
            alt='UNDP logo'
            className='h-[50px] w-auto'
          />
          <img
            src='/images/partners/restlessdevelopment.png'
            alt='Restless Development logo'
            className='h-[50px] w-auto'
          />
        </InfiniteSlider>
      </main>

      <Footer />

      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
