'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatFee } from '@/lib/utils/fee'
import ReferralStatusBadge from '@/components/referral/ReferralStatusBadge'
import Header from '@/components/layout/Header'
import type { ReferralStatus } from '@/types'

interface ReferralRow {
  id: string
  referee_name: string
  referee_email: string
  status: string
  created_at: string
  jobs: {
    title: string
    company_name: string
    url_slug: string
    referral_fee: number
    fee_currency: string
  } | null
}

export default function DashboardPage() {
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/')
        return
      }

      const { data } = await supabase
        .from('referrals')
        .select(
          'id, referee_name, referee_email, status, created_at, jobs(title, company_name, url_slug, referral_fee, fee_currency)'
        )
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })

      setReferrals((data as unknown as ReferralRow[]) ?? [])
      setLoading(false)
    }

    load()
  }, [supabase, router])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-100" />
            <div className="h-4 w-64 rounded bg-gray-100" />
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">My Referrals</h1>

        {referrals.length === 0 ? (
          <div className="mt-16 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              You haven&apos;t referred anyone yet.
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Find a role that matches someone in your network.
            </p>
            <Link
              href="/jobs"
              className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Browse open roles &rarr;
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-8 hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-3 font-medium">Job</th>
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Referee</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50">
                      <td className="py-3">
                        {r.jobs ? (
                          <Link
                            href={`/jobs/${r.jobs.url_slug}`}
                            className="font-medium text-blue-600 hover:text-blue-700"
                          >
                            {r.jobs.title}
                          </Link>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-500">
                        {r.jobs?.company_name ?? '—'}
                      </td>
                      <td className="py-3 text-gray-900">{r.referee_name}</td>
                      <td className="py-3 text-gray-500">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="py-3">
                        <ReferralStatusBadge
                          status={r.status as ReferralStatus}
                        />
                      </td>
                      <td className="py-3 text-right font-medium text-green-700">
                        {r.jobs
                          ? formatFee(r.jobs.referral_fee, r.jobs.fee_currency)
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="mt-6 space-y-4 sm:hidden">
              {referrals.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {r.jobs ? (
                        <Link
                          href={`/jobs/${r.jobs.url_slug}`}
                          className="font-medium text-blue-600"
                        >
                          {r.jobs.title}
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                      <p className="text-sm text-gray-500">
                        {r.jobs?.company_name}
                      </p>
                    </div>
                    <ReferralStatusBadge
                      status={r.status as ReferralStatus}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-900">{r.referee_name}</span>
                    <span className="text-gray-400">
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                  {r.jobs && (
                    <p className="mt-2 text-sm font-medium text-green-700">
                      {formatFee(r.jobs.referral_fee, r.jobs.fee_currency)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  )
}
