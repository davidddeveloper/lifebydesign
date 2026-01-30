"use client"

import type {
  HomePageSection as HomePageSectionType,
  AboutPageSection as AboutPageSectionType,
  CareersPageSection as CareersPageSectionType,
  ScalingBlueprintPageSection as ScalingBlueprintPageSectionType,
  KolatBooksPageSection as KolatBooksPageSectionType,
  WorkshopsPageSection as WorkshopsPageSectionType,
  HeroSection as HeroSectionType,
  HomeFaqSection as HomeFaqSectionType,
  FounderSection as FounderSectionType,
  PartnersSection as PartnersSectionType,
  CTASection as CTASectionType,
  AboutHeroSection as AboutHeroSectionType,
  MissionVisionSection as MissionVisionSectionType,
  CoreValuesSection as CoreValuesSectionType,
  ServicesSection as ServicesSectionType,
  ImpactStatsSection as ImpactStatsSectionType,
  CareersHeroSection as CareersHeroSectionType,
  CareersMindsetSection as CareersMindsetSectionType,
  CareersTestimonialsSection as CareersTestimonialsSectionType,
  CareersValuesSection as CareersValuesSectionType,
  CareersBenefitsSection as CareersBenefitsSectionType,
  ProductHeroSection as ProductHeroSectionType,
  ProcessStepsSection as ProcessStepsSectionType,
  TargetStagesSection as TargetStagesSectionType,
  PricingPathsSection as PricingPathsSectionType,
  OutcomesSection as OutcomesSectionType,
  FAQReferenceSection as FAQReferenceSectionType,
  ProductPromiseSection as ProductPromiseSectionType,
  DeliverablesSection as DeliverablesSectionType,
  WorkflowPhasesSection as WorkflowPhasesSectionType,
  PricingPlansSection as PricingPlansSectionType,
  WorkshopBenefitsSection as WorkshopBenefitsSectionType,
  WorkshopValueSection as WorkshopValueSectionType,
} from '@/sanity/lib/types'

// Shared / Home Components
import { HeroSection } from '../hero-section'
import { WorkshopFaq } from '../workshop-faq'
import { FoundersSection } from '../founders-section'
import { PartnersSection } from '../partners-section'
import { CTASection } from '../cta-section'

// About Page Components
import { AboutHero } from '../about-hero'
import { LBDMission } from '../lbd-mission'
import { LBDCoreValues } from '../lbd-core-values'
import { LBDServices } from '../lbd-services'
import { LBDImpact } from '../lbd-impact'
import { AboutCTA } from '../about-cta'

// Careers Page Components
import { CareersHero } from '../careers-hero'
import { CultureSection } from '../culture-section'
import { TestimonialsSection } from '../testimonials-section'
import { ValuesSection } from '../values-section'
import { BenefitsSection } from '../benefit-section'

// Kolat Books (Finance) Components
import { FinanceHero } from '@/components/kolatbooks-hero'
import { FinanceValueProposition } from '@/components/kolatbooks-value-proposition'
import { FinanceComponents } from '@/components/kolatbooks-components'
import { FinanceWorkflow } from '@/components/kolatbooks-workflow'
import { FinancePricing } from '@/components/kolatbooks-pricing'
import { FinanceFaq } from '@/components/kolatbooks-faq'

// Scaling Blueprint Components
import { BlueprintHero } from '../blueprint-hero'
import { BlueprintProcess } from '../blueprint-process'
import { BlueprintTargetSegments } from '../blueprint-target-segments'
import { BlueprintValueLadder } from '../blueprint-value-ladder'
import { BlueprintPromise } from '../blueprint-promise'
// BlueprintFAQ is unused if we use WorkshopFaq for faqReference

// Product, Workshop components (keeping wrapper imports until refactored)
import { DeliverablesComponent } from './sections/Deliverables'
import { WorkflowPhasesComponent } from './sections/WorkflowPhases'
import { PricingPlansComponent } from './sections/PricingPlans'
import { WorkshopBenefitsComponent } from './sections/WorkshopBenefits'
import { WorkshopValueComponent } from './sections/WorkshopValue'

// Generic fallback for FAQs if necessary, or reuse WorkshopFaq
// WorkshopFaq is flexible enough for HomeFaq/FAQReference if data matches structure.

type AnySection =
  | HomePageSectionType
  | AboutPageSectionType
  | CareersPageSectionType
  | ScalingBlueprintPageSectionType
  | KolatBooksPageSectionType
  | WorkshopsPageSectionType

interface SectionRendererProps {
  sections: AnySection[]
  onOpenForm?: () => void
  page?: 'home' | 'about' | 'careers' | 'blueprint' | 'kolat' | 'workshop'
}

