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
      className="group block border border-border bg-surface p-6 transition hover:border-accent"
    >
      <div className="flex items-start gap-4">
        {job.company_logo_url ? (
          <Image
            src={job.company_logo_url}
            alt={job.company_name}
            width={44}
            height={44}
            className="shrink-0"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-border font-serif text-lg font-bold text-primary">
            {job.company_name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-base font-semibold text-primary group-hover:text-accent transition">
            {job.title}
          </h3>
          <p className="text-sm text-secondary">{job.company_name}</p>
        </div>
      </div>

      {job.location && (
        <p className="mt-3 text-sm text-secondary">{job.location}</p>
      )}

      {descriptionPreview && (
        <p className="mt-2 text-sm leading-relaxed text-secondary line-clamp-2">
          {descriptionPreview}
        </p>
      )}

      <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
        <span className="font-serif text-lg font-bold text-accent">
          {formatFee(job.referral_fee, job.fee_currency)}
        </span>
        <span className="text-xs text-secondary">
          {formatPayoutTrigger(job.payout_trigger)}
        </span>
      </div>
    </Link>
  )
}
