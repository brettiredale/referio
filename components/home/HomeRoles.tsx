import Link from 'next/link'
import { formatFee, formatPayoutTrigger } from '@/lib/utils/fee'
import type { Job } from '@/types'

export default function HomeRoles({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return null

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
          Open Roles
        </h2>

        <div className="mt-12 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.url_slug}`}
              className="group flex flex-col bg-surface p-6 transition hover:border-accent"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-border font-serif text-lg font-bold text-primary">
                  {job.company_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-semibold text-primary group-hover:text-accent transition">
                    {job.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-secondary">
                    {job.company_name}
                  </p>
                </div>
              </div>
              {job.location && (
                <p className="mt-3 text-sm text-secondary">{job.location}</p>
              )}
              <div className="mt-auto pt-5 flex items-baseline justify-between">
                <span className="font-serif text-lg font-bold text-accent">
                  {formatFee(job.referral_fee, job.fee_currency)}
                </span>
                <span className="text-xs text-secondary">
                  {formatPayoutTrigger(job.payout_trigger)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/jobs"
            className="text-sm font-medium text-secondary transition hover:text-accent"
          >
            View all roles &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
