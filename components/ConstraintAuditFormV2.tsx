"use client"

import React, { useState, useEffect, useCallback, useRef, KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import BookingModal, { type BookingPrefill } from "@/components/BookingModal"
import FeedbackWidget from "@/components/FeedbackWidget"
import { useBrandTheme } from "@/lib/use-brand-theme"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ScreenType =
  | "welcome"
  | "multi-input"
  | "choice"
  | "textarea"
  | "section-intro"
  | "submit"

interface Option {
  label: string
  value: string | number
}

interface InputField {
  key: string
  label: string
  placeholder: string
  type?: "text" | "email" | "tel" | "number"
  prefix?: string
}

interface Screen {
  id: string
  type: ScreenType
  // choice / textarea
  questionNumber?: number
  lever?: number
  section?: string
  question?: string
  questionBold?: string // bold word(s) in the question
  hint?: string
  fieldKey?: string
  options?: Option[]
  // multi-input
  groupTitle?: string
  groupSubtitle?: string
  fields?: InputField[]
  // section-intro
  leverNumber?: number
  leverName?: string
  leverTagline?: string
  leverDescription?: string
  // conditional display
  conditionalOn?: { fieldKey: string; hideWhenValue: string | number }
}

interface FormData {
  // Business Info
  businessName: string
  ownerName: string
  phone: string
  email: string
  industry: string
  yearsInBusiness: string
  monthlyRevenue: string
  numberOfCustomers: string
  teamSize: string
  revenueTracking: string
  // Q2a — capacity gate (not scored, routing only)
  q2a: string | null   // "A" | "B" | "C" | "D" | null
  // Q1–Q27 (numeric scored)
  q1: number | null
  q2: number | null
  q3: number | null
  q4: string
  q5: number | null
  q6: number | null
  q7: number | null
  q8: number | null
  q9: number | null
  q10: number | null
  q11: number | null
  q12: string
  q13: number | null
  q14: number | null
  q15: number | null
  q16: number | null
  q17: number | null
  q18: number | null
  q19: number | null
  q20: number | null
  q21: number | null
  q22: string
  q23: number | null
  q24: number | null
  q25: number | null
  q26: number | null
  q27: number | null
  // Q28–Q30 (open)
  q28: string
  q29: string
  q30: string
}

const INITIAL_FORM: FormData = {
  businessName: "", ownerName: "", phone: "", email: "",
  industry: "", yearsInBusiness: "", monthlyRevenue: "",
  numberOfCustomers: "", teamSize: "", revenueTracking: "",
  q2a: null,
  q1: null, q2: null, q3: null, q4: "",
  q5: null, q6: null, q7: null, q8: null, q9: null,
  q10: null, q11: null, q12: "",
  q13: null, q14: null, q15: null, q16: null, q17: null,
  q18: null, q19: null, q20: null, q21: null, q22: "",
  q23: null, q24: null, q25: null, q26: null, q27: null,
  q28: "", q29: "", q30: "",
}

const STORAGE_KEY = "lbd_audit_v2_data"
const STORAGE_STEP_KEY = "lbd_audit_v2_step"

// ─────────────────────────────────────────────
// Screen Definitions
// ─────────────────────────────────────────────

const SCREENS: Screen[] = [
  // 0 — Welcome
  { id: "welcome", type: "welcome" },

  // 1 — Business Info: Contact
  {
    id: "info-contact",
    type: "multi-input",
    groupTitle: "Let's start with the basics.",
    groupSubtitle: "This information is used to personalise your diagnostic report.",
    fields: [
      { key: "businessName", label: "Business Name", placeholder: "Your business name" },
      { key: "ownerName", label: "Owner / Founder Name", placeholder: "Your full name" },
      { key: "phone", label: "Phone / WhatsApp", placeholder: "+232 ...", type: "tel" },
      { key: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
    ],
  },

  // 2 — Business Info: Details
  {
    id: "info-details",
    type: "multi-input",
    groupTitle: "Tell us about your business.",
    groupSubtitle: "Be as accurate as you can — this shapes your revenue opportunity calculation.",
    fields: [
      { key: "industry", label: "Industry / Type of Business", placeholder: "e.g. Retail, Services, Food" },
      { key: "yearsInBusiness", label: "Years in Business", placeholder: "e.g. 3", type: "number" },
      { key: "monthlyRevenue", label: "Average Monthly Revenue (last 3 months)", placeholder: "e.g. 5000000", type: "number", prefix: "NLe" },
      { key: "numberOfCustomers", label: "Number of Active Customers", placeholder: "e.g. 40", type: "number" },
      { key: "teamSize", label: "Number of Employees / Team Members", placeholder: "e.g. 4", type: "number" },
    ],
  },

  // 3 — Revenue Tracking
  {
    id: "info-tracking",
    type: "choice",
    questionNumber: 0,
    section: "Business Information",
    question: "Do you track your revenue regularly?",
    hint: "Be honest — your coach will work with you regardless of your answer.",
    fieldKey: "revenueTracking",
    options: [
      { label: "Yes — I know my numbers well", value: "yes" },
      { label: "Roughly — I have a general idea", value: "roughly" },
      { label: "No — I don't track formally", value: "no" },
    ],
  },

  // 4 — Lever 1 Intro
  {
    id: "lever1-intro",
    type: "section-intro",
    leverNumber: 1,
    leverName: "WHO",
    leverTagline: "Your Market",
    leverDescription: "Are you serving the right people, and are they choosing you?",
  },

  // Q1
  {
    id: "q1", type: "choice", questionNumber: 1, lever: 1,
    section: "Lever 1 — WHO",
    question: "How clearly can you describe the type of customer your business is best suited to serve?",
    hint: "Think about who your business was designed for, not just who happens to buy from you. A clear ideal customer has specific characteristics — their size, location, problem, or situation.",
    fieldKey: "q1",
    options: [
      { label: "I haven't really thought about it — I serve anyone who will pay", value: 1 },
      { label: "I have a rough sense but I take most opportunities that come my way", value: 2 },
      { label: "I have a clear type of customer I prefer and actively look for", value: 3 },
      { label: "I have a very specific ideal customer profile and I focus on them consistently", value: 4 },
    ],
  },

  // Q2a — capacity gate (not scored, routing only)
  {
    id: "q2a", type: "choice", questionNumber: "2a" as any, lever: 1,
    section: "Lever 1 — WHO",
    question: "Right now, is your business actively able to take on new customers if they came to you?",
    hint: "Think about today — not your plans for next month. If a new customer called or walked in wanting to use your business, could you serve them without turning anyone else away or compromising quality? Some businesses are temporarily full. Some are actively looking for more customers. Be honest about which situation you are in.",
    fieldKey: "q2a",
    options: [
      { label: "No — we are at full capacity and cannot take on new customers right now", value: "A" },
      { label: "Partially — we could take a few but we are close to our limit", value: "B" },
      { label: "Yes — we have room and are actively looking for new customers", value: "C" },
      { label: "Yes — we have significant capacity and urgently need more customers", value: "D" },
    ],
  },

  // Q2 — conditional: hidden when Q2a = "A"
  {
    id: "q2", type: "choice", questionNumber: 2, lever: 1,
    section: "Lever 1 — WHO",
    question: "How many genuinely new customers came to your business last month?",
    hint: "Count only customers who had never bought from you before. Do not count returning customers. Be as accurate as possible — look at your records if you need to.",
    fieldKey: "q2",
    conditionalOn: { fieldKey: "q2a", hideWhenValue: "A" },
    options: [
      { label: "0 to 2", value: 2 },
      { label: "3 to 5", value: 4 },
      { label: "6 to 10", value: 6 },
      { label: "More than 10", value: 8 },
    ],
  },

  // Q3
  {
    id: "q3", type: "choice", questionNumber: 3, lever: 1,
    section: "Lever 1 — WHO",
    question: "How much control do you have over who learns about your business and becomes a customer?",
    hint: "Think about whether customers come to you mainly by chance — passing by, stumbling across you, randomly referred — or whether you actively influence who finds you.",
    fieldKey: "q3",
    options: [
      { label: "Very little — most customers find me by chance or accident", value: 1 },
      { label: "Some — I rely mainly on word of mouth from people I already know", value: 2 },
      { label: "Moderate — I do some deliberate activity to attract the right people", value: 3 },
      { label: "A lot — I actively and consistently target and reach my ideal customers", value: 4 },
    ],
  },

  // Q4
  {
    id: "q4", type: "textarea", questionNumber: 4, lever: 1,
    section: "Lever 1 — WHO",
    question: "Describe your ideal customer in one sentence.",
    hint: "Be as specific as you can. Include what type of person or business they are, where they are based, and what situation or problem brings them to you. Example: 'Small provisions shops in the East End of Freetown that need reliable daily restocking of fast-moving goods.'",
    fieldKey: "q4",
  },

  // 8 — Lever 2 Intro
  {
    id: "lever2-intro",
    type: "section-intro",
    leverNumber: 2,
    leverName: "WHAT",
    leverTagline: "Your Offer",
    leverDescription: "Is what you are selling compelling enough to command good prices and keep customers coming back?",
  },

  // Q5
  {
    id: "q5", type: "choice", questionNumber: 5, lever: 2,
    section: "Lever 2 — WHAT",
    question: "How would you describe the value of a typical customer relationship in your business?",
    hint: "Think about what a typical customer — not your best one — is worth to your business. Consider both how much they spend and how often they come back. Compare yourself to a well-run version of your own type of business.",
    fieldKey: "q5",
    options: [
      { label: "Most customers make a single small purchase and do not return", value: 1 },
      { label: "Customers return occasionally but overall spending across the year is modest", value: 2 },
      { label: "Customers come back reasonably regularly and their total spending is meaningful", value: 3 },
      { label: "Customers are loyal, returning frequently, and their total annual value is high relative to my type of business", value: 4 },
    ],
  },

  // Q6
  {
    id: "q6", type: "choice", questionNumber: 6, lever: 2,
    section: "Lever 2 — WHAT",
    question: "Compared to other businesses offering something similar in your area, how do your prices compare?",
    hint: "Be honest about where your pricing sits relative to competitors you actually know about. If unsure, think about whether customers have ever told you your prices are high or low.",
    fieldKey: "q6",
    options: [
      { label: "I am significantly cheaper — I compete mainly on being the lowest price", value: 1 },
      { label: "I am a little cheaper — I usually come in below the going rate", value: 2 },
      { label: "I charge roughly the same as others in my area", value: 3 },
      { label: "I charge more — because I offer something noticeably better", value: 4 },
      { label: "I charge significantly more — and customers still choose me", value: 5 },
    ],
  },

  // Q7
  {
    id: "q7", type: "choice", questionNumber: 7, lever: 2,
    section: "Lever 2 — WHAT",
    question: "How satisfied are your customers with what you actually deliver — not what you promise, but what they experience?",
    hint: "Think about the feedback you receive — or the lack of it. Do customers come back looking happy? Do they complain? Do they say nothing and simply not return? Be honest about what the evidence tells you.",
    fieldKey: "q7",
    options: [
      { label: "Many customers seem disappointed, complain, or do not come back", value: 1.5 },
      { label: "Most customers are okay but rarely express strong satisfaction", value: 3 },
      { label: "Most customers seem genuinely happy and I get regular positive feedback", value: 4.5 },
      { label: "Almost all customers are very satisfied — I hear it regularly and see it in their behaviour", value: 6 },
    ],
  },

  // Q8
  {
    id: "q8", type: "choice", questionNumber: 8, lever: 2,
    section: "Lever 2 — WHAT",
    question: "Do customers refer other people to your business without you asking them to?",
    hint: "Think about the last five customers who came to you. How many of them were sent by someone else, without you having asked for the referral? Unprompted referrals are the strongest signal that your offer is genuinely delivering value.",
    fieldKey: "q8",
    options: [
      { label: "Never — I have never had an unprompted referral", value: 2 },
      { label: "Occasionally — maybe once or twice in the past year", value: 4 },
      { label: "Sometimes — a few times per quarter, without me asking", value: 6 },
      { label: "Regularly — I receive unprompted referrals almost every month", value: 8 },
    ],
  },

  // Q9
  {
    id: "q9", type: "choice", questionNumber: 9, lever: 2,
    section: "Lever 2 — WHAT",
    question: "Do you have documented evidence that your product or service delivers real results for customers?",
    hint: "Evidence means something you can show — a WhatsApp message, a before-and-after story, a result with numbers. It is not what you believe about your quality; it is what you can prove to a new customer who has never used you.",
    fieldKey: "q9",
    options: [
      { label: "No — I don't have any documented proof", value: 1 },
      { label: "I have a few positive messages or comments I could share", value: 2 },
      { label: "I have several testimonials I can show on request", value: 3 },
      { label: "I have documented results with numbers or specific before-and-after stories", value: 4 },
      { label: "I have extensive proof — multiple case studies, measurable outcomes, and results data", value: 5 },
    ],
  },

  // Q10
  {
    id: "q10", type: "choice", questionNumber: 10, lever: 2,
    section: "Lever 2 — WHAT",
    question: "How often does the average customer buy from you again after their first purchase?",
    hint: "Think about your actual customer base, not your best customers. If you had to estimate what a typical customer does after their first transaction — do they return, and if so, how often?",
    fieldKey: "q10",
    options: [
      { label: "Almost never — most customers only buy once", value: 2 },
      { label: "Occasionally — they return a few times over the course of a year", value: 4 },
      { label: "Regularly — most customers come back multiple times", value: 6 },
      { label: "Continuously — most of my customers are ongoing, recurring buyers", value: 8 },
    ],
  },

  // Q11
  {
    id: "q11", type: "choice", questionNumber: 11, lever: 2,
    section: "Lever 2 — WHAT",
    question: "Do you offer anything additional to existing customers — such as complementary products, upgraded versions, or related services they might also need?",
    hint: "Think about whether, once a customer has bought from you, there is anything else you actively offer them. Even occasionally suggesting something extra counts if it happens regularly.",
    fieldKey: "q11",
    options: [
      { label: "No — I offer one thing and that is all", value: 1 },
      { label: "I have thought about it but have not set anything up", value: 2 },
      { label: "I have additional offers but I rarely actively sell them", value: 3 },
      { label: "Yes — I regularly offer and sell additional products or services to existing customers", value: 4 },
    ],
  },

  // Q12
  {
    id: "q12", type: "textarea", questionNumber: 12, lever: 2,
    section: "Lever 2 — WHAT",
    question: "What is the main problem your business solves for customers?",
    hint: "Describe what life looks like for your customer before they use you — the frustration, the gap, the need — and what changes for them after. Be concrete and specific.",
    fieldKey: "q12",
  },

  // Lever 3 Intro
  {
    id: "lever3-intro",
    type: "section-intro",
    leverNumber: 3,
    leverName: "HOW THEY FIND YOU",
    leverTagline: "Reaching New Customers",
    leverDescription: "Can you reliably bring new customers to your business, or does growth depend on luck?",
  },

  // Q13
  {
    id: "q13", type: "choice", questionNumber: 13, lever: 3,
    section: "Lever 3 — HOW THEY FIND YOU",
    question: "How do most of your new customers first hear about or discover your business?",
    hint: "Think about the last 5 to 10 new customers you got. How did each of them first find out about you? Be honest about whether this was mainly luck and circumstance, or something you did deliberately.",
    fieldKey: "q13",
    options: [
      { label: "Mostly by chance — they passed by, saw a sign, or found me randomly", value: 1 },
      { label: "Mostly through personal connections — friends, family, or people who already know me", value: 2 },
      { label: "Through a mix of word of mouth and some deliberate activity I do", value: 3 },
      { label: "Through a consistent system I run — regular outreach, promotions, or partnerships", value: 4 },
    ],
  },

  // Q14
  {
    id: "q14", type: "choice", questionNumber: 14, lever: 3,
    section: "Lever 3 — HOW THEY FIND YOU",
    question: "How consistently do you take deliberate action each week to bring new customers to your business?",
    hint: "This includes anything intentional — sending WhatsApp messages to potential customers, visiting people, posting about your business, handing out flyers, calling previous contacts, or partnering with other businesses.",
    fieldKey: "q14",
    options: [
      { label: "I do not do anything regularly — customers come when they come", value: 1.5 },
      { label: "Occasionally — I do something when I remember or feel motivated", value: 3 },
      { label: "At least once or twice a week — I have a loose routine", value: 4.5 },
      { label: "Every week without fail — I have a consistent practice that I stick to", value: 6 },
    ],
  },

  // Q15
  {
    id: "q15", type: "choice", questionNumber: 15, lever: 3,
    section: "Lever 3 — HOW THEY FIND YOU",
    question: "How many new enquiries or expressions of interest does your business receive each month — from people who have not bought from you before?",
    hint: "Count every enquiry — a WhatsApp message asking about prices, someone asking what you sell, a call from a potential new customer. Include enquiries that did not lead to a sale.",
    fieldKey: "q15",
    options: [
      { label: "Fewer than 5", value: 2 },
      { label: "5 to 15", value: 4 },
      { label: "16 to 30", value: 6 },
      { label: "31 to 60", value: 8 },
      { label: "More than 60", value: 10 },
    ],
  },

  // Q16
  {
    id: "q16", type: "choice", questionNumber: 16, lever: 3,
    section: "Lever 3 — HOW THEY FIND YOU",
    question: "How predictable is your flow of new customer enquiries from month to month?",
    hint: "Think about whether you can estimate, at the beginning of the month, roughly how many new people will contact you. A business with a functioning traffic system has a reasonably predictable flow.",
    fieldKey: "q16",
    options: [
      { label: "Completely unpredictable — I have no idea what next month will bring", value: 1 },
      { label: "Rough guess — I can estimate within a very wide range", value: 2 },
      { label: "Reasonably confident — I can usually estimate within about 25%", value: 3 },
      { label: "Very confident — my enquiry flow is consistent and I can predict it reliably", value: 4 },
    ],
  },

  // Q17
  {
    id: "q17", type: "choice", questionNumber: 17, lever: 3,
    section: "Lever 3 — HOW THEY FIND YOU",
    question: "Do you have a way to stay in regular contact with people who showed interest in your business but have not yet bought?",
    hint: "Think about what happens when someone enquires but doesn't buy immediately. Do you have a way of staying in touch — a list, a WhatsApp group, a follow-up routine — or do you simply lose touch with them?",
    fieldKey: "q17",
    options: [
      { label: "No — if they don't buy immediately I lose touch completely", value: 1 },
      { label: "Sometimes — I follow up if I happen to remember", value: 2 },
      { label: "Usually — I try to follow up with most people who show interest", value: 3 },
      { label: "Always — I have a system and I work it consistently for everyone who enquires", value: 4 },
    ],
  },

  // Lever 4 Intro
  {
    id: "lever4-intro",
    type: "section-intro",
    leverNumber: 4,
    leverName: "HOW YOU SELL",
    leverTagline: "Converting Interest into Sales",
    leverDescription: "When someone is interested, can you reliably turn that into a paid sale?",
  },

  // Q18
  {
    id: "q18", type: "choice", questionNumber: 18, lever: 4,
    section: "Lever 4 — HOW YOU SELL",
    question: "When someone shows genuine interest in buying from you, what typically happens next?",
    hint: "Think about your last 5 or 10 sales conversations. Do they all follow roughly the same pattern, or does it vary depending on your mood and the situation? A process does not have to be formal — it just needs to be something you consistently do.",
    fieldKey: "q18",
    options: [
      { label: "I send them a price and wait to hear back — no real process", value: 1.5 },
      { label: "I have an informal conversation and try to close it, but it varies each time", value: 3 },
      { label: "I follow a loose process — I explain what I offer, answer questions, and ask for payment", value: 4.5 },
      { label: "I follow a clear, consistent process every time — I know what I say and in what order", value: 6 },
    ],
  },

  // Q19
  {
    id: "q19", type: "choice", questionNumber: 19, lever: 4,
    section: "Lever 4 — HOW YOU SELL",
    question: "Out of every 10 sales conversations you have with genuinely interested people, how many result in a paid sale?",
    hint: "Be honest and realistic. Think about your last 20 conversations with people who showed real interest — not casual passers-by. How many actually paid? Do not include people you already knew were going to buy.",
    fieldKey: "q19",
    options: [
      { label: "Fewer than 2 (less than 20%)", value: 2 },
      { label: "2 to 3 (20–30%)", value: 4 },
      { label: "4 to 5 (40–50%)", value: 6 },
      { label: "6 or more (60%+)", value: 8 },
    ],
  },

  // Q20
  {
    id: "q20", type: "choice", questionNumber: 20, lever: 4,
    section: "Lever 4 — HOW YOU SELL",
    question: "Compared to what is normal for your type of business, how long does it take from a customer's first contact to receiving payment?",
    hint: "Judge yourself relative to what is typical in your industry and business model. A retail sale should happen the same day. A large B2B contract may reasonably take weeks. The question is whether your cycle is faster, slower, or in line with what is normal for businesses like yours.",
    fieldKey: "q20",
    options: [
      { label: "Much slower than typical for my type of business", value: 1 },
      { label: "A little slower than typical — it takes longer than it probably should", value: 2 },
      { label: "About the same as typical for my type of business", value: 3 },
      { label: "Faster than typical — I close and collect payment more quickly than most", value: 4 },
    ],
  },

  // Q21
  {
    id: "q21", type: "choice", questionNumber: 21, lever: 4,
    section: "Lever 4 — HOW YOU SELL",
    question: "When a potential customer shows interest but does not buy immediately, do you follow up with them afterwards?",
    hint: "Think about what you actually do — not what you intend to do. Most people who do not buy on first contact are not gone forever; they often need a reminder, an answer to a question, or simply to be asked again.",
    fieldKey: "q21",
    options: [
      { label: "No — if they don't buy at first I move on and forget about them", value: 2 },
      { label: "Sometimes — if I happen to remember or they contact me again", value: 4 },
      { label: "Usually — I follow up with most people after a few days", value: 6 },
      { label: "Always — I have a consistent follow-up system and I use it for everyone", value: 8 },
    ],
  },

  // Q22
  {
    id: "q22", type: "textarea", questionNumber: 22, lever: 4,
    section: "Lever 4 — HOW YOU SELL",
    question: "What is the most common reason people give for not buying from you?",
    hint: "Think about the objections you hear most often — 'too expensive', 'I'll think about it', 'I need to check with someone', 'I found someone cheaper'. Write down the exact words people use, not your interpretation of what they mean.",
    fieldKey: "q22",
  },

  // Lever 5 Intro
  {
    id: "lever5-intro",
    type: "section-intro",
    leverNumber: 5,
    leverName: "HOW YOU DELIVER",
    leverTagline: "Operations & Sustainability",
    leverDescription: "Can your business run, grow, and survive without depending entirely on you?",
  },

  // Q23
  {
    id: "q23", type: "choice", questionNumber: 23, lever: 5,
    section: "Lever 5 — HOW YOU DELIVER",
    question: "If you were completely unavailable for one full week — no phone, no visits, no messages — what would happen to your business?",
    hint: "Be realistic. Think about what processes, decisions, and activities depend entirely on you being present. This is not a question about your dedication — it is a question about whether the business has any ability to function without you.",
    fieldKey: "q23",
    options: [
      { label: "It would completely stop — nothing happens without me personally", value: 1 },
      { label: "Major problems would occur — things would fall apart quickly", value: 2 },
      { label: "Some things would slow down, but most could be managed without me", value: 3 },
      { label: "It would run normally — I have clear systems and people who can handle things", value: 4 },
    ],
  },

  // Q24
  {
    id: "q24", type: "choice", questionNumber: 24, lever: 5,
    section: "Lever 5 — HOW YOU DELIVER",
    question: "How much of the knowledge needed to run and deliver your business is written down, documented, or accessible to others — rather than existing only in your head?",
    hint: "A formal operations manual is not required — a checklist on your phone, notes in a notebook, or instructions saved in WhatsApp all count. The question is whether the knowledge exists only inside you, or whether it has been captured somewhere.",
    fieldKey: "q24",
    options: [
      { label: "Everything is in my head — nothing is written down anywhere", value: 1 },
      { label: "A few things are noted somewhere, but it is mostly informal and incomplete", value: 2 },
      { label: "The main steps of my most important work are written down or documented somewhere", value: 3 },
      { label: "Most of how I run and deliver the business is documented and accessible to others", value: 4 },
    ],
  },

  // Q25
  {
    id: "q25", type: "choice", questionNumber: 25, lever: 5,
    section: "Lever 5 — HOW YOU DELIVER",
    question: "How consistently do you track your key business numbers — revenue, number of customers, costs, and profit?",
    hint: "Think about whether, right now, you could answer the following questions from records rather than guesswork: How much did I earn last month? How many new customers did I get? What did I spend? What was left over? Tracking does not require accounting software — a notebook or simple spreadsheet counts.",
    fieldKey: "q25",
    options: [
      { label: "I do not track any of these — I work from memory and feel", value: 2 },
      { label: "I have a rough sense but nothing I track consistently", value: 4 },
      { label: "I check most of these numbers most months, though not perfectly", value: 6 },
      { label: "Yes — I track all of these regularly and could tell you the numbers right now", value: 8 },
    ],
  },

  // Q26
  {
    id: "q26", type: "choice", questionNumber: 26, lever: 5,
    section: "Lever 5 — HOW YOU DELIVER",
    question: "Do you know your profit margin — how much of every Leone your business earns is actual profit after all costs are paid?",
    hint: "Profit margin is not the same as revenue. It is what remains after you have paid for everything — stock, rent, transport, phone, staff, and your own time. If you earn NLe 10M and costs are NLe 7M, your profit is NLe 3M and your margin is 30%.",
    fieldKey: "q26",
    options: [
      { label: "No — I genuinely do not know my profit margin", value: "0a" },
      { label: "I am losing money or only barely breaking even", value: "0b" },
      { label: "I keep roughly 10 to 20 out of every 100 Leones I earn", value: 4 },
      { label: "I keep roughly 21 to 35 out of every 100 Leones I earn", value: 6 },
      { label: "I keep more than 35 out of every 100 Leones I earn", value: 8 },
    ],
  },

  // Q27
  {
    id: "q27", type: "choice", questionNumber: 27, lever: 5,
    section: "Lever 5 — HOW YOU DELIVER",
    question: "What proportion of your working time is spent working ON your business — planning, improving, marketing, and building — versus IN your business, doing the day-to-day operational work yourself?",
    hint: "Working IN the business means fulfilling orders, serving customers, making the product. Working ON the business means marketing, improving systems, planning for growth, training staff. Both matter — but an owner who has no time to work ON the business cannot improve it.",
    fieldKey: "q27",
    options: [
      { label: "Almost entirely IN — I have no real time to plan or improve anything", value: 1.5 },
      { label: "Mainly IN, with some ON — roughly 25% of my time is on strategy and improvement", value: 3 },
      { label: "A reasonable balance — about half my time is on strategy and improvement", value: 4.5 },
      { label: "Mainly ON — most of my time is spent building and improving the business", value: 6 },
    ],
  },

  // Final Questions Intro
  {
    id: "final-intro",
    type: "section-intro",
    leverNumber: 6,
    leverName: "FINAL QUESTIONS",
    leverTagline: "In your own words",
    leverDescription: "These questions help us understand your situation. There are no right or wrong answers — write what is genuinely true for your business.",
  },

  // Q28
  {
    id: "q28", type: "textarea", questionNumber: 28,
    section: "Final Questions",
    question: "What is your biggest business challenge right now?",
    hint: "Write what actually keeps you up at night or stops you from growing — not what you think sounds most professional. The more honest your answer, the more useful your report will be.",
    fieldKey: "q28",
  },

  // Q29
  {
    id: "q29", type: "textarea", questionNumber: 29,
    section: "Final Questions",
    question: "If you could only fix one thing in your business in the next 90 days, what would it be?",
    hint: "Think about what would make the biggest difference to your revenue, your stress levels, or your ability to grow. Trust your instincts here — you know your business better than anyone.",
    fieldKey: "q29",
  },

  // Q30
  {
    id: "q30", type: "textarea", questionNumber: 30,
    section: "Final Questions",
    question: "Where do you want your business to be in 12 months?",
    hint: "Be specific — state a revenue target, a number of customers, a team size, or whatever achievement would make the next 12 months feel successful. Vague goals produce vague plans.",
    fieldKey: "q30",
  },

  // Submit
  { id: "submit", type: "submit" },
]

const TOTAL_QUESTIONS = SCREENS.filter(s => s.type === "choice" || s.type === "textarea").length
const QUESTION_SCREENS = SCREENS.filter(s => s.type === "choice" || s.type === "textarea" || s.type === "multi-input")

// Option letter labels A–F
const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"]

// ─────────────────────────────────────────────
// Slide animation variants
// ─────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" as const },
  }),
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

