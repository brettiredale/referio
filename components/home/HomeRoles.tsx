import Link from 'next/link'
import JobCard from '@/components/jobs/JobCard'
import type { Job } from '@/types'

export default function HomeRoles({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return null

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
          Open Roles
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/jobs"
            className="text-sm font-medium text-secondary transition hover:text-accent"
          >
            View all roles &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
