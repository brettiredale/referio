import Link from 'next/link'

export default function HomeFooter() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/" className="font-serif text-sm font-bold text-primary">
          Referio
        </Link>
        <div className="flex gap-6 text-sm text-secondary">
          <Link href="/jobs" className="transition hover:text-primary">
            Browse Jobs
          </Link>
          <a href="mailto:hello@referio.io" className="transition hover:text-primary">
            For Employers
          </a>
        </div>
        <p className="text-xs text-secondary">&copy; 2025 Referio</p>
      </div>
    </footer>
  )
}
