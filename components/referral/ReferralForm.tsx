'use client'

import { useState } from 'react'
import type { Job, Referrer } from '@/types'

export default function ReferralForm({
  job,
  referrer,
  onSuccess,
}: {
  job: Job
  referrer: Referrer
  onSuccess: (refereeName: string) => void
}) {
  const [refereeName, setRefereeName] = useState('')
  const [refereeEmail, setRefereeEmail] = useState('')
  const [refereePhone, setRefereePhone] = useState('')
  const [relationshipDuration, setRelationshipDuration] = useState('')
  const [relationshipContext, setRelationshipContext] = useState('')
  const [whyReferring, setWhyReferring] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValid =
    refereeName &&
    refereeEmail &&
    relationshipDuration &&
    relationshipContext &&
    whyReferring.length >= 50

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setLoading(true)
    setError(null)

    const res = await fetch('/api/v1/referrals/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: job.id,
        referee_name: refereeName,
        referee_email: refereeEmail,
        referee_phone: refereePhone || undefined,
        relationship_duration: relationshipDuration,
        relationship_context: relationshipContext,
        why_referring: whyReferring,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!data.success) {
      setError(data.error?.message ?? 'Something went wrong')
    } else {
      onSuccess(refereeName)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Submit a Referral
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Referring as {referrer.full_name} ({referrer.email})
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Referee full name *
          </label>
          <input
            type="text"
            required
            value={refereeName}
            onChange={(e) => setRefereeName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Referee email *
          </label>
          <input
            type="email"
            required
            value={refereeEmail}
            onChange={(e) => setRefereeEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Referee phone{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="tel"
            value={refereePhone}
            onChange={(e) => setRefereePhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            How long have you known/worked with them? *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. 3 years, 18 months"
            value={relationshipDuration}
            onChange={(e) => setRelationshipDuration(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Where did you work together? *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. We worked together at Acme Corp on the engineering team"
            value={relationshipContext}
            onChange={(e) => setRelationshipContext(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Why are you referring them for this role? *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Tell us what makes them great for this specific role..."
            value={whyReferring}
            onChange={(e) => setWhyReferring(e.target.value)}
            className={`mt-1 w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-1 ${
              whyReferring.length >= 50
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          <p className="mt-1 text-xs text-gray-400">
            {whyReferring.length} / 50 minimum
          </p>
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Referral'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
