'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/layout/Header'
import AdminJobsTab from '@/components/admin/AdminJobsTab'
import AdminReferralsTab from '@/components/admin/AdminReferralsTab'
import AdminEmployersTab from '@/components/admin/AdminEmployersTab'

type Tab = 'jobs' | 'referrals' | 'employers'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('jobs')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/')
        return
      }

      const { data: referrer } = await supabase
        .from('referrers')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!referrer?.is_admin) {
        router.replace('/')
        return
      }

      setLoading(false)
    }

    checkAdmin()
  }, [supabase, router])

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-100" />
            <div className="h-4 w-64 rounded bg-gray-100" />
          </div>
        </main>
      </>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'jobs', label: 'Jobs' },
    { key: 'referrals', label: 'Referrals' },
    { key: 'employers', label: 'Employers' },
  ]

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

        <div className="mt-6 flex gap-1 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                tab === t.key
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'jobs' && <AdminJobsTab />}
          {tab === 'referrals' && <AdminReferralsTab />}
          {tab === 'employers' && <AdminEmployersTab />}
        </div>
      </main>
    </>
  )
}
