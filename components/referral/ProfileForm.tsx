'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfileForm({
  onComplete,
}: {
  onComplete: () => void
}) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [currentEmployer, setCurrentEmployer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Session expired. Please refresh the page.')
      setLoading(false)
      return
    }

    const { error: upsertError } = await supabase.from('referrers').upsert({
      id: user.id,
      email: user.email!,
      full_name: fullName,
      phone,
      current_employer: currentEmployer,
    })

    setLoading(false)

    if (upsertError) {
      setError(upsertError.message)
    } else {
      onComplete()
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Complete your profile
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        We need a few details before you can refer someone.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current employer *
          </label>
          <input
            type="text"
            required
            value={currentEmployer}
            onChange={(e) => setCurrentEmployer(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save and Continue'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
