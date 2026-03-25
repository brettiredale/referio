export function generateSlug(title: string, magichireJobId: string): string {
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  return `${magichireJobId}-${titleSlug}`
}

export function parseJobIdFromSlug(slug: string): string {
  // slug format: job_abc123-senior-software-engineer
  // job ID is everything up to the second hyphen segment
  const match = slug.match(/^(job_[^-]+)/)
  return match ? match[1] : slug
}
