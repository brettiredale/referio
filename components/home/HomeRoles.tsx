import Link from 'next/link'
import HomeJobCard from '@/components/home/HomeJobCard'
import type { Job } from '@/types'

export default function HomeRoles({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return null

  // First job shown in hero, so we skip it. Remaining jobs split into layout.
  const largeJob = jobs[0]
  const stackedJobs = jobs.slice(1, 3)
  const bottomJobs = jobs.slice(3, 6)

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-secondary">
              02
            </span>
            <span className="block h-px w-12 bg-accent" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-secondary">
              Open Roles
            </span>
          </div>
          <Link
            href="/jobs"
            className="group flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors duration-300 hover:text-accent"
          >
            View all roles
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        {/* Asymmetric top row */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Large left card */}
          {largeJob && (
            <HomeJobCard job={largeJob} size="large" />
          )}

          {/* Two stacked right cards */}
          {stackedJobs.length > 0 && (
            <div className="grid gap-6">
              {stackedJobs.map((job) => (
                <HomeJobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom row — 3 equal cards */}
        {bottomJobs.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bottomJobs.map((job) => (
              <HomeJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
