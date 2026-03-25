import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import JobSearch from '@/components/jobs/JobSearch'
import type { Job } from '@/types'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServiceClient()
  const { count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  return {
    title: 'Browse Referral Jobs — Earn $5,000–$20,000+',
    description: `${count ?? 0} high-value referral opportunities. Earn a fee when your referral gets hired.`,
  }
}

export default async function JobsPage() {
  const supabase = createServiceClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const typedJobs = (jobs ?? []) as Job[]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Browse Open Positions
      </h1>
      <p className="mt-2 text-gray-500">
        Find opportunities in your network and earn referral fees
      </p>
      <div className="mt-8">
        <JobSearch jobs={typedJobs} />
      </div>
    </div>
  )
}
