import Link from 'next/link'
import HomeJobCard from '@/components/home/HomeJobCard'
import type { Job } from '@/types'

export default function HomeHero({
  featuredJob,
  totalJobs,
}: {
  featuredJob: Job | null
  totalJobs: number
}) {
  return (
    <section className="px-6 pb-16 pt-32 lg:pb-20 lg:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-16 lg:grid-cols-[1fr_420px]">
          {/* Left — Copy */}
          <div>
            <div className="flex items-center gap-3">
              <span className="block h-px w-10 bg-accent" />
              <span className="text-xs font-medium uppercase tracking-[0.35em] text-accent">
                The Referral Marketplace
              </span>
            </div>

            <h1 className="mt-8 font-serif text-5xl font-normal leading-[1.08] text-primary sm:text-6xl lg:text-7xl">
              Your network,
              <br />
              <span className="text-accent">rewarded</span>.
            </h1>

            <p className="mt-8 max-w-[460px] text-lg leading-relaxed text-secondary">
              Connect exceptional talent with senior roles.
              Earn $5,000 to $25,000+ when they get hired.
            </p>

            <Link
              href="/jobs"
              className="mt-10 inline-block bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] transition-opacity duration-300 hover:opacity-85"
            >
              Browse Roles
            </Link>
          </div>

          {/* Right — Featured Job */}
          {featuredJob && (
            <div>
              <HomeJobCard job={featuredJob} size="featured" />
              {totalJobs > 1 && (
                <p className="mt-4 text-right text-sm text-secondary">
                  + {totalJobs - 1} more roles below
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
