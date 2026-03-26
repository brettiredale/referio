const STEPS = [
  {
    label: 'Step One',
    title: 'Browse',
    description:
      'Explore senior roles from companies that value introductions. Every listing shows the exact referral fee upfront.',
  },
  {
    label: 'Step Two',
    title: 'Refer',
    description:
      'Know someone right for the role? Submit their details in under two minutes. We handle the rest.',
  },
  {
    label: 'Step Three',
    title: 'Earn',
    description:
      'When your referral is hired, you receive the fee. Clear terms, guaranteed payout, no surprises.',
  },
]

export default function HomeHowItWorks() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section label */}
        <div className="mb-16 flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-secondary">
            03
          </span>
          <span className="block h-px w-12 bg-accent" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-secondary">
            How It Works
          </span>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              className={`py-8 md:py-0 md:px-10 lg:px-12 ${
                i > 0
                  ? 'border-t border-border md:border-t-0 md:border-l md:border-accent/30'
                  : ''
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
                {step.label}
              </p>
              <h3 className="mt-4 font-serif text-2xl font-normal text-primary">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
