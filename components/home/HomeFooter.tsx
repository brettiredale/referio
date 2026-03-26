import Link from 'next/link'

export default function HomeFooter() {
  return (
    <footer>
      <div className="border-t border-accent/20" />
      <div className="px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <Link href="/" className="font-serif text-sm font-bold tracking-wide text-primary">
              Referio
            </Link>
            <p className="mt-1 text-xs text-secondary">
              The referral marketplace for senior talent
            </p>
          </div>
          <div className="flex gap-6 text-sm text-secondary">
            <Link href="/jobs" className="transition-colors duration-300 hover:text-primary">
              Browse Jobs
            </Link>
            <a href="mailto:hello@referio.io" className="transition-colors duration-300 hover:text-primary">
              For Employers
            </a>
          </div>
          <p className="text-xs text-secondary">&copy; 2026 Referio</p>
        </div>
      </div>
    </footer>
  )
}
