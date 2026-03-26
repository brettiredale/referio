import Link from 'next/link'

export default function HomeHero() {
  return (
    <section className="px-6 pb-24 pt-40">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-5xl font-bold leading-tight text-primary sm:text-7xl">
          Your network
          <br />
          is worth <span className="text-accent">gold</span>.
        </h1>
        <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-secondary">
          Referio connects professionals who know exceptional talent with
          companies willing to pay for the right introduction. Senior roles.
          Significant fees. Complete transparency.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/jobs"
            className="bg-accent px-7 py-3.5 text-sm font-semibold tracking-wide text-[#0A0A0A] transition hover:opacity-90"
          >
            Browse Roles
          </Link>
          <a
            href="mailto:hello@referio.io"
            className="border border-border px-7 py-3.5 text-sm font-semibold tracking-wide text-primary transition hover:border-accent hover:text-accent"
          >
            Post a Role
          </a>
        </div>
      </div>
    </section>
  )
}
