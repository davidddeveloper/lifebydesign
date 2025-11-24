"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { JobApplicationModal } from "@/components/job-application-modal"

interface Job {
  id: string
  title: string
  department: string
  type: string
  description: string
  keyResponsibilities: string[]
  requirements: string[]
  compensation: string
  email: string
}

const jobs: Job[] = [
  {
    id: "financial-management-partner",
    title: "Financial Management Partner",
    department: "Finance",
    type: "Full-time Partnership",
    description: "A finance pro who thinks like a founder. We're looking for one who can make the numbers move.",
    keyResponsibilities: [
      "Oversee The Bodyshop's internal accounting and financial reporting (30% of your focus)",
      "Lead the rollout of our Financial Management Product for SMEs (70% of your focus)",
      "Work directly with founders to install Financial Management Systems, pricing, and dashboard systems",
      "Facilitate workshops and hands-on sessions with growing businesses",
      "Earn not just a salary — but a profit share from the success you create",
    ],
    requirements: [
      "Strong accounting background (ACCA, CPA, or equivalent)",
      "5+ years in finance, accounting, or SME advisory",
      "Entrepreneurial energy — comfortable with risk, results, and growth",
      "Ability to teach and translate finance into business decisions",
      "A builder's mindset: you see systems where others see spreadsheets",
    ],
    compensation:
      "Competitive base pay + 20-30% profit share on external projects. Fast-track to partnership or equity for high performance.",
    email: "info@lbd.sl",
  },
  {
    id: "video-editor-designer",
    title: "Video Editor + Graphic Designer Partner",
    department: "Creative & Media",
    type: "Full-time Partnership",
    description:
      "A visual storyteller who understands business, brand, and impact. Help bring The JABShow and our media efforts to life.",
    keyResponsibilities: [
      "Edit and produce The JABShow episodes for YouTube and other platforms",
      "Create short-form content (Reels, Shorts, TikToks) that drives visibility and engagement",
      "Design high-quality graphics, thumbnails, and brand assets for campaigns and announcements",
      "Develop a consistent visual identity across all The Startup Bodyshop brands",
      "Work closely with the content and strategy team to transform raw ideas into standout visuals",
    ],
    requirements: [
      "Solid experience in video editing and graphic design",
      "Proficiency in Premiere Pro, Final Cut, DaVinci Resolve, Photoshop, or Illustrator",
      "Understanding of social media content trends and storytelling",
      "Strong sense of design, layout, and branding",
      "The ability to manage deadlines, deliver quality consistently, and adapt creatively",
      "A builder's mindset — you think about the bigger picture, not just the frame",
    ],
    compensation:
      "Competitive base pay + profit share from content-led growth projects. Long-term partnership opportunity with creative freedom.",
    email: "info@lbd.sl",
  },
]

export function JobsSection() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // store expanded jobs
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedJobs((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 text-balance">
              Join Our <span className="text-[#177fc9]">Team</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We're not just hiring employees — we're recruiting partners who share our vision of building great
              businesses.
            </p>
          </motion.div>

          {/* Jobs List */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {jobs.map((job) => {
              const isExpanded = expandedJobs[job.id] || false

              return (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  className="border-2 border-gray-200 rounded-xl p-6 md:p-8 hover:border-[#42adff] hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#177fc9] text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {job.department}
                        </span>
                        <span className="text-gray-600 text-sm font-medium">{job.type}</span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{job.title}</h2>
                      <p className="text-gray-600 text-lg leading-relaxed mb-4">{job.description}</p>

                      {/* Key Responsibilities */}
                      <div className="space-y-3 mb-2">
                        <h3 className="font-bold text-gray-900">What You'll Do:</h3>

                        {/* always show first 3 */}
                        <ul className="space-y-2">
                          {job.keyResponsibilities.slice(0, 3).map((resp, idx) => (
                            <li key={idx} className="text-gray-600 flex items-start gap-2">
                              <span className="text-[#177fc9] font-bold mt-1">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Expandable extra responsibilities */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35 }}
                              className="overflow-hidden space-y-2"
                            >
                              {job.keyResponsibilities.slice(3).map((resp, idx) => (
                                <li key={idx} className="text-gray-600 flex items-start gap-2">
                                  <span className="text-[#177fc9] font-bold mt-1">•</span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>

                        {/* Toggle Button */}
                        {job.keyResponsibilities.length > 3 && (
                          <button
                            onClick={() => toggleExpand(job.id)}
                            className="text-sm text-[#177fc9] font-semibold hover:underline mt-2"
                          >
                            {isExpanded
                              ? "Show less"
                              : `+ ${job.keyResponsibilities.length - 3} more responsibilities`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApplyClick(job)}
                      className="bg-[#177fc9] hover:bg-[#42adff] text-white font-bold py-3 px-8 rounded-full whitespace-nowrap transition-colors md:absolute md:right-0"
                    >
                      Apply Now
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center bg-gray-50 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Don't see your role?</h3>
            <p className="text-gray-600 mb-4">
              We're always looking for talented individuals. Send your CV to{" "}
              <a href="mailto:info@lbd.sl" className="text-[#177fc9] font-semibold hover:underline">
                info@lbd.sl
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setTimeout(() => setSelectedJob(null), 300)
          }}
          job={selectedJob}
        />
      )}
    </>
  )
}

export default JobsSection