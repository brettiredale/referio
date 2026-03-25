import JobCard from '@/components/jobs/JobCard'
import type { Job } from '@/types'

export default function JobGrid({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">
        No jobs available right now. Check back soon.
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
