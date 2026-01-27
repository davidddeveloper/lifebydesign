import { PortableTextBlock } from '@portabletext/types'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// ============================================
// BASE TYPES
// ============================================

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  alt?: string
}

export interface CTA {
  text?: string
  url?: string
}

export interface SEO {
  metaTitle?: string
  metaDescription?: string
}

// ============================================
// FAQ TYPES
// ============================================

export interface FAQItem {
  _key: string
  question: string
  answer: string
}

export interface FAQ {
  _id: string
  title: string
  faqs: FAQItem[]
}

// ============================================
// SECTION TYPES
// ============================================

// Base section interface
interface BaseSection {
  _type: string
  _key: string
}

// Hero Section (used in home, workshops)
export interface HeroSection extends BaseSection {
  _type: 'heroSection'
  heading?: string
  subheading?: string
  image?: SanityImage
  primaryCta?: CTA
}

// Home FAQ Section
export interface HomeFaqSection extends BaseSection {
  _type: 'homeFaqSection'
  faq?: FAQ
}

// Founder Section
export interface FounderSection extends BaseSection {
  _type: 'founderSection'
  name?: string
  title?: string
  bio?: PortableTextBlock[]
  image?: SanityImage
}

// Partners Section
export interface PartnersSection extends BaseSection {
  _type: 'partnersSection'
  logos?: Array<SanityImage & { _key: string }>
}

// CTA Section
export interface CTASection extends BaseSection {
  _type: 'ctaSection'
  heading?: string
  text?: string
  buttonText?: string
  buttonUrl?: string
}

// About Hero
export interface AboutHeroSection extends BaseSection {
  _type: 'aboutHero'
  heading?: string
  subheading?: string
}

// About Story
export interface AboutStorySection extends BaseSection {
  _type: 'aboutStory'
  title?: string
  content?: PortableTextBlock[]
}

// Mission Vision
export interface MissionVisionSection extends BaseSection {
  _type: 'missionVision'
  mission?: string
  vision?: string
}

// Core Values
export interface CoreValuesSection extends BaseSection {
  _type: 'coreValues'
  values?: string[]
}

// Services Section
export interface ServicesSection extends BaseSection {
  _type: 'servicesSection'
  services?: Array<{
    _key: string
    title?: string
    description?: string
  }>
}

// Impact Stats
export interface ImpactStatsSection extends BaseSection {
  _type: 'impactStats'
  stats?: Array<{
    _key: string
    value?: string
    label?: string
  }>
}

// Careers Hero
export interface CareersHeroSection extends BaseSection {
  _type: 'careersHero'
  heading?: string
  subheading?: string
  image?: SanityImage
  buttonText?: string
  buttonUrl?: string
}

// Careers Mindset
export interface CareersMindsetSection extends BaseSection {
  _type: 'careersMindset'
  items?: Array<{
    _key: string
    title?: string
    description?: string
  }>
}

// Careers Testimonials
export interface CareersTestimonialsSection extends BaseSection {
  _type: 'careersTestimonials'
  testimonials?: Array<{
    _key: string
    quote?: string
    name?: string
    role?: string
  }>
}

// Careers Values
export interface CareersValuesSection extends BaseSection {
  _type: 'careersValues'
  values?: Array<{
    _key: string
    icon?: string
    title?: string
    description?: string
  }>
}

// Careers Benefits
export interface CareersBenefitsSection extends BaseSection {
  _type: 'careersBenefits'
  benefits?: Array<{
    _key: string
    icon?: string
    title?: string
    description?: string
  }>
}

// Product Hero
export interface ProductHeroSection extends BaseSection {
  _type: 'productHero'
  heading?: string
  subheading?: string
  primaryCta?: CTA
  secondaryCta?: CTA
}

// Process Steps
export interface ProcessStepsSection extends BaseSection {
  _type: 'processSteps'
  steps?: Array<{
    _key: string
    stepNumber?: string
    title?: string
    description?: string
  }>
}

// Target Stages
export interface TargetStagesSection extends BaseSection {
  _type: 'targetStages'
  stages?: Array<{
    _key: string
    title?: string
    coreProblem?: string
    painPoint?: string
    weFix?: string
  }>
}

