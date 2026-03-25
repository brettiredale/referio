'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import MagicLinkForm from './MagicLinkForm'
import ProfileForm from './ProfileForm'
import ReferralForm from './ReferralForm'
import ReferralSuccess from './ReferralSuccess'
import type { Job, Referrer } from '@/types'

type AuthState =
  | 'loading'
  | 'unauthenticated'
  | 'profile_incomplete'
  | 'ready'
  | 'submitted'

export default function ReferralFlow({ job }: { job: Job }) {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [referrer, setReferrer] = useState<Referrer | null>(null)
  const [submittedRefereeName, setSubmittedRefereeName] = useState('')

  const supabase = createClient()

  async function checkProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setAuthState('unauthenticated')
      return
    }

    const { data } = await supabase
      .from('referrers')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!data || !data.full_name || !data.phone || !data.current_employer) {
      setAuthState('profile_incomplete')
    } else {
      setReferrer(data as Referrer)
      setAuthState('ready')
    }
  }

  useEffect(() => {
    checkProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkProfile()
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (authState === 'loading') {
    return null
  }

  if (authState === 'unauthenticated') {
    return <MagicLinkForm jobSlug={job.url_slug} />
  }

  if (authState === 'profile_incomplete') {
    return <ProfileForm onComplete={() => checkProfile()} />
  }

  if (authState === 'submitted') {
    return (
      <ReferralSuccess
        refereeName={submittedRefereeName}
        jobTitle={job.title}
        companyName={job.company_name}
      />
    )
  }

  return (
    <ReferralForm
      job={job}
      referrer={referrer!}
      onSuccess={(name) => {
        setSubmittedRefereeName(name)
        setAuthState('submitted')
      }}
    />
  )
}
