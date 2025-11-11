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
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselItem,
} from '@/components/motion-primitives/carousel';

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

        {/*<InfiniteSlider gap={24} reverse>
          <img
            src='/images/partners/sierraleonelogo.png'
            alt='Sierra Leone logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/world-bank-group.png'
            alt='World Bank Group logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/rcbank.png'
            alt='Rokel Commercial Bank logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/sledp.jpg'
            alt='Sierra Leone Economic Diversification Project logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/itc.webp'
            alt='International Trade Centre'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/smeda.png'
            alt='SMEDA logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/germancooperation.webp'
            alt='German Cooperation logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/afrimoney.jpg'
            alt='Afrimoney logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/africell.jpeg'
            alt='Africell Sierra Leone'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/limkokwing.png'
            alt='Limkokwing University of Creative Technology logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/iom.webp'
            alt='IOM logo'
            className='h-[70px] w-auto'
          />
          <img
            src='/images/partners/undp.webp'
            alt='UNDP logo'
            className='h-[70px] w-auto'
          />
        </InfiniteSlider>*/}
        <div className='relative w-full max-w-lg container mx-auto'>
          <Carousel>
            <CarouselContent className="gap-10">
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/sierraleonelogo.png'
                  alt='Sierra Leone logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/world-bank-group.png'
                  alt='World Bank Group logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/rcbank.png'
                  alt='Rokel Commercial Bank logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/sledp.jpg'
                  alt='Sierra Leone Economic Diversification Project logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/itc.webp'
                  alt='International Trade Centre'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/smeda.png'
                  alt='SMEDA logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/germancooperation.webp'
                  alt='German Cooperation logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/afrimoney.jpg'
                  alt='Afrimoney logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/africell.jpeg'
                  alt='Africell Sierra Leone'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/limkokwing.png'
                  alt='Limkokwing University of Creative Technology logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/iom.webp'
                  alt='IOM logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
              <CarouselItem className='basis-1/3'>
                <img
                  src='/images/partners/undp.webp'
                  alt='UNDP logo'
                  className='h-[70px] w-auto object-contain'
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselNavigation />
          </Carousel>
        </div>
      </main>

      <Footer />

      <ScaleFormModal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)} />
    </div>
  )
}
