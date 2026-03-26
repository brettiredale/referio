'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MagicLinkForm({ jobSlug }: { jobSlug: string }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://referio.io'}/auth/callback?next=${encodeURIComponent('/jobs/' + jobSlug)}`,
      },
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="font-medium text-green-800">
          Check your email — magic link sent to {email}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Refer someone for this role
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Enter your email — we&apos;ll send you a magic link to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
