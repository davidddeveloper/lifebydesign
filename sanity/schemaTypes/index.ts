import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'

import { partner } from "./partner"
import { productPage } from "./product"

import { faq } from './faqs'
import { faqItem } from './faqItem'

import { ctaItem } from './ctaItem'
import { ctas } from './ctas'

import { homePage } from "./page"
import {About} from "./about"
import {founder} from "./founder"

import { aboutHero } from './aboutHero'
import { aboutStory } from './aboutStory'
import { missionVision } from './missionVision'
import { coreValues } from './coreValues'
import { servicesSection } from './servicesSection'
import { impactStats } from './impactStats'
import { ctaSection } from './ctaSection'

import { careersPage } from './careers'
import { careersHero } from './careersHero'
import { careersBenefits } from './careersBenefits'
import { careersMindset } from './careersMindset'
import { careersTestimonials } from './careersTestimonial'
import { careersValues } from './careersValue'

import { scalingBlueprintPage } from './scalingblueprint'
import { productHero } from './productHero'
import { targetStages } from './targetStages'
import { outcomesSection } from './outcomeSection'
import { processSteps } from './processSteps'
import { pricingPaths } from './pricingPaths'
import { faqReference } from './faqReference'

import { heroSection } from './heroSection'
import { founderSection } from './founderSection'
import { homeFaqSection } from './homeFaqSection'
import { partnersSection } from './partnersSection'

import { kolatBooksPage } from './kolatBooksPage'
import { pricingPlans } from './pricingPlans'
import { workflowPhases } from './workflowPhases'
import { deliverablesSection } from './deliverablesSection'
import { productPromise } from './productPromise'

import { workshopsPage } from './workshopsPage'
import { workshopBenefits } from './workshopBenefits'
import { workshopValue } from './workshopValue'




export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType, categoryType, postType, authorType,
    homePage, productPage, About, partner, faq, faqItem, founder, ctaItem, ctas,
    aboutHero, aboutStory, missionVision, coreValues, servicesSection, impactStats, ctaSection,
    careersPage, careersHero, careersBenefits, careersMindset, careersTestimonials, careersValues,
    scalingBlueprintPage, productHero, targetStages, outcomesSection, processSteps, pricingPaths, faqReference,
    heroSection, founderSection, homeFaqSection, partnersSection,
    kolatBooksPage, pricingPlans, workflowPhases, deliverablesSection, productPromise,
    workshopsPage, workshopBenefits, workshopValue

  ],
}
