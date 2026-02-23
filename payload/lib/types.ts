// Payload CMS TypeScript types for use in page components

export interface PayloadMedia {
  id: string
  url: string
  alt?: string
  width?: number
  height?: number
  filename?: string
}

export interface CTA {
  text?: string
  url?: string
}

export interface SEO {
  title?: string
  description?: string
}

export interface FAQItem {
  question: string
  answer: string
  id?: string
}

// ---- Home Page ----
export interface HomePageHero {
  heading?: string
  subheading?: string
  heroImageLeft?: PayloadMedia | null
  heroImageRight?: PayloadMedia | null
  ctaButton?: CTA
  ctaButtonSecondary?: CTA
}

export interface HomePageFAQ {
  title?: string
  items?: FAQItem[]
  cta?: CTA
}

export interface HomePageFounder {
  founderName?: string
  founderTitle?: string
  founderBio?: string
  founderImage?: PayloadMedia | null
  linkedinUrl?: string
}

export interface HomePagePartners {
  title?: string
  items?: Array<{
    name: string
    logo?: PayloadMedia | null
    url?: string
    id?: string
  }>
}

export interface HomePageCTA {
  heading?: string
  subheading?: string
  ctaButton?: CTA
}

export interface HomePageData {
  hero?: HomePageHero
  faq?: HomePageFAQ
  founder?: HomePageFounder
  partners?: HomePagePartners
  cta?: HomePageCTA
  seo?: SEO
}

// ---- About Page ----
export interface AboutPageHero {
  heading?: string
  subheading?: string
  image?: PayloadMedia | null
}

export interface AboutMissionVision {
  story?: any // Lexical rich text
  mission?: string
  vision?: string
}

export interface AboutCoreValues {
  title?: string
  values?: Array<{
    title: string
    description?: string
    icon?: string
    id?: string
  }>
}

export interface AboutServices {
  title?: string
  description?: string
  items?: Array<{
    title: string
    description?: string
    icon?: string
    id?: string
  }>
}

export interface AboutImpactStats {
  title?: string
  stats?: Array<{
    value: string
    label: string
    id?: string
  }>
}

export interface AboutPageCTA {
  heading?: string
  subheading?: string
  ctaButton?: CTA
}

export interface AboutPageData {
  hero?: AboutPageHero
  missionVision?: AboutMissionVision
  coreValues?: AboutCoreValues
  services?: AboutServices
  impactStats?: AboutImpactStats
  cta?: AboutPageCTA
  seo?: SEO
}

// ---- Careers Page ----
export interface CareersHero {
  heading?: string
  subheading?: string
  image?: PayloadMedia | null
  ctaButton?: CTA
}

export interface CareersMindset {
  title?: string
  description?: string
  items?: Array<{
    title: string
    description?: string
    image?: PayloadMedia | null
    id?: string
  }>
}

export interface CareersTestimonials {
  title?: string
  items?: Array<{
    quote: string
    name: string
    role?: string
    image?: PayloadMedia | null
    id?: string
  }>
}

export interface CareersValues {
  title?: string
  items?: Array<{
    title: string
    description?: string
    icon?: string
    image?: PayloadMedia | null
    id?: string
  }>
}

export interface CareersBenefits {
  title?: string
  items?: Array<{
    title: string
    description?: string
    icon?: string
    id?: string
  }>
}

export interface CareersPageCTA {
  heading?: string
  subheading?: string
  ctaButton?: CTA
}

export interface CareersPageData {
  hero?: CareersHero
  mindset?: CareersMindset
  testimonials?: CareersTestimonials
  values?: CareersValues
  benefits?: CareersBenefits
  cta?: CareersPageCTA
  seo?: SEO
}

// ---- Scaling Blueprint Page ----
export interface BlueprintHeroData {
  heading?: string
  subheading?: string
  image?: PayloadMedia | null
  ctaButton?: CTA
  ctaButtonSecondary?: CTA
}

export interface BlueprintProcessSteps {
  title?: string
  description?: string
  steps?: Array<{
    number?: number
    title: string
    description?: string
    id?: string
  }>
}

export interface BlueprintTargetStages {
  title?: string
  description?: string
  stages?: Array<{
    title: string
    description?: string
    id?: string
  }>
}

