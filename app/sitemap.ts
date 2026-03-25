import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('url_slug, updated_at')
    .eq('status', 'active')

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://referio.io'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]

  const jobPages: MetadataRoute.Sitemap = (jobs ?? []).map((job) => ({
    url: `${SITE_URL}/jobs/${job.url_slug}`,
    lastModified: new Date(job.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...jobPages]
}
