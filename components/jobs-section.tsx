"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { JobApplicationModal } from "@/components/job-application-modal"

export interface Job {
  id: string
  title: string
  department: string
  type: string
  description: string
  keyResponsibilities: string[]
  requirements: string[]
  compensation: string
  email: string
  sanityDocumentId?: string
}

interface JobsSectionProps {
  jobs?: Job[]
}

export function JobsSection({ jobs = [] }: JobsSectionProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
              We&apos;re not just hiring employees — we&apos;re recruiting partners who share our vision of building great
              businesses.
            </p>
          </motion.div>

          {jobs.length === 0 ? (
            <div className="text-center bg-gray-50 rounded-xl p-10 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">No open roles right now</h2>
              <p className="text-gray-600">
                Check back soon, or send your CV to{" "}
                <a href="mailto:info@lbd.sl" className="text-[#177fc9] font-semibold hover:underline">
                  info@lbd.sl
                </a>
              </p>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              {jobs.map((job) => {
                const isExpanded = expandedJobs[job.id] || false
                const responsibilities = job.keyResponsibilities || []

                return (
                  <motion.div
                    key={job.id}
                    variants={itemVariants}
                    className="border-2 border-gray-200 rounded-xl p-6 md:p-8 hover:border-[#42adff] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {job.department && (
                            <span className="bg-[#177fc9] text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {job.department}
                            </span>
                          )}
                          {job.type && (
                            <span className="text-gray-600 text-sm font-medium">{job.type}</span>
                          )}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{job.title}</h2>
                        {job.description && (
                          <p className="text-gray-600 text-lg leading-relaxed mb-4">{job.description}</p>
                        )}

                        {responsibilities.length > 0 && (
                          <div className="space-y-3 mb-2">
                            <h3 className="font-bold text-gray-900">What You&apos;ll Do:</h3>

                            <ul className="space-y-2">
                              {responsibilities.slice(0, 3).map((resp, idx) => (
                                <li key={idx} className="text-gray-600 flex items-start gap-2">
                                  <span className="text-[#177fc9] font-bold mt-1">•</span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>

                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.35 }}
                                  className="overflow-hidden space-y-2"
                                >
                                  {responsibilities.slice(3).map((resp, idx) => (
                                    <li key={idx} className="text-gray-600 flex items-start gap-2">
                                      <span className="text-[#177fc9] font-bold mt-1">•</span>
                                      <span>{resp}</span>
                                    </li>
                                  ))}
                                  {job.requirements && job.requirements.length > 0 && (
                                    <>
                                      <li className="pt-2">
                                        <h3 className="font-bold text-gray-900">Requirements:</h3>
                                      </li>
                                      {job.requirements.map((req, idx) => (
                                        <li key={`req-${idx}`} className="text-gray-600 flex items-start gap-2">
                                          <span className="text-[#177fc9] font-bold mt-1">•</span>
                                          <span>{req}</span>
                                        </li>
                                      ))}
                                    </>
                                  )}
                                  {job.compensation && (
                                    <li className="pt-2 text-gray-600">
                                      <span className="font-bold text-gray-900">Compensation: </span>
                                      {job.compensation}
                                    </li>
                                  )}
                                </motion.ul>
                              )}
                            </AnimatePresence>

                            {(responsibilities.length > 3 ||
                              (job.requirements && job.requirements.length > 0) ||
                              job.compensation) && (
                              <button
                                onClick={() => toggleExpand(job.id)}
                                className="text-sm text-[#177fc9] font-semibold hover:underline mt-2"
                              >
                                {isExpanded
                                  ? "Show less"
                                  : responsibilities.length > 3
                                    ? `+ ${responsibilities.length - 3} more details`
                                    : "Show more details"}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

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
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center bg-gray-50 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Don&apos;t see your role?</h3>
            <p className="text-gray-600 mb-4">
              We&apos;re always looking for talented individuals. Send your CV to{" "}
              <a href="mailto:info@lbd.sl" className="text-[#177fc9] font-semibold hover:underline">
                info@lbd.sl
              </a>
            </p>
          </motion.div>
        </div>
      </section>

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
