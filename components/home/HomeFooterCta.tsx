import Link from 'next/link'

export default function HomeFooterCta() {
  return (
    <section className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
          The right introduction changes everything.
        </h2>
        <Link
          href="/jobs"
          className="mt-10 inline-block bg-accent px-8 py-4 text-sm font-semibold tracking-wide text-[#0A0A0A] transition hover:opacity-90"
        >
          Browse Roles
        </Link>
      </div>
    </section>
  )
}
