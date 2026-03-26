'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function HomeNav() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('referrers')
          .select('full_name')
          .eq('id', data.user.id)
          .single()
          .then(({ data: referrer }) => {
            setUserName(referrer?.full_name ?? data.user!.email ?? null)
          })
      }
    })
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserName(null)
    setMenuOpen(false)
    window.location.href = '/'
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-wide text-primary"
        >
          Referio
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm font-medium text-secondary transition-colors duration-300 hover:text-primary"
          >
            Browse Jobs
          </Link>

          {userName ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors duration-300 hover:text-primary"
              >
                {userName}
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 border border-border bg-surface py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-secondary transition-colors duration-300 hover:text-primary"
                  >
                    My Referrals
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-secondary transition-colors duration-300 hover:text-primary"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-left text-sm text-secondary transition-colors duration-300 hover:text-primary"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-secondary transition-colors duration-300 hover:text-primary"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
