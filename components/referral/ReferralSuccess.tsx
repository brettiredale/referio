import Link from 'next/link'

export default function ReferralSuccess({
  refereeName,
  jobTitle,
  companyName,
}: {
  refereeName: string
  jobTitle: string
  companyName: string
}) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
      <svg
        className="mx-auto h-12 w-12 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        Referral submitted!
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Your referral for {refereeName} has been submitted for the {jobTitle}{' '}
        role at {companyName}. We&apos;ll keep you updated on their progress.
      </p>

      <Link
        href="/dashboard"
        className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View all my referrals &rarr;
      </Link>
    </div>
  )
}
