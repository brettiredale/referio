'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface EmployerRow {
  id: string
  company_name: string
  magichire_client_id: string
  created_at: string
  total_jobs: number
  active_jobs: number
}

export default function AdminEmployersTab() {
  const [employers, setEmployers] = useState<EmployerRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchEmployers = useCallback(async () => {
    const { data: employersData } = await supabase
      .from('employers')
      .select('id, company_name, magichire_client_id, created_at')
      .order('created_at', { ascending: false })

    if (!employersData) {
      setEmployers([])
      setLoading(false)
      return
    }

    // Get job counts per employer
    const { data: jobs } = await supabase
      .from('jobs')
      .select('employer_id, status')

    const totalMap: Record<string, number> = {}
    const activeMap: Record<string, number> = {}
    for (const j of jobs ?? []) {
      totalMap[j.employer_id] = (totalMap[j.employer_id] ?? 0) + 1
      if (j.status === 'active') {
        activeMap[j.employer_id] = (activeMap[j.employer_id] ?? 0) + 1
      }
    }

    setEmployers(
      employersData.map((e) => ({
        ...e,
        total_jobs: totalMap[e.id] ?? 0,
        active_jobs: activeMap[e.id] ?? 0,
      }))
    )
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchEmployers()
  }, [fetchEmployers])

  if (loading) {
    return <p className="text-sm text-gray-500">Loading employers...</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-3 font-medium">Company</th>
            <th className="pb-3 font-medium">MagicHire Client ID</th>
            <th className="pb-3 font-medium">Active Jobs</th>
            <th className="pb-3 font-medium">Total Jobs</th>
            <th className="pb-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {employers.map((e) => (
            <tr key={e.id} className="border-b border-gray-50">
              <td className="py-3 font-medium text-gray-900">
                {e.company_name}
              </td>
              <td className="py-3 font-mono text-xs text-gray-500">
                {e.magichire_client_id}
              </td>
              <td className="py-3 text-center text-green-700">
                {e.active_jobs}
              </td>
              <td className="py-3 text-center text-gray-500">
                {e.total_jobs}
              </td>
              <td className="py-3 text-gray-500">
                {new Date(e.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employers.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          No employers found.
        </p>
      )}
    </div>
  )
}
