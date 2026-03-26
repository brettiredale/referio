import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { formatFee, toUsd, formatUsd } from '@/lib/utils/fee'
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

  const totalFeesUsd = feeStats?.reduce(
    (sum, j) => sum + toUsd(j.referral_fee, j.fee_currency),
    0
  ) ?? 0
  const maxFeeUsd = feeStats?.reduce(
    (max, j) => {
      const usd = toUsd(j.referral_fee, j.fee_currency)
      return usd > max ? usd : max
    },
    0
  ) ?? 0

  const typedJobs = (jobs ?? []) as Job[]

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-blue-600 to-emerald-500 px-4 py-24 text-white sm:px-6">
        {/* Decorative blobs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Stats badges */}
          {(jobCount ?? 0) > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400">
                  <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                </span>
                {jobCount} {jobCount === 1 ? 'role' : 'roles'} live now
              </span>
              {totalFeesUsd > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                  <svg className="h-4 w-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a5.387 5.387 0 01-.491-.921H10a1 1 0 100-2H8.003a7.39 7.39 0 010-1H10a1 1 0 100-2H8.245c.155-.347.335-.668.491-.921z" />
                  </svg>
                  {formatUsd(totalFeesUsd)} in fees available
                </span>
              )}
            </div>
          )}

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Know great people?
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-emerald-200 to-yellow-200 bg-clip-text text-transparent">
              Get paid to introduce them.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Browse high-value roles, refer someone brilliant, and earn up to{' '}
            <span className="font-semibold text-white">
              {maxFeeUsd > 0 ? formatUsd(maxFeeUsd) : '$20,000+'}
            </span>{' '}
            when they get hired. No recruiter license needed.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-lg shadow-black/10 transition hover:scale-105 hover:shadow-xl"
            >
              Browse Jobs
              <svg
                className="h-4 w-4 transition group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="mailto:hello@referio.io"
              className="inline-flex items-center rounded-xl border-2 border-white/30 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
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
