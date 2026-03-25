import type { ReferralStatus } from '@/types'

const STATUS_CONFIG: Record<
  ReferralStatus,
  { label: string; className: string }
> = {
  submitted: { label: 'Submitted', className: 'bg-gray-100 text-gray-700' },
  reviewing: { label: 'Reviewing', className: 'bg-blue-100 text-blue-700' },
  interviewing: {
    label: 'Interviewing',
    className: 'bg-amber-100 text-amber-700',
  },
  hired: { label: 'Hired', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Not Progressed', className: 'bg-red-100 text-red-700' },
}

export default function ReferralStatusBadge({
  status,
}: {
  status: ReferralStatus
}) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
