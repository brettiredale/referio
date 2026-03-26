import Link from 'next/link'
import { formatFee, formatPayoutTrigger } from '@/lib/utils/fee'
import type { Job } from '@/types'

type CardSize = 'default' | 'large' | 'featured'

const sizeStyles: Record<CardSize, { wrapper: string; title: string; fee: string }> = {
  default: {
    wrapper: 'p-6',
    title: 'font-serif text-xl font-normal text-primary',
    fee: 'font-serif text-xl text-accent',
  },
  large: {
    wrapper: 'p-8',
    title: 'font-serif text-2xl font-normal text-primary',
    fee: 'font-serif text-2xl text-accent',
  },
  featured: {
    wrapper: 'p-8 lg:p-10',
    title: 'font-serif text-2xl lg:text-3xl font-normal text-primary',
    fee: 'font-serif text-2xl lg:text-3xl text-accent',
  },
}

export default function HomeJobCard({
  job,
  size = 'default',
}: {
  job: Job
  size?: CardSize
}) {
  const styles = sizeStyles[size]

  return (
    <Link
      href={`/jobs/${job.url_slug}`}
      className={`group block border border-border ${styles.wrapper} transition-colors duration-300 hover:border-accent`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-secondary">
        {job.company_name}
      </p>

      <h3 className={`mt-3 leading-snug ${styles.title}`}>
        {job.title}
      </h3>

      {job.location && (
        <p className="mt-1.5 text-sm text-secondary">
          {job.location}
        </p>
      )}

      <div className="mt-6 flex items-baseline justify-between">
        <span className={styles.fee}>
          {formatFee(job.referral_fee, job.fee_currency)}
        </span>
        <span className="text-xs text-secondary">
          {formatPayoutTrigger(job.payout_trigger)}
        </span>
      </div>
    </Link>
  )
}