export interface BlueprintPricingPaths {
  title?: string
  description?: string
  tiers?: Array<{
    title: string
    price?: string
    description?: string
    features?: Array<{ item?: string; id?: string }>
    cta?: CTA
    id?: string
  }>
}

export interface BlueprintOutcomes {
  heading?: string
  subheading?: string
  items?: Array<{ outcome?: string; id?: string }>
  closingStatement?: string
}

export interface BlueprintFAQ {
  title?: string
  items?: FAQItem[]
}

export interface BlueprintPageCTA {
  heading?: string
  subheading?: string
  ctaButton?: CTA
}

export interface ScalingBlueprintPageData {
  hero?: BlueprintHeroData
  processSteps?: BlueprintProcessSteps
  targetStages?: BlueprintTargetStages
  pricingPaths?: BlueprintPricingPaths
  outcomes?: BlueprintOutcomes
  faq?: BlueprintFAQ
  cta?: BlueprintPageCTA
  seo?: SEO
}

// ---- Kolat Books Page ----
export interface KolatHeroData {
  heading?: string
  subheading?: string
  image?: PayloadMedia | null
  ctaButton?: CTA
  ctaButtonSecondary?: CTA
}

export interface KolatPromise {
  heading?: string
  subheading?: string
  guarantee?: string
}

export interface KolatDeliverables {
  title?: string
  items?: Array<{
    title: string
    description?: string
    id?: string
  }>
}

export interface KolatWorkflowPhases {
  title?: string
  phases?: Array<{
    title: string
    description?: string
    duration?: string
    results?: string
    id?: string
  }>
}

export interface KolatPricingPlans {
  title?: string
  plans?: Array<{
    title: string
    price?: string
    description?: string
    highlighted?: boolean
    features?: Array<{ item?: string; id?: string }>
    cta?: CTA
    id?: string
  }>
}

export interface KolatFAQ {
  title?: string
  items?: FAQItem[]
}

export interface KolatPageCTA {
  heading?: string
  subheading?: string
  ctaButton?: CTA
}

export interface KolatBooksPageData {
  hero?: KolatHeroData
  promise?: KolatPromise
  deliverables?: KolatDeliverables
  workflowPhases?: KolatWorkflowPhases
  pricingPlans?: KolatPricingPlans
  faq?: KolatFAQ
  cta?: KolatPageCTA
  seo?: SEO
}

// ---- Workshops Page ----
export interface WorkshopsHero {
  heading?: string
  subheading?: string
  heroImageLeft?: PayloadMedia | null
  ctaButton?: CTA
}

export interface WorkshopsBenefits {
  title?: string
  items?: Array<{
    title: string
    description?: string
    image?: PayloadMedia | null
    id?: string
  }>
}

export interface WorkshopsValue {
  title?: string
  description?: string
  reasons?: Array<{
    text: string
    highlight?: string
    id?: string
  }>
}

export interface WorkshopsFAQ {
  title?: string
  items?: FAQItem[]
}

export interface WorkshopsPageCTA {
  heading?: string
  subheading?: string
  ctaButton?: CTA
}

export interface WorkshopsPageData {
  hero?: WorkshopsHero
  benefits?: WorkshopsBenefits
  value?: WorkshopsValue
  faq?: WorkshopsFAQ
  cta?: WorkshopsPageCTA
  seo?: SEO
}

// ---- Blog Post ----
export interface BlogPost {
  id: string
  title: string
  slug: string
  description?: string
  mainImage?: PayloadMedia | null
  categories?: Array<{
    id: string
    title: string
    slug: string
  }>
  author?: {
    name?: string
    image?: PayloadMedia | null
  }
  publishedAt?: string
  body?: any // Lexical rich text
  status: 'draft' | 'published'
  updatedAt: string
}

export interface BlogCategory {
  id: string
  title: string
  slug: string
}

// ---- Job Posting ----
export interface JobPosting {
  id: string
  title: string
  slug: string
  department?: string
  type?: 'full-time' | 'part-time' | 'contract' | 'internship'
  location?: string
  salary?: string
  description?: any // Lexical rich text
  requirements?: any // Lexical rich text
  status: 'open' | 'closed'
}
