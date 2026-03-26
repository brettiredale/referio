import Link from 'next/link'

export default function HomeFooterCta() {
  return (
    <section className="bg-accent-deep px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/50">
          The Invitation
        </p>
        <h2 className="mt-6 font-serif text-3xl font-normal leading-snug text-white sm:text-4xl">
          You know someone right for the role.
          <br className="hidden sm:block" />
          We make the introduction worth your while.
        </h2>
        <Link
          href="/jobs"
          className="mt-10 inline-block border border-white/40 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-accent-deep"
        >
          Browse Roles
        </Link>
      </div>
    </section>
  )
}
