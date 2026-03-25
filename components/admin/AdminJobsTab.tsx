'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatFee } from '@/lib/utils/fee'
import type { JobStatus } from '@/types'

interface JobRow {
  id: string
  title: string
  company_name: string
  referral_fee: number
  fee_currency: string
  status: string
  created_at: string
  referral_count: number
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-amber-100 text-amber-700',
  filled: 'bg-blue-100 text-blue-700',
  removed: 'bg-red-100 text-red-700',
}

const FILTERS: (JobStatus | 'all')[] = [
  'all',
  'active',
  'paused',
  'filled',
  'removed',
]

const STATUS_ACTIONS: Record<string, { label: string; status: JobStatus }[]> = {
  active: [
    { label: 'Pause', status: 'paused' },
    { label: 'Mark Filled', status: 'filled' },
    { label: 'Remove', status: 'removed' },
  ],
  paused: [
    { label: 'Activate', status: 'active' },
    { label: 'Mark Filled', status: 'filled' },
    { label: 'Remove', status: 'removed' },
  ],
  filled: [
    { label: 'Reopen', status: 'active' },
    { label: 'Remove', status: 'removed' },
  ],
  removed: [{ label: 'Reopen', status: 'active' }],
}

export default function AdminJobsTab() {
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [filter, setFilter] = useState<JobStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const supabase = createClient()

  const fetchJobs = useCallback(async () => {
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('id, title, company_name, referral_fee, fee_currency, status, created_at')
      .order('created_at', { ascending: false })

    if (!jobsData) {
      setJobs([])
      setLoading(false)
      return
    }

    // Get referral counts per job
    const { data: counts } = await supabase
      .from('referrals')
      .select('job_id')

    const countMap: Record<string, number> = {}
    for (const c of counts ?? []) {
      countMap[c.job_id] = (countMap[c.job_id] ?? 0) + 1
    }

    setJobs(
      jobsData.map((j) => ({
        ...j,
        referral_count: countMap[j.id] ?? 0,
      }))
    )
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  async function updateJobStatus(jobId: string, status: JobStatus) {
    if (status === 'removed' && !confirm('Are you sure you want to remove this job?')) {
      return
    }

    setOpenMenu(null)

    await fetch(`/api/v1/admin/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    fetchJobs()
  }

  const filtered =
    filter === 'all' ? jobs : jobs.filter((j) => j.status === filter)

  if (loading) {
    return <p className="text-sm text-gray-500">Loading jobs...</p>
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
              filter === f
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 font-medium">Title</th>
              <th className="pb-3 font-medium">Company</th>
              <th className="pb-3 font-medium">Fee</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Created</th>
              <th className="pb-3 font-medium">Referrals</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j.id} className="border-b border-gray-50">
                <td className="py-3 font-medium text-gray-900">{j.title}</td>
                <td className="py-3 text-gray-500">{j.company_name}</td>
                <td className="py-3 text-green-700">
                  {formatFee(j.referral_fee, j.fee_currency)}
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[j.status] ?? 'bg-gray-100 text-gray-500'}`}
                  >
                    {j.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">
                  {new Date(j.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-3 text-center text-gray-500">
                  {j.referral_count}
                </td>
                <td className="relative py-3">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === j.id ? null : j.id)
                    }
                    className="rounded px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
                  >
                    Actions
                  </button>
                  {openMenu === j.id && (
                    <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                      {(STATUS_ACTIONS[j.status] ?? []).map((action) => (
                        <button
                          key={action.status}
                          onClick={() =>
                            updateJobStatus(j.id, action.status)
                          }
                          className="block w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            No jobs found.
          </p>
        )}
      </div>
    </div>
  )
}