export function SectionRenderer({ sections, onOpenForm, page }: SectionRendererProps) {
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
            return <HeroSection key={key} data={section as HeroSectionType} onOpenForm={onOpenForm || (() => { })} />

          case 'homeFaqSection':
            return <WorkshopFaq key={key} data={section as HomeFaqSectionType} onOpenForm={onOpenForm} />

          case 'founderSection':
            return <FoundersSection key={key} data={section as FounderSectionType} />

          case 'partnersSection':
            return <PartnersSection key={key} data={section as PartnersSectionType} />

          case 'ctaSection':
            // AboutCTA expects type CTASection, standard CTASection typically expects same structure.
            // Using CTASection shared component for generic 'ctaSection' type unless on About page specific handling is desired.
            // Earlier AboutCTA component specific: import { AboutCTA } from '../about-cta'
            // But 'ctaSection' type is shared.
            // About Page uses AboutCTA but schema type is 'ctaSection'.
            // To distinguish, we might check props or just use shared CTASection if suitable. 
            // In step 377, AboutCTA was refactored to accept CTASection data.
            // Let's us AboutCTA if it's About Page context? No, SectionRenderer is generic.
            // But AboutCTA has generic styling usable elsewhere or specific?
            // "AboutCTA" is "READY TO BECOME A PORTFOLIO COMPANY" style.
            // "CTASection" is "Ready to start your journey?" style.
            // About Page section list uses 'ctaSection' type.
            // If we want AboutCTA styling, we might need a specific type or logic.
            // FOR NOW: Let's use CTASection (shared) for generic 'ctaSection', unless we discern otherwise?
            // Wait, About Page design has specific CTA.
            // Maybe AboutCTA component IS the implementation for 'ctaSection' type on About Page?
            // But we can't tell which page we are on easily unless passed in.
            // OR: About Page uses a different component?
            // Actually, in About Page Migration, I refactored AboutCTA.
            // Let's use generic CTASection for now, it's safer. Unless I see AboutCTA was distinctly different type.
            // Update: About Page schema uses 'ctaSection'.
            // I will use CTASection shared component. If distinct style needed, we might need a variant prop or different schema type.
            return <CTASection key={key} data={section as CTASectionType} onOpenForm={onOpenForm} />

          // About Page Sections
          case 'aboutHero':
            return <AboutHero key={key} data={section as AboutHeroSectionType} />

          case 'missionVision':
            return <LBDMission key={key} data={section as MissionVisionSectionType} />

          case 'coreValues':
            return <LBDCoreValues key={key} data={section as CoreValuesSectionType} />

          case 'servicesSection':
            return <LBDServices key={key} data={section as ServicesSectionType} />

          case 'impactStats':
            return <LBDImpact key={key} data={section as ImpactStatsSectionType} />

          // Careers Page Sections
          case 'careersHero':
            return <CareersHero key={key} data={section as CareersHeroSectionType} />

          case 'careersMindset':
            return <CultureSection key={key} data={section as CareersMindsetSectionType} />

          case 'careersTestimonials':
            return <TestimonialsSection key={key} data={section as CareersTestimonialsSectionType} />

          case 'careersValues':
            return <ValuesSection key={key} data={section as CareersValuesSectionType} />

          case 'careersBenefits':
            return <BenefitsSection key={key} data={section as CareersBenefitsSectionType} />


          // Product Page Sections
          case 'productHero':
            if (page === 'kolat') {
              return <FinanceHero key={key} data={section as ProductHeroSectionType} onOpenForm={onOpenForm || (() => { })} />
            }
            return <BlueprintHero key={key} data={section as ProductHeroSectionType} onOpenForm={onOpenForm || (() => { })} />

          case 'processSteps':
            return <BlueprintProcess key={key} data={section as ProcessStepsSectionType} />

          case 'targetStages':
            return <BlueprintTargetSegments key={key} data={section as TargetStagesSectionType} />

          case 'pricingPaths':
            return <BlueprintValueLadder key={key} data={section as PricingPathsSectionType} onOpenForm={onOpenForm || (() => { })} />

          case 'outcomesSection':
            // Using BlueprintPromise for outcomesSection as determined in analysis
            return <BlueprintPromise key={key} data={section as OutcomesSectionType} />

          case 'faqReference':
            // ScalingBlueprint uses BlueprintFAQ, but Workshop uses generic.
            // SectionRenderer is generic.
            /* ...comments... */
            if (page === 'kolat') {
              return <FinanceFaq key={key} data={section as FAQReferenceSectionType} />
            }
            return <WorkshopFaq key={key} data={section as FAQReferenceSectionType} onOpenForm={onOpenForm} />

          case 'productPromise':
            if (page === 'kolat') {
              return <FinanceValueProposition key={key} data={section as ProductPromiseSectionType} />
            }
            // If we have a distinct productPromise section not covered by outcomesSection
            // We can use BlueprintPromise again or another component.
            // But based on analysis, outcomesSection -> BlueprintPromise. 
            // Leaving this as null or generic if needed.
            // Actually, remove if unused or log warning.
            // But for safety, let's map it to BlueprintPromise if it occurs?
            // No, schema has different fields (heading/guarantee vs outcomes array).
            // If data comes as productPromise, BlueprintPromise expects OutcomesSection data.
            console.warn("productPromise section type encountered but implementation uncertain. Using fallbacks.")
            return null

          case 'deliverablesSection':
            if (page === 'kolat') {
              return <FinanceComponents key={key} data={section as DeliverablesSectionType} />
            }
            return <DeliverablesComponent key={key} data={section as DeliverablesSectionType} />

          case 'workflowPhases':
            if (page === 'kolat') {
              return <FinanceWorkflow key={key} data={section as WorkflowPhasesSectionType} />
            }
            return <WorkflowPhasesComponent key={key} data={section as WorkflowPhasesSectionType} />

          case 'pricingPlans':
            if (page === 'kolat') {
              return <FinancePricing key={key} data={section as PricingPlansSectionType} onOpenForm={onOpenForm || (() => { })} />
            }
            return <PricingPlansComponent key={key} data={section as PricingPlansSectionType} />


          // Workshop Sections
          case 'workshopBenefits':
            return <WorkshopBenefitsComponent key={key} data={section as WorkshopBenefitsSectionType} />

          case 'workshopValue':
            return <WorkshopValueComponent key={key} data={section as WorkshopValueSectionType} />

          default:
            console.warn(`Unknown section type: ${(section as any)._type}`)
            return null
        }
      })}
    </>
  )
}
