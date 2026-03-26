import Link from 'next/link'
import Image from 'next/image'
import { formatFee, formatPayoutTrigger } from '@/lib/utils/fee'
import { stripHtml, truncate } from '@/lib/utils/sanitize'
import type { Job } from '@/types'

function getInitialColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500',
    'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export default function JobCard({ job }: { job: Job }) {
  const descriptionPreview = truncate(
    stripHtml(job.description ?? ''),
    140
  )

  return (
    <Link
      href={`/jobs/${job.url_slug}`}
      className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Logo */}
      <div className="mb-4">
        {job.company_logo_url ? (
          <Image
            src={job.company_logo_url}
            alt={job.company_name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-lg object-contain"
          />
        ) : (
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-lg text-2xl font-bold text-white ${getInitialColor(job.company_name)}`}
          >
            {job.company_name.charAt(0)}
          </div>
        )}
      </div>

      {/* Title & Company */}
      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
        {job.title}
      </h3>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
        {job.company_name}
      </p>

      {/* Location */}
      {job.location && (
        <p className="mt-2 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {job.location}
        </p>
      )}

      {/* Description */}
      {descriptionPreview && (
        <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-2 dark:text-gray-400">
          {descriptionPreview}
        </p>
      )}

      {/* Fee & Payout */}
      <div className="mt-4 flex items-center justify-between pt-3">
        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {formatFee(job.referral_fee, job.fee_currency)}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatPayoutTrigger(job.payout_trigger)}
        </span>
      </div>
    </Link>
  )
}