// Pricing Paths
export interface PricingPathsSection extends BaseSection {
  _type: 'pricingPaths'
  paths?: Array<{
    _key: string
    stage?: string
    title?: string
    price?: string
    features?: string[]
    ctaText?: string
    ctaUrl?: string
  }>
}

// Outcomes Section
export interface OutcomesSection extends BaseSection {
  _type: 'outcomesSection'
  outcomes?: Array<{
    _key: string
    title?: string
    description?: string
  }>
  closingStatement?: string
}

// FAQ Reference
export interface FAQReferenceSection extends BaseSection {
  _type: 'faqReference'
  faq?: FAQ
}

// Product Promise
export interface ProductPromiseSection extends BaseSection {
  _type: 'productPromise'
  heading?: string
  description?: string
  guarantee?: string
}

// Deliverables Section
export interface DeliverablesSection extends BaseSection {
  _type: 'deliverablesSection'
  items?: string[]
}

// Workflow Phases
export interface WorkflowPhasesSection extends BaseSection {
  _type: 'workflowPhases'
  phases?: Array<{
    _key: string
    phase?: string
    title?: string
    duration?: string
    action?: string
    result?: string
  }>
}

// Pricing Plans
export interface PricingPlansSection extends BaseSection {
  _type: 'pricingPlans'
  plans?: Array<{
    _key: string
    name?: string
    price?: string
    billingNote?: string
    features?: string[]
    ctaText?: string
    ctaUrl?: string
  }>
}

// Workshop Benefits
export interface WorkshopBenefitsSection extends BaseSection {
  _type: 'workshopBenefits'
  benefits?: Array<{
    _key: string
    number?: string
    title?: string
    description?: string
    image?: SanityImage
  }>
}

// Workshop Value
export interface WorkshopValueSection extends BaseSection {
  _type: 'workshopValue'
  introText?: string
  animatedReasons?: string[]
  cta?: CTA
}

// ============================================
// UNION TYPES FOR SECTIONS
// ============================================

export type HomePageSection =
  | HeroSection
  | HomeFaqSection
  | FounderSection
  | PartnersSection
  | CTASection

export type AboutPageSection =
  | AboutHeroSection
  | AboutStorySection
  | MissionVisionSection
  | CoreValuesSection
  | ServicesSection
  | ImpactStatsSection
  | CTASection

export type CareersPageSection =
  | CareersHeroSection
  | CareersMindsetSection
  | CareersTestimonialsSection
  | CareersValuesSection
  | CareersBenefitsSection
  | CTASection

export type ScalingBlueprintPageSection =
  | ProductHeroSection
  | ProcessStepsSection
  | TargetStagesSection
  | PricingPathsSection
  | OutcomesSection
  | FAQReferenceSection
  | CTASection

export type KolatBooksPageSection =
  | ProductHeroSection
  | ProductPromiseSection
  | DeliverablesSection
  | WorkflowPhasesSection
  | PricingPlansSection
  | FAQReferenceSection
  | CTASection

export type WorkshopsPageSection =
  | HeroSection
  | WorkshopBenefitsSection
  | WorkshopValueSection
  | FAQReferenceSection
  | CTASection

// ============================================
// PAGE TYPES
// ============================================

export interface HomePage {
  _id: string
  title: string
  sections?: HomePageSection[]
  seo?: SEO
  published?: boolean
}

export interface AboutPage {
  _id: string
  title: string
  sections?: AboutPageSection[]
  published?: boolean
}

export interface CareersPage {
  _id: string
  title: string
  sections?: CareersPageSection[]
  published?: boolean
}

export interface ScalingBlueprintPage {
  _id: string
  title: string
  slug?: { current: string }
  sections?: ScalingBlueprintPageSection[]
  published?: boolean
}

export interface KolatBooksPage {
  _id: string
  title: string
  slug?: { current: string }
  sections?: KolatBooksPageSection[]
  published?: boolean
}

export interface WorkshopsPage {
  _id: string
  title: string
  sections?: WorkshopsPageSection[]
  seo?: SEO
  published?: boolean
}
