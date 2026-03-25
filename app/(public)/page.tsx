import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { formatFee } from '@/lib/utils/fee'
import JobGrid from '@/components/jobs/JobGrid'
import type { Job } from '@/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Referio — Refer Great People. Get Paid. Guaranteed.',
  description:
    'Browse high-value job referral opportunities. Earn $5,000–$20,000+ when your referral gets hired.',
  openGraph: {
    type: 'website',
    siteName: 'Referio',
  },
}

export default async function HomePage() {
  const supabase = createServiceClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  const { count: jobCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { data: feeStats } = await supabase
    .from('jobs')
    .select('referral_fee, fee_currency')
    .eq('status', 'active')

  const maxFee = feeStats?.reduce(
    (max, j) => (j.referral_fee > max ? j.referral_fee : max),
    0
  ) ?? 0
  const maxFeeCurrency = feeStats?.find((j) => j.referral_fee === maxFee)?.fee_currency ?? 'USD'
  const maxFeeFormatted = maxFee > 0 ? formatFee(maxFee, maxFeeCurrency) : '$20,000+'

  const typedJobs = (jobs ?? []) as Job[]

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-800 to-cyan-600 px-4 py-20 text-white sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {(jobCount ?? 0) > 0 && (
            <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
              {jobCount} roles available
            </span>
          )}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Make introductions and get paid. Guaranteed.
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Refer great people to great companies. Earn up to{' '}
            {maxFeeFormatted} when they&apos;re hired.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/jobs"
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Browse Jobs &rarr;
            </Link>
            <a
              href="mailto:hello@referio.io"
              className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED OPPORTUNITIES */}
      {typedJobs.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Opportunities
          </h2>
          <div className="mt-8">
            <JobGrid jobs={typedJobs} />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/jobs"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All Jobs &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            How It Works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Browse Open Roles',
                desc: 'Find opportunities that match your network',
              },
              {
                step: '2',
                title: 'Refer Someone Great',
                desc: 'Submit their details in minutes',
              },
              {
                step: '3',
                title: 'Get Paid',
                desc: "Earn your fee when they're hired. Guaranteed terms.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY REFERIO */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Why Referio
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            {
              title: 'Transparent Fees',
              desc: 'Every job lists the exact referral fee upfront. No guessing.',
            },
            {
              title: 'Clear Payout Terms',
              desc: 'Know exactly when you get paid — at hire, on start, or after probation.',
            },
            {
              title: 'Quality Roles',
              desc: 'Only high-value positions from vetted employers.',
            },
            {
              title: 'Simple Process',
              desc: 'Submit a referral in minutes. We handle the rest.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-100 p-6"
            >
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-gray-900 px-4 py-16 text-center text-white sm:px-6">
        <h2 className="text-2xl font-bold">Ready to Start Referring?</h2>
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse Jobs &rarr;
        </Link>
      </section>
    </>
  )
}
