import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { parseJobIdFromSlug } from '@/lib/utils/slug'
import { formatFee, formatPayoutTrigger } from '@/lib/utils/fee'
import { stripHtml, truncate } from '@/lib/utils/sanitize'
import ReferralFlow from '@/components/referral/ReferralFlow'
import type { Job } from '@/types'

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const supabase = createServiceClient()
    const { data: jobs } = await supabase
      .from('jobs')
      .select('url_slug')
      .eq('status', 'active')

    return (jobs ?? []).map((j) => ({ slug: j.url_slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const job = await fetchJob(slug)

  if (!job) {
    return { title: 'Job Not Found' }
  }

  const title = `${job.title} at ${job.company_name} — Earn ${formatFee(job.referral_fee, job.fee_currency)} Referral Fee`
  const description = truncate(stripHtml(job.description ?? ''), 160)

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${slug}`,
    },
  }
}

async function fetchJob(slug: string): Promise<Job | null> {
  const supabase = createServiceClient()
  const jobId = parseJobIdFromSlug(slug)

  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('magichire_job_id', jobId)
    .single()

  return (data as Job) ?? null
}

function sanitizeDescription(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const job = await fetchJob(slug)

  if (!job) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: stripHtml(job.description ?? ''),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name,
      logo: job.company_logo_url ?? '',
    },
    jobLocation: {
      '@type': 'Place',
      address: job.location ?? '',
    },
    datePosted: job.created_at,
    validThrough: new Date(
      Date.parse(job.created_at) + 90 * 24 * 60 * 60 * 1000
    ).toISOString(),
    employmentType: 'FULL_TIME',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/jobs"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Jobs
        </Link>

        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {job.company_logo_url ? (
                <Image
                  src={job.company_logo_url}
                  alt={job.company_name}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 text-2xl font-bold text-blue-600">
                  {job.company_name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">{job.company_name}</p>
                <h1 className="text-2xl font-bold text-gray-900">
                  {job.title}
                </h1>
                {job.location && (
                  <p className="mt-1 text-sm text-gray-500">{job.location}</p>
                )}
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-green-50 px-4 py-2 text-lg font-bold text-green-700">
              {formatFee(job.referral_fee, job.fee_currency)}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-400">
            {formatPayoutTrigger(job.payout_trigger)}
          </p>

          {/* Description */}
          <hr className="my-6 border-gray-100" />
          <h2 className="text-lg font-semibold text-gray-900">
            Job Description
          </h2>
          {job.description && (
            <div
              className="prose prose-sm mt-4 max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: sanitizeDescription(job.description),
              }}
            />
          )}

          {/* Referral Details */}
          <hr className="my-6 border-gray-100" />
          <h2 className="text-lg font-semibold text-gray-900">
            Referral Details
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Referral Fee</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatFee(job.referral_fee, job.fee_currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payout</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatPayoutTrigger(job.payout_trigger)}
              </p>
            </div>
          </div>
        </div>

        {/* Referral Flow */}
        <div className="mt-8">
          <ReferralFlow job={job} />
        </div>
      </div>
    </>
  )
}
