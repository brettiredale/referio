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
      (job.location?.toLowerCase().includes(q) ?? false)
    )
  })

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <JobGrid jobs={filtered} />
    </div>
  )
}
