"use client"

import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import type {
  HomePageSection,
  AboutPageSection,
  CareersPageSection,
  ScalingBlueprintPageSection,
  KolatBooksPageSection,
  WorkshopsPageSection,
  HeroSection,
  HomeFaqSection,
  FounderSection,
  PartnersSection,
  CTASection,
  AboutHeroSection,
  AboutStorySection,
  MissionVisionSection,
  CoreValuesSection,
  ServicesSection,
  ImpactStatsSection,
  CareersHeroSection,
  CareersMindsetSection,
  CareersTestimonialsSection,
  CareersValuesSection,
  CareersBenefitsSection,
  ProductHeroSection,
  ProcessStepsSection,
  TargetStagesSection,
  PricingPathsSection,
  OutcomesSection,
  FAQReferenceSection,
  ProductPromiseSection,
  DeliverablesSection,
  WorkflowPhasesSection,
  PricingPlansSection,
  WorkshopBenefitsSection,
  WorkshopValueSection,
} from '@/sanity/lib/types'

// Import section components
import { HeroSectionComponent } from './sections/HeroSection'
import { FAQSectionComponent } from './sections/FAQSection'
import { FounderSectionComponent } from './sections/FounderSection'
import { PartnersSectionComponent } from './sections/PartnersSection'
import { CTASectionComponent } from './sections/CTASection'
import { AboutHeroComponent } from './sections/AboutHero'
import { AboutStoryComponent } from './sections/AboutStory'
import { MissionVisionComponent } from './sections/MissionVision'
import { CoreValuesComponent } from './sections/CoreValues'
import { ServicesSectionComponent } from './sections/ServicesSection'
import { ImpactStatsComponent } from './sections/ImpactStats'
import { CareersHeroComponent } from './sections/CareersHero'
import { CareersMindsetComponent } from './sections/CareersMindset'
import { CareersTestimonialsComponent } from './sections/CareersTestimonials'
import { CareersValuesComponent } from './sections/CareersValues'
import { CareersBenefitsComponent } from './sections/CareersBenefits'
import { ProductHeroComponent } from './sections/ProductHero'
import { ProcessStepsComponent } from './sections/ProcessSteps'
import { TargetStagesComponent } from './sections/TargetStages'
import { PricingPathsComponent } from './sections/PricingPaths'
import { OutcomesSectionComponent } from './sections/OutcomesSection'
import { ProductPromiseComponent } from './sections/ProductPromise'
import { DeliverablesComponent } from './sections/Deliverables'
import { WorkflowPhasesComponent } from './sections/WorkflowPhases'
import { PricingPlansComponent } from './sections/PricingPlans'
import { WorkshopBenefitsComponent } from './sections/WorkshopBenefits'
import { WorkshopValueComponent } from './sections/WorkshopValue'

type AnySection =
  | HomePageSection
  | AboutPageSection
  | CareersPageSection
  | ScalingBlueprintPageSection
  | KolatBooksPageSection
  | WorkshopsPageSection

interface SectionRendererProps {
  sections: AnySection[]
  onOpenForm?: () => void
}

export function SectionRenderer({ sections, onOpenForm }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null
  }

  return (
    <>
      {sections.map((section) => {
        const key = section._key

        switch (section._type) {
          // Home Page Sections
          case 'heroSection':
            return <HeroSectionComponent key={key} data={section as HeroSection} onOpenForm={onOpenForm} />

          case 'homeFaqSection':
            return <FAQSectionComponent key={key} data={section as HomeFaqSection} onOpenForm={onOpenForm} />

          case 'founderSection':
            return <FounderSectionComponent key={key} data={section as FounderSection} />

          case 'partnersSection':
            return <PartnersSectionComponent key={key} data={section as PartnersSection} />

          case 'ctaSection':
            return <CTASectionComponent key={key} data={section as CTASection} onOpenForm={onOpenForm} />

          // About Page Sections
          case 'aboutHero':
            return <AboutHeroComponent key={key} data={section as AboutHeroSection} />

          case 'aboutStory':
            return <AboutStoryComponent key={key} data={section as AboutStorySection} />

          case 'missionVision':
            return <MissionVisionComponent key={key} data={section as MissionVisionSection} />

          case 'coreValues':
            return <CoreValuesComponent key={key} data={section as CoreValuesSection} />

          case 'servicesSection':
            return <ServicesSectionComponent key={key} data={section as ServicesSection} />

          case 'impactStats':
            return <ImpactStatsComponent key={key} data={section as ImpactStatsSection} />

          // Careers Page Sections
          case 'careersHero':
            return <CareersHeroComponent key={key} data={section as CareersHeroSection} />

          case 'careersMindset':
            return <CareersMindsetComponent key={key} data={section as CareersMindsetSection} />

          case 'careersTestimonials':
            return <CareersTestimonialsComponent key={key} data={section as CareersTestimonialsSection} />

          case 'careersValues':
            return <CareersValuesComponent key={key} data={section as CareersValuesSection} />

          case 'careersBenefits':
            return <CareersBenefitsComponent key={key} data={section as CareersBenefitsSection} />

          // Product Page Sections
          case 'productHero':
            return <ProductHeroComponent key={key} data={section as ProductHeroSection} onOpenForm={onOpenForm} />

          case 'processSteps':
            return <ProcessStepsComponent key={key} data={section as ProcessStepsSection} />

          case 'targetStages':
            return <TargetStagesComponent key={key} data={section as TargetStagesSection} />

          case 'pricingPaths':
            return <PricingPathsComponent key={key} data={section as PricingPathsSection} />

          case 'outcomesSection':
            return <OutcomesSectionComponent key={key} data={section as OutcomesSection} />

          case 'faqReference':
            return <FAQSectionComponent key={key} data={section as FAQReferenceSection} onOpenForm={onOpenForm} />

          case 'productPromise':
            return <ProductPromiseComponent key={key} data={section as ProductPromiseSection} />

          case 'deliverablesSection':
            return <DeliverablesComponent key={key} data={section as DeliverablesSection} />

          case 'workflowPhases':
            return <WorkflowPhasesComponent key={key} data={section as WorkflowPhasesSection} />

          case 'pricingPlans':
            return <PricingPlansComponent key={key} data={section as PricingPlansSection} />

          // Workshop Sections
          case 'workshopBenefits':
            return <WorkshopBenefitsComponent key={key} data={section as WorkshopBenefitsSection} />

          case 'workshopValue':
            return <WorkshopValueComponent key={key} data={section as WorkshopValueSection} />

          default:
            console.warn(`Unknown section type: ${(section as any)._type}`)
            return null
        }
      })}
    </>
  )
}
