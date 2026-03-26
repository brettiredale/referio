'use client'

import { useState } from 'react'
import JobGrid from '@/components/jobs/JobGrid'
import type { Job } from '@/types'

export default function JobSearch({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState('')

  const filtered = jobs.filter((job) => {
    const q = query.toLowerCase()
    return (
      job.title.toLowerCase().includes(q) ||
      job.company_name.toLowerCase().includes(q) ||
      (job.location?.toLowerCase().includes(q) ?? false)
    )
  })

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title, company, or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-zinc-500"
        />
      </div>
      <JobGrid jobs={filtered} />
    </div>
  )
}
