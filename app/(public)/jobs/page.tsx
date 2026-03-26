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
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
          Browse Open Positions
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-secondary">
          Find opportunities in your network and earn referral fees
        </p>
      </div>
      <div className="mt-12">
        <JobSearch jobs={typedJobs} />
      </div>
    </div>
  )
}