interface Props {
  onSubmit: (data: FormData) => void
}

// Nav sections for the menu
const NAV_SECTIONS = [
  { label: "Business Info", icon: "0", screenIdx: 1, fields: ["businessName", "ownerName", "email", "phone", "industry", "monthlyRevenue"] },
  { label: "WHO — Your Market", icon: "1", screenIdx: 5, fields: ["q1", "q2", "q3", "q4"] },
  { label: "WHAT — Your Offer", icon: "2", screenIdx: 10, fields: ["q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12"] },
  { label: "FIND YOU — Traffic", icon: "3", screenIdx: 19, fields: ["q13", "q14", "q15", "q16", "q17"] },
  { label: "SELL — Conversion", icon: "4", screenIdx: 25, fields: ["q18", "q19", "q20", "q21", "q22"] },
  { label: "DELIVER — Ops", icon: "5", screenIdx: 31, fields: ["q23", "q24", "q25", "q26", "q27"] },
  { label: "Final Questions", icon: "6", screenIdx: 37, fields: ["q28", "q29", "q30"] },
]

export default function ConstraintAuditFormV2({ onSubmit }: Props) {
  const { primary: brandPrimary, hover: brandHover } = useBrandTheme()
  const [screenIndex, setScreenIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM)
  const [justSelected, setJustSelected] = useState<string | null>(null)
  const [showNav, setShowNav] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [bookingOpen, setBookingOpen] = useState(false)
  const saveRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Always-current ref so navigation callbacks never read stale formData
  const formDataRef = useRef<FormData>(formData)
  useEffect(() => { formDataRef.current = formData }, [formData])

  // Restore progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY)
      if (saved) setFormData(JSON.parse(saved))
      if (savedStep) {
        const n = parseInt(savedStep)
        if (!isNaN(n) && n >= 0 && n < SCREENS.length) setScreenIndex(n)
      }
    } catch { }
  }, [])

  // Debounced save
  const persist = useCallback((data: FormData, idx: number) => {
    if (saveRef.current) clearTimeout(saveRef.current)
    saveRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        localStorage.setItem(STORAGE_STEP_KEY, idx.toString())
      } catch { }
    }, 400)
  }, [])

  const screen = SCREENS[screenIndex]

  // Check if a screen should be skipped.
  // Accepts an optional pending override so handleChoiceSelect can pass the
  // value it just set *before* the React state update has flushed.
  const isScreenHidden = useCallback((
    idx: number,
    pending?: { fieldKey: string; value: any }
  ): boolean => {
    const s = SCREENS[idx]
    if (!s.conditionalOn) return false
    const { fieldKey, hideWhenValue } = s.conditionalOn
    // Use pending value if it matches the gate field, otherwise use the ref
    const currentValue = (pending?.fieldKey === fieldKey)
      ? pending.value
      : (formDataRef.current as any)[fieldKey]
    return currentValue === hideWhenValue
  }, []) // No deps — reads from ref and pending arg, never stale

  const go = useCallback((
    delta: number,
    pending?: { fieldKey: string; value: any }
  ) => {
    let next = screenIndex + delta
    // Skip conditionally hidden screens, using pending value for accuracy
    while (next >= 0 && next < SCREENS.length && isScreenHidden(next, pending)) {
      next += delta
    }
    if (next < 0 || next >= SCREENS.length) return
    setDirection(delta)
    setScreenIndex(next)
    persist(formDataRef.current, next)
    window.scrollTo(0, 0)
  }, [screenIndex, persist, isScreenHidden])

  const goNext = useCallback(() => go(1), [go])
  const goPrev = useCallback(() => go(-1), [go])

  const goToScreen = useCallback((idx: number) => {
    setDirection(idx > screenIndex ? 1 : -1)
    setScreenIndex(idx)
    persist(formDataRef.current, idx)
    setShowNav(false)
    window.scrollTo(0, 0)
  }, [screenIndex, persist])

  const update = useCallback((field: string, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value }
      persist(next, screenIndex)
      return next
    })
  }, [screenIndex, persist])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      const s = SCREENS[screenIndex]

      // Enter = advance (except textarea)
      if (e.key === "Enter" && !e.shiftKey && s.type !== "textarea") {
        e.preventDefault()
        if (canAdvance()) goNext()
        return
      }

      // Letter shortcuts for choice questions
      if (s.type === "choice" && s.options) {
        const idx = OPTION_LETTERS.indexOf(e.key.toUpperCase())
        if (idx >= 0 && idx < s.options.length) {
          e.preventDefault()
          const opt = s.options[idx]
          update(s.fieldKey!, opt.value)
          setJustSelected(String(opt.value))
          setTimeout(() => {
            setJustSelected(null)
            goNext()
          }, 500)
        }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [screenIndex, formData]) // eslint-disable-line

  const validateMultiInput = (fields: InputField[]): Record<string, string> => {
    const errors: Record<string, string> = {}
    fields.forEach(f => {
      const val = String((formData as any)[f.key] ?? "").trim()
      if (f.key === "teamSize") return // optional
      if (!val) { errors[f.key] = "Required"; return }
      if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        errors[f.key] = "Enter a valid email address"
      if (f.type === "tel" && val.length < 7)
        errors[f.key] = "Enter a valid phone number"
      if (f.type === "number" && isNaN(Number(val)))
        errors[f.key] = "Must be a number"
    })
    return errors
  }

  const canAdvance = () => {
    const s = SCREENS[screenIndex]
    if (s.type === "welcome") return true
    if (s.type === "section-intro") return true
    if (s.type === "submit") return false

    if (s.type === "multi-input") {
      const required = s.fields?.filter(f => f.key !== "teamSize") ?? []
      const errs = validateMultiInput(s.fields ?? [])
      return required.every(f => {
        const val = (formData as any)[f.key]
        return val && String(val).trim() !== "" && !errs[f.key]
      })
    }

    if (s.type === "choice") {
      const val = (formData as any)[s.fieldKey!]
      return val !== null && val !== undefined && val !== ""
    }

    if (s.type === "textarea") {
      const val = (formData as any)[s.fieldKey!]
      return val && String(val).trim().length > 3
    }

    return true
  }

  const handleChoiceSelect = (fieldKey: string, value: string | number) => {
    update(fieldKey, value)
    setJustSelected(String(value))
    setTimeout(() => {
      setJustSelected(null)
      // Pass the pending value so isScreenHidden sees the new selection
      // immediately, regardless of whether React has flushed the state yet
      go(1, { fieldKey, value })
    }, 480)
  }

  const handleFinalSubmit = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_STEP_KEY)
    } catch { }
    onSubmit(formData)
  }

  // Progress: only over scoreable + input screens
  const answerableScreens = SCREENS.filter(
    s => s.type === "choice" || s.type === "textarea" || s.type === "multi-input"
  )
  const answeredCount = answerableScreens.filter(s => {
    if (s.type === "multi-input") {
      return s.fields?.some(f => (formData as any)[f.key]?.toString().trim())
    }
    if (s.type === "choice") return (formData as any)[s.fieldKey!] !== null
    if (s.type === "textarea") return (formData as any)[s.fieldKey!]?.trim()?.length > 0
    return false
  }).length
  const progressPct = Math.round((answeredCount / answerableScreens.length) * 100)

  return (
    <div
      className="min-h-screen bg-[#EBEBEB] relative overflow-hidden"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        "--brand-primary": brandPrimary,
        "--brand-hover": brandHover,
      } as React.CSSProperties}
    >
      {/* Progress bar */}
      {screen.type !== "welcome" && (
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#D4D4D4] z-50">
          <motion.div
            className="h-full"
            style={{ backgroundColor: "var(--brand-primary)" }}
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Screen */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={screen.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="min-h-screen flex flex-col"
        >
          {screen.type === "welcome" && (
            <WelcomeScreen onStart={goNext} brandColor={brandPrimary} />
          )}
          {screen.type === "section-intro" && (
            <SectionIntroScreen screen={screen} onContinue={goNext} onBack={goPrev} brandColor={brandPrimary} />
          )}
          {screen.type === "multi-input" && (
            <MultiInputScreen
              screen={screen}
              formData={formData}
              onChange={update}
              onNext={goNext}
              onBack={goPrev}
              canAdvance={canAdvance()}
              brandColor={brandPrimary}
            />
          )}
          {screen.type === "choice" && (
            <ChoiceScreen
              screen={screen}
              currentValue={(formData as any)[screen.fieldKey!]}
              justSelected={justSelected}
              onSelect={handleChoiceSelect}
              onNext={goNext}
              onBack={goPrev}
              canAdvance={canAdvance()}
              brandColor={brandPrimary}
            />
          )}
          {screen.type === "textarea" && (
            <TextareaScreen
              screen={screen}
              value={(formData as any)[screen.fieldKey!] ?? ""}
              onChange={val => update(screen.fieldKey!, val)}
              onNext={goNext}
              onBack={goPrev}
              canAdvance={canAdvance()}
              brandColor={brandPrimary}
            />
          )}
          {screen.type === "submit" && (
            <SubmitScreen
              formData={formData}
              onSubmit={handleFinalSubmit}
              onBack={goPrev}
              brandColor={brandPrimary}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav menu button — bottom-left, hidden on welcome */}
      {screen.type !== "welcome" && (
        <button
          onClick={() => setShowNav(v => !v)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-white border border-[#D4D4D4] shadow-sm px-3 py-2.5 text-xs font-semibold text-[#555] hover:bg-[#F5F5F5] transition-colors"
          aria-label="Navigation menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Sections
        </button>
      )}

      {/* Nav Menu Overlay */}
      <AnimatePresence>
        {showNav && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowNav(false)}
            />
            {/* Panel — slides up from bottom */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-60 bg-white shadow-2xl sm:left-6 sm:right-auto sm:w-80 sm:bottom-20 sm:rounded-xl"
            >
              <div className="px-5 pt-5 pb-2 border-b border-[#F0F0F0] flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#999]">Jump to section</p>
                {process.env.NEXT_PUBLIC_SHOW_BETA_TAG === "true" && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: brandPrimary }}
                  >
                    Beta
                  </span>
                )}
              </div>
              <div className="pb-3">
                {NAV_SECTIONS.map((section, i) => {
                  const isActive = screenIndex >= section.screenIdx &&
                    (i === NAV_SECTIONS.length - 1 || screenIndex < NAV_SECTIONS[i + 1].screenIdx)
                  const isDone = section.fields.every(fk => {
                    // Skip q2 when Q2a = "A" (capacity flag — screen is hidden)
                    if (fk === "q2" && formData.q2a === "A") return true
                    const v = (formData as any)[fk]
                    return v !== null && v !== undefined && String(v).trim() !== ""
                  })
                  return (
                    <button
                      key={i}
                      onClick={() => goToScreen(section.screenIdx)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[#F7F7F7] transition-colors ${isActive ? "bg-[#F7F7F7]" : ""}`}
                    >
                      <div
                        className="w-6 h-6 flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={isDone || isActive
                          ? { backgroundColor: "var(--brand-primary)", color: "#fff" }
                          : { backgroundColor: "#EBEBEB", color: "#999" }}
                      >
                        {isDone && !isActive ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : section.icon}
                      </div>
                      <span className={`text-sm ${isActive ? "font-semibold text-[#1A1A1A]" : "text-[#555]"}`}>
                        {section.label}
                      </span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--brand-primary)" }} />
                      )}
                    </button>
                  )
                })}
              </div>
              {/* Get Help button */}
              <div className="px-5 pt-2 pb-4 border-t border-[#F0F0F0]">
                <button
                  onClick={() => { setShowNav(false); setBookingOpen(true) }}
                  className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Get Help Filling This Form
                </button>
                <p className="text-[10px] text-[#AAA] text-center mt-1.5">Book a call — we'll fill it with you</p>
              </div>

              {/* Mobile: swipe-down handle */}
              <div className="flex justify-center pb-4 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-[#DDD]" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
        {/* Feedback beside nav arrows — desktop only */}
        <div className="hidden fixed bottom-6 right-30 sm:block">
          {screen.type !== "welcome" &&
            <FeedbackWidget
              page="constraint-audit"
              brandColor={brandPrimary}
              positionClassName="flex flex-col items-end"
            />
          }
        </div>
        {/* Bottom-right fixed bar — feedback (desktop) + nav arrows */}
        <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
          {/* Nav arrows — hidden on welcome/submit */}
          {screen.type !== "welcome" && screen.type !== "submit" && (
            <>
              <button
                onClick={goPrev}
                disabled={screenIndex === 0}
                className="w-10 h-10 text-white flex items-center justify-center disabled:opacity-30 transition-colors"
                style={{ backgroundColor: "var(--brand-primary)" }}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                disabled={!canAdvance()}
                className="w-10 h-10 text-white flex items-center justify-center disabled:opacity-30 transition-colors"
                style={{ backgroundColor: "var(--brand-primary)" }}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Booking Modal — "Get Help" flow from nav */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        prefill={{
          firstName: formData.ownerName ? formData.ownerName.split(" ")[0] : undefined,
          lastName: formData.ownerName ? formData.ownerName.split(" ").slice(1).join(" ") || undefined : undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          monthlyRevenue: formData.monthlyRevenue || undefined,
          source: "nav_form",
        }}
      />

      {/* Feedback centered — mobile only */}
      <FeedbackWidget
        page="constraint-audit"
        brandColor={brandPrimary}
        positionClassName="sm:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// Welcome Screen
// ─────────────────────────────────────────────

function WelcomeScreen({ onStart, brandColor = "#1A1A1A" }: { onStart: () => void; brandColor?: string }) {
  const brandPrimary = brandColor
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto w-full">
      {/* Back link */}
      <div className="mb-12 flex justify-between items-center">
        <Link
          href="/"
          className="text-sm text-[#666] hover:text-[#2D2D2D] transition-colors inline-flex items-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to site
        </Link>

        <div className={`flex flex-col items-start z-50 flex flex-col gap-2`}>
          {/* Floating button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { }}
            className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all"
            style={{ backgroundColor: brandColor }}
          >

            <span className="flex items-center gap-1.5">
              <span
                className="text-[8px] font-bold uppercase tracking-widest bg-white rounded px-1 py-0.5"
                style={{ color: brandColor }}
              >
                Beta
              </span>
              v2
            </span>
          </motion.button>
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 mb-8">
        {/*<div className="w-2 h-2 rounded-full bg-[#177fc9]" />*/}
        <span className="text-xs font-semibold tracking-widest text-[#177fc9] uppercase">
          Startup Bodyshop · Sierra Leone
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2" style={{ color: brandPrimary }}>
        The Constraint-Busting
      </h1>
      <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-3" style={{ color: brandPrimary }}>
        Business Audit
      </h1>
      {/*<p className="text-sm font-medium text-[#888] mb-10 tracking-wide">Version 3.0</p>*/}
      <hr className="my-4" />

      {/* About */}
      <div className="space-y-4 mb-10">
        <p className="text-base text-[#3D3D3D] leading-relaxed">
          This assessment identifies the single constraint holding your business back.
          It takes approximately <strong style={{ color: brandPrimary }}>15 minutes</strong> to complete.
        </p>
        <p className="text-base text-[#3D3D3D] leading-relaxed">
          Answer each question as honestly as you can — there are no right or wrong answers.
          The more accurate your responses, the more useful your result will be.
        </p>
      </div>

      {/* What you'll get */}
      <div className="bg-white/60 border border-white/80 rounded-xl p-5 mb-10">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">On completion you will receive</p>
        <ul className="space-y-2">
          {[
            "Scores on all 5 growth levers",
            "Your primary constraint identified",
            "Estimated revenue opportunity",
            "A recommended next step",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#2D2D2D]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#177fc9" strokeWidth={2.5} className="w-4 h-4 mt-0.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-3 text-white px-8 py-4 text-base font-semibold transition-colors"
          style={{ backgroundColor: brandPrimary }}
        >
          Start the Audit
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <span className="text-sm text-[#999]">~15 minutes</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Section Intro Screen
// ─────────────────────────────────────────────

function SectionIntroScreen({
  screen,
  onContinue,
  onBack,
  brandColor = "#1A1A1A",
}: {
  screen: Screen
  onContinue: () => void
  onBack: () => void
  brandColor?: string
}) {
  const brandPrimary = brandColor
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto w-full">
      {/* Lever number pill */}
      <div className="mb-10">
        {screen.leverNumber && screen.leverNumber <= 5 ? (
          <span className="inline-block text-xs font-bold tracking-widest text-[#888] uppercase border border-[#CCC] px-3 py-1">
            Lever {screen.leverNumber} of 5
          </span>
        ) : (
          <span className="inline-block text-xs font-bold tracking-widest text-[#888] uppercase border border-[#CCC] px-3 py-1">
            Final Section
          </span>
        )}
      </div>

      {/* Lever name */}
      <h2 className="text-5xl sm:text-6xl font-bold mb-3" style={{ color: brandPrimary }}>
        {screen.leverName}
      </h2>
      <p className="text-lg font-medium text-[#888] mb-6">{screen.leverTagline}</p>
      <p className="text-base text-[#3D3D3D] leading-relaxed max-w-lg mb-12">
        {screen.leverDescription}
      </p>

      {/* Continue */}
      <div className="flex items-center gap-4">
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-3 text-white px-7 py-3.5 text-sm font-semibold transition-colors"
          style={{ backgroundColor: brandPrimary }}
        >
          Continue
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <span className="text-xs text-[#999]">press Enter ↵</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Multi-Input Screen (Business Info groups)
// ─────────────────────────────────────────────

function MultiInputScreen({
  screen,
  formData,
  onChange,
  onNext,
  onBack,
  canAdvance,
  brandColor = "#1A1A1A",
}: {
  screen: Screen
  formData: FormData
  onChange: (field: string, value: any) => void
  onNext: () => void
  onBack: () => void
  canAdvance: boolean
  brandColor?: string
}) {
  const brandPrimary = brandColor
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const validate = (field: InputField, val: string): string => {
    if (field.key === "teamSize") return ""
    if (!val.trim()) return "Required"
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Enter a valid email (e.g. you@example.com)"
    if (field.type === "tel" && val.replace(/[\s+\-()]/g, "").length < 7)
      return "Enter a valid phone number"
    if (field.type === "number" && isNaN(Number(val)))
      return "Must be a number"
    return ""
  }

  const handleNext = () => {
    // Touch all fields to show errors
    const allTouched: Record<string, boolean> = {}
    screen.fields?.forEach(f => { allTouched[f.key] = true })
    setTouched(allTouched)
    if (canAdvance) onNext()
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs font-semibold text-[#888] uppercase tracking-widest mb-4">
          Business Information
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: brandPrimary }}>
          {screen.groupTitle}
        </h2>
        {screen.groupSubtitle && (
          <p className="text-sm text-[#777] leading-relaxed">{screen.groupSubtitle}</p>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-6 mb-10">
        {screen.fields?.map(field => {
          const val = String((formData as any)[field.key] ?? "")
          const error = touched[field.key] ? validate(field, val) : ""
          const hasError = !!error
          return (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-[#888] uppercase tracking-wider mb-1.5">
                {field.label}
                {field.key !== "teamSize" && <span className="text-[#C0392B] ml-1">*</span>}
              </label>
              <div
                className="flex items-center gap-2 border-b-2 transition-colors pb-1"
                style={{ borderColor: hasError ? "#C0392B" : focusedField === field.key ? brandPrimary : "#CCC" }}
              >
                {field.prefix && (
                  <span className="text-sm font-medium text-[#888]">{field.prefix}</span>
                )}
                <input
                  type={field.type ?? "text"}
                  value={val}
                  onChange={e => onChange(field.key, e.target.value)}
                  onFocus={() => setFocusedField(field.key)}
                  onBlur={() => { setTouched(t => ({ ...t, [field.key]: true })); setFocusedField(null) }}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent text-base text-[#1A1A1A] placeholder-[#BBB] outline-none"
                  onKeyDown={e => {
                    if (e.key === "Enter") { e.preventDefault(); handleNext() }
                  }}
                />
              </div>
              {hasError && (
                <p className="mt-1 text-xs text-[#C0392B]">{error}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleNext}
          disabled={!canAdvance}
          className="inline-flex items-center gap-3 text-white px-7 py-3.5 text-sm font-semibold transition-colors disabled:opacity-40"
          style={{ backgroundColor: brandPrimary }}
        >
          OK
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <span className="text-xs text-[#999]">press Enter ↵</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Choice Screen
// ─────────────────────────────────────────────

function ChoiceScreen({
  screen,
  currentValue,
  justSelected,
  onSelect,
  onNext,
  onBack,
  canAdvance,
  brandColor = "#1A1A1A",
}: {
  screen: Screen
  currentValue: any
  justSelected: string | null
  onSelect: (fieldKey: string, value: string | number) => void
  onNext: () => void
  onBack: () => void
  canAdvance: boolean
  brandColor?: string
}) {
  const brandPrimary = brandColor
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto w-full">
      {/* Question number + section */}
      <div className="mb-6 flex items-center gap-3">
        {screen.questionNumber !== undefined && screen.questionNumber > 0 ? (
          <span className="text-sm font-bold text-[#2D2D2D]">
            {screen.questionNumber}
            <span className="ml-1 text-[#2D2D2D]">→</span>
          </span>
        ) : null}
        <span className="text-xs font-semibold text-[#999] uppercase tracking-wider">
          {screen.section}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-4 max-w-xl" style={{ color: brandPrimary }}>
        {screen.question}
      </h2>

      {/* Hint */}
      {screen.hint && (
        <p className="text-sm text-[#777] leading-relaxed mb-8 max-w-xl border-l-2 border-[#D4D4D4] pl-3">
          {screen.hint}
        </p>
      )}

      {/* Options */}
      <div className="space-y-2 mb-8">
        {screen.options?.map((opt, i) => {
          const isSelected = String(currentValue) === String(opt.value)
          const isJust = justSelected === String(opt.value)
          return (
            <motion.button
              key={i}
              onClick={() => onSelect(screen.fieldKey!, opt.value)}
              initial={false}
              animate={{
                backgroundColor: isJust || isSelected ? brandPrimary : "#FFFFFF",
                borderColor: isSelected ? brandPrimary : "#D4D4D4",
                color: isSelected ? "#FFFFFF" : "#1A1A1A",
              }}
              whileHover={{ borderColor: brandPrimary }}
              transition={{ duration: 0.15 }}
              className="w-full flex items-center gap-3 px-4 py-3 border text-left transition-colors"
            >
              {/* Letter badge */}
              <span
                className="flex-shrink-0 w-6 h-6 text-[11px] font-bold flex items-center justify-center border transition-colors"
                style={{
                  borderColor: isSelected ? "rgba(255,255,255,0.4)" : "#D4D4D4",
                  color: isSelected ? "rgba(255,255,255,0.8)" : "#888",
                }}
              >
                {OPTION_LETTERS[i]}
              </span>
              <span className="text-sm font-medium leading-snug">{opt.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* CTA row */}
      {canAdvance && (
        <div className="flex items-center gap-4">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-3 text-white px-7 py-3.5 text-sm font-semibold transition-colors"
            style={{ backgroundColor: brandPrimary }}
          >
            OK
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <span className="text-xs text-[#999]">press Enter ↵</span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Textarea Screen
// ─────────────────────────────────────────────

function TextareaScreen({
  screen,
  value,
  onChange,
  onNext,
  onBack,
  canAdvance,
  brandColor = "#1A1A1A",
}: {
  screen: Screen
  value: string
  onChange: (val: string) => void
  onNext: () => void
  onBack: () => void
  canAdvance: boolean
  brandColor?: string
}) {
  const brandPrimary = brandColor
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaFocused, setTextareaFocused] = useState(false)

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 300)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto w-full">
      {/* Question number + section */}
      <div className="mb-6 flex items-center gap-3">
        {screen.questionNumber !== undefined && (
          <span className="text-sm font-bold text-[#2D2D2D]">
            {screen.questionNumber}
            <span className="ml-1">→</span>
          </span>
        )}
        <span className="text-xs font-semibold text-[#999] uppercase tracking-wider">
          {screen.section}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-4 max-w-xl" style={{ color: brandPrimary }}>
        {screen.question}
      </h2>

      {/* Hint */}
      {screen.hint && (
        <p className="text-sm text-[#777] leading-relaxed mb-8 max-w-xl border-l-2 border-[#D4D4D4] pl-3">
          {screen.hint}
        </p>
      )}

      {/* Textarea */}
      <div className="border-b-2 transition-colors mb-8" style={{ borderColor: textareaFocused ? brandPrimary : "#CCC" }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Type your answer here..."
          rows={3}
          className="w-full bg-transparent text-base text-[#1A1A1A] placeholder-[#BBB] outline-none resize-none leading-relaxed py-2"
          onFocus={() => setTextareaFocused(true)}
          onBlur={() => setTextareaFocused(false)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (canAdvance) onNext()
            }
          }}
        />
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="inline-flex items-center gap-3 text-white px-7 py-3.5 text-sm font-semibold transition-colors disabled:opacity-40"
          style={{ backgroundColor: brandPrimary }}
        >
          OK
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <span className="text-xs text-[#999]">press Enter ↵</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Submit Screen
// ─────────────────────────────────────────────

function SubmitScreen({
  formData,
  onSubmit,
  onBack,
  brandColor = "#1A1A1A",
}: {
  formData: FormData
  onSubmit: () => void
  onBack: () => void
  brandColor?: string
}) {
  const brandPrimary = brandColor
  // Build the list of required choice screens, excluding Q2 when Q2a = "A"
  const capacityFlag = formData.q2a === "A"
  const requiredScreens = SCREENS.filter(s => {
    if (s.type !== "choice" || !s.fieldKey) return false
    // Q2 is not required when business is at full capacity
    if (s.fieldKey === "q2" && capacityFlag) return false
    return true
  })

  const answered = requiredScreens.filter(s => {
    const val = (formData as any)[s.fieldKey!]
    return val !== null && val !== undefined && val !== ""
  }).length
  const total = requiredScreens.length
  const allAnswered = answered === total

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto w-full">
      {/* Completion indicator */}
      <div className="mb-10">
        <div className="w-14 h-14 flex items-center justify-center mb-6" style={{ backgroundColor: brandPrimary }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3">
          You're done.
        </h2>
        <p className="text-base text-[#555] leading-relaxed max-w-md">
          {answered} of {total} questions answered.
          {!allAnswered && (
            <span className="text-[#C0392B]"> Some questions are still unanswered — go back and complete them to generate your report.</span>
          )}
        </p>
      </div>

      {/* What happens next */}
      <div className="bg-white/50 border border-white/70 rounded-xl p-5 mb-10">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">What happens next</p>
        <ol className="space-y-2.5">
          {[
            "Your scores across all 5 growth levers are calculated",
            "Your primary constraint is identified",
            "Your estimated revenue opportunity is generated",
            "Your personalised diagnostic report is displayed immediately",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#2D2D2D]">
              <span className="flex-shrink-0 w-5 h-5 text-white text-[10px] font-bold flex items-center justify-center rounded-full mt-0.5" style={{ backgroundColor: brandPrimary }}>
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </div>

      {/* Business info summary */}
      {formData.businessName && (
        <div className="mb-8 text-sm text-[#777]">
          Submitting for <strong className="text-[#2D2D2D]">{formData.businessName}</strong>
          {formData.ownerName && <> · {formData.ownerName}</>}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={onSubmit}
          disabled={!allAnswered}
          className="inline-flex items-center gap-3 text-white px-8 py-4 text-base font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: brandPrimary }}
        >
          Generate My Report
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={onBack}
          className="text-sm text-[#888] hover:text-[#2D2D2D] transition-colors underline underline-offset-2"
        >
          Go back
        </button>
      </div>
    </div>
  )
}
