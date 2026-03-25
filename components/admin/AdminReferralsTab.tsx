'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import ReferralStatusBadge from '@/components/referral/ReferralStatusBadge'
import type { ReferralStatus, PushStatus } from '@/types'

interface ReferralRow {
  id: string
  referee_name: string
  referee_email: string
  status: string
  magichire_push_status: string
  magichire_push_error: string | null
  is_flagged: boolean
  created_at: string
  jobs: { title: string; company_name: string } | null
  referrers: { full_name: string; email: string } | null
}

const PUSH_STATUS_CONFIG: Record<string, { label: string; className: string }> =
  {
    pending: { label: 'Pending', className: 'bg-gray-100 text-gray-600' },
    candidate_created: {
      label: 'Candidate Created',
      className: 'bg-blue-100 text-blue-700',
    },
    application_submitted: {
      label: 'In MagicHire',
      className: 'bg-green-100 text-green-700',
    },
    failed_candidate: {
      label: 'Failed: Candidate',
      className: 'bg-red-100 text-red-700',
    },
    failed_application: {
      label: 'Failed: Application',
      className: 'bg-red-100 text-red-700',
    },
  }

const STATUS_OPTIONS: ReferralStatus[] = [
  'submitted',
  'reviewing',
  'interviewing',
  'hired',
  'rejected',
]

export default function AdminReferralsTab() {
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchReferrals = useCallback(async () => {
    const { data } = await supabase
      .from('referrals')
      .select(
        '*, jobs(title, company_name), referrers(full_name, email)'
      )
      .order('created_at', { ascending: false })

    setReferrals((data as ReferralRow[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchReferrals()
  }, [fetchReferrals])

  async function toggleFlag(id: string, currentFlag: boolean) {
    await fetch(`/api/v1/admin/referrals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_flagged: !currentFlag }),
    })
    fetchReferrals()
  }

  async function updateStatus(id: string, status: ReferralStatus) {
    await fetch(`/api/v1/admin/referrals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchReferrals()
  }

  const filtered = flaggedOnly
    ? referrals.filter((r) => r.is_flagged)
    : referrals

  if (loading) {
    return <p className="text-sm text-gray-500">Loading referrals...</p>
  }

  return (
    <div>
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={flaggedOnly}
          onChange={(e) => setFlaggedOnly(e.target.checked)}
          className="rounded border-gray-300"
        />
        Show flagged only
      </label>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 font-medium">Referee</th>
              <th className="pb-3 font-medium">Job</th>
              <th className="pb-3 font-medium">Company</th>
              <th className="pb-3 font-medium">Referrer</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Push Status</th>
              <th className="pb-3 font-medium">Flag</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const pushConfig =
                PUSH_STATUS_CONFIG[r.magichire_push_status as PushStatus] ??
                PUSH_STATUS_CONFIG.pending

              return (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="py-3">
                    <p className="font-medium text-gray-900">
                      {r.referee_name}
                    </p>
                    <p className="text-xs text-gray-400">{r.referee_email}</p>
                  </td>
                  <td className="py-3 text-gray-500">
                    {r.jobs?.title ?? '—'}
                  </td>
                  <td className="py-3 text-gray-500">
                    {r.jobs?.company_name ?? '—'}
                  </td>
                  <td className="py-3">
                    <p className="text-gray-900">
                      {r.referrers?.full_name ?? '—'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {r.referrers?.email}
                    </p>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(r.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        updateStatus(r.id, e.target.value as ReferralStatus)
                      }
                      className="rounded border border-gray-200 px-2 py-1 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${pushConfig.className}`}
                    >
                      {pushConfig.label}
                    </span>
                    {r.magichire_push_error && (
                      <p className="mt-1 text-xs text-red-500">
                        {r.magichire_push_error}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => toggleFlag(r.id, r.is_flagged)}
                      className={`text-lg ${r.is_flagged ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'}`}
                      title={r.is_flagged ? 'Unflag' : 'Flag'}
                    >
                      {r.is_flagged ? (
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 2v18l1-1V2H3zm2 0v9.5l5.5-3L16 12V2H5z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path d="M3 2v18l1-1V2H3zm2 0v9.5l5.5-3L16 12V2H5z" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            No referrals found.
          </p>
        )}
      </div>
    </div>
  )
}
