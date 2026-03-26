'use client'

import { useEffect, useState } from 'react'
import EntryScreen from '@/components/EntryScreen'
import HomeHero from '@/components/home/HomeHero'
import HomeRoles from '@/components/home/HomeRoles'
import HomeHowItWorks from '@/components/home/HomeHowItWorks'
import HomeTrust from '@/components/home/HomeTrust'
import HomeFooterCta from '@/components/home/HomeFooterCta'
import type { Job } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const [showEntry, setShowEntry] = useState(true)
  const [showMain, setShowMain] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    // Skip entry if already seen this session
    if (sessionStorage.getItem('referio_entered')) {
      setShowEntry(false)
      setShowMain(true)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setJobs((data as Job[]) ?? [])
      })
  }, [])

  function handleEnter() {
    setShowEntry(false)
    // Brief delay for fade transition
    setTimeout(() => setShowMain(true), 50)
  }

  if (showEntry) {
    return <EntryScreen onEnter={handleEnter} />
  }

  return (
    <div
      className="transition-opacity duration-400"
      style={{ opacity: showMain ? 1 : 0 }}
    >
      <HomeHero />
      <HomeRoles jobs={jobs} />
      <HomeHowItWorks />
      <HomeTrust />
      <HomeFooterCta />
    </div>
  )
}
