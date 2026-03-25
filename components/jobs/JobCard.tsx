import Link from 'next/link'
import Image from 'next/image'
import { formatFee, formatPayoutTrigger } from '@/lib/utils/fee'
import { stripHtml, truncate } from '@/lib/utils/sanitize'
import type { Job } from '@/types'

export default function JobCard({ job }: { job: Job }) {
  const descriptionPreview = truncate(
    stripHtml(job.description ?? ''),
    120
  )

  return (
    <Link
      href={`/jobs/${job.url_slug}`}
      className="block rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {job.company_logo_url ? (
          <Image
            src={job.company_logo_url}
            alt={job.company_name}
            width={48}
            height={48}
            className="rounded-lg"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-lg font-bold text-blue-600">
            {job.company_name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company_name}</p>
        </div>
      </div>

      {job.location && (
        <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          {job.location}
        </div>
      )}

      {descriptionPreview && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {descriptionPreview}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
          {formatFee(job.referral_fee, job.fee_currency)}
        </span>
        <span className="text-xs text-gray-400">
          {formatPayoutTrigger(job.payout_trigger)}
        </span>
      </div>
    </Link>
  )
}
