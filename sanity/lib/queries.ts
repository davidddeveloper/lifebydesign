import { groq } from "next-sanity";

// Get all posts
export const postsQuery = groq`*[_type == "post"] {
  _id,
  _createdAt,
  publishedAt,
  title,
  description,
  slug,
  mainImage,
  author->{name, image, bio},
  categories[]->{
    _id,
    title,
    slug
  }
}`;

// Get a single post by its slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
  publishedAt,
  title,
  slug,
  author->{name, image, bio},
  description,
  mainImage,
  body,
  categories[]->{
    _id,
    title,
    slug
  }
}`;

// Get all categories
export const categoriesQuery = groq`*[_type == "category"] | order(name asc){
  _id,
  title,
  slug,
  description,
}`;

export const recommendedPostsQuery = groq`*[_type == "post"] | order(_createdAt desc) [0...6] {
  _id,
  _createdAt,
  publishedAt,
  title,
  description,
  slug,
  mainImage,
  author->{name, image, bio},
  categories[]->{
    _id,
    title,
    slug
  }
}`

// Get all post slugs
export const postPathsQuery = groq`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
}`;

// ============================================
// PAGE QUERIES
// ============================================

// Home Page Query
export const homePageQuery = groq`*[_type == "homePage"][0]{
  _id,
  title,
  sections[]{
    _type,
    _key,
    // heroSection fields
    _type == "heroSection" => {
      heading,
      subheading,
      image,
      primaryCta
    },
    // homeFaqSection - dereference FAQ
    _type == "homeFaqSection" => {
      "faq": faq->{
        _id,
        title,
        faqs[]{
          _key,
          question,
          answer
        }
      }
    },
    // founderSection fields
    _type == "founderSection" => {
      name,
      title,
      bio,
      image
    },
    // partnersSection fields
    _type == "partnersSection" => {
      logos[]{
        _key,
        asset,
        alt
      }
    },
    // ctaSection fields
    _type == "ctaSection" => {
      heading,
      text,
      buttonText,
      buttonUrl
    }
  },
  seo,
  published
}`;

// About Page Query
export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  _id,
  title,
  sections[]{
    _type,
    _key,
    // aboutHero
    _type == "aboutHero" => {
      heading,
      subheading
    },
    // aboutStory
    _type == "aboutStory" => {
      title,
      content
    },
    // missionVision
    _type == "missionVision" => {
      story,
      mission,
      vision
    },
    // coreValues
    _type == "coreValues" => {
      values
    },
    // servicesSection
    _type == "servicesSection" => {
      services[]{
        _key,
        title,
        description
      }
    },
    // impactStats
    _type == "impactStats" => {
      stats[]{
        _key,
        value,
        label
      }
    },
    // ctaSection
    _type == "ctaSection" => {
      heading,
      text,
      buttonText,
      buttonUrl
    }
  },
  published
}`;

// Careers Page Query
export const careersPageQuery = groq`*[_type == "careersPage"][0]{
  _id,
  title,
  sections[]{
    _type,
    _key,
    // careersHero
    _type == "careersHero" => {
      heading,
      subheading,
      image,
      buttonText,
      buttonUrl
    },
    // careersMindset
    _type == "careersMindset" => {
      heading,
      description,
      items[]{
        _key,
        title,
        description
      }
    },
    // careersTestimonials
    _type == "careersTestimonials" => {
      testimonials[]{
        _key,
        quote,
        name,
        role,
        image
      }
    },
    // careersValues
    _type == "careersValues" => {
      heading,
      description,
      values[]{
        _key,
        icon,
        title,
        description,
        image
      }
    },
    // careersBenefits
    _type == "careersBenefits" => {
      benefits[]{
        _key,
        icon,
        title,
        description
      }
    },
    // ctaSection
    _type == "ctaSection" => {
      heading,
      text,
      buttonText,
      buttonUrl
    }
  },
  published
}`;

// Scaling Blueprint Page Query
export const scalingBlueprintPageQuery = groq`*[_type == "scalingBlueprintPage"][0]{
  _id,
  title,
  slug,
  sections[]{
    _type,
    _key,
    // productHero
    _type == "productHero" => {
      heading,
      subheading,
      primaryCta,
      secondaryCta
    },
    // processSteps
    _type == "processSteps" => {
      steps[]{
        _key,
        stepNumber,
        title,
        description
      }
    },
    // targetStages
    _type == "targetStages" => {
      stages[]{
        _key,
        title,
        coreProblem,
        painPoint,
        weFix
      }
    },
    // pricingPaths
    _type == "pricingPaths" => {
      paths[]{
        _key,
        stage,
        title,
        price,
        features,
        ctaText,
        ctaUrl
      }
    },
    // outcomesSection
    _type == "outcomesSection" => {
      outcomes[]{
        _key,
        title,
        description
      },
      closingStatement
    },
    // faqReference - dereference FAQ
    _type == "faqReference" => {
      "faq": faq->{
        _id,
        title,
        faqs[]{
          _key,
          question,
          answer
        }
      }
    },
    // ctaSection
    _type == "ctaSection" => {
      heading,
      text,
      buttonText,
      buttonUrl
    }
  },
  published
}`;

// Kolat Books Page Query
export const kolatBooksPageQuery = groq`*[_type == "kolatBooksPage"][0]{
  _id,
  title,
  slug,
  sections[]{
    _type,
    _key,
    // productHero
    _type == "productHero" => {
      heading,
      subheading,
      primaryCta,
      secondaryCta
    },
    // productPromise
    _type == "productPromise" => {
      heading,
      description,
      guarantee
    },
    // deliverablesSection
    _type == "deliverablesSection" => {
      items[]{
        _key,
        title,
        description
      }
    },
    // workflowPhases
    _type == "workflowPhases" => {
      phases[]{
        _key,
        phase,
        title,
        duration,
        action,
    // pricingPlans
    _type == "pricingPlans" => {
      plans[]{
        _key,
        name,
        focus,
        price,
        billingNote,
        yearlyPrice,
        highlighted,
        features,
        ctaText,
        ctaUrl
      }
    },
    // faqReference
    _type == "faqReference" => {
      "faq": faq->{
        _id,
        title,
        faqs[]{
          _key,
          question,
          answer
        }
      }
    },
    // ctaSection
    _type == "ctaSection" => {
      heading,
      text,
      buttonText,
      buttonUrl
    }
  },
  published
}`;

// Workshops Page Query
export const workshopsPageQuery = groq`*[_type == "workshopsPage"][0]{
  _id,
  title,
  sections[]{
    _type,
    _key,
    // heroSection
    _type == "heroSection" => {
      heading,
      subheading,
      image,
      primaryCta
    },
    // workshopBenefits
    _type == "workshopBenefits" => {
      benefits[]{
        _key,
        number,
        title,
        description,
        image
      }
    },
    // workshopValue
    _type == "workshopValue" => {
      introText,
      animatedReasons,
      cta
    },
    // faqReference
    _type == "faqReference" => {
      "faq": faq->{
        _id,
        title,
        faqs[]{
          _key,
          question,
          answer
        }
      }
    },
    // ctaSection
    _type == "ctaSection" => {
      heading,
      text,
      buttonText,
      buttonUrl
    }
  },
  seo,
  published
}`;