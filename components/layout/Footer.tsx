import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm text-gray-400 sm:px-6">
        <span>&copy; 2025 Referio</span>
        <div className="flex gap-4">
          <Link href="/jobs" className="hover:text-gray-600">
            Browse Jobs
          </Link>
          <a href="mailto:hello@referio.io" className="hover:text-gray-600">
            For Employers
          </a>
        </div>
      </div>
    </footer>
  )
}
