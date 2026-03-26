import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import HomeHero from '@/components/home/HomeHero'
import HomeRoles from '@/components/home/HomeRoles'
import HomeHowItWorks from '@/components/home/HomeHowItWorks'
import HomeTrust from '@/components/home/HomeTrust'
import HomeFooterCta from '@/components/home/HomeFooterCta'
import { formatUsd, toUsd } from '@/lib/utils/fee'
import type { Job } from '@/types'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Referio — Your Network, Rewarded',
    description:
      'Connect exceptional talent with senior roles. Earn $5,000 to $25,000+ in referral fees when they get hired.',
  }
}

export default async function HomePage() {
  const supabase = createServiceClient()

  // Fetch featured jobs ordered by highest fee
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('referral_fee', { ascending: false })
    .limit(6)

  const typedJobs = (jobs ?? []) as Job[]

  // Compute aggregate stats
  const { count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const jobCount = count ?? typedJobs.length

  const totalFees = typedJobs.reduce(
    (sum, j) => sum + toUsd(j.referral_fee, j.fee_currency),
    0
  )
  const averageFee = typedJobs.length > 0
    ? Math.round(totalFees / typedJobs.length)
    : 0

  // First job goes to hero, rest to roles section
  const featuredJob = typedJobs[0] ?? null
  const remainingJobs = typedJobs.slice(1)

  return (
    <>
      <HomeHero featuredJob={featuredJob} totalJobs={jobCount} />
      <HomeRoles jobs={remainingJobs} />
      <HomeHowItWorks />
      <HomeTrust
        totalFees={formatUsd(totalFees)}
        jobCount={jobCount}
        averageFee={formatUsd(averageFee)}
      />
      <HomeFooterCta />
    </>
  )
}
