const VALUE_PROPS = [
  {
    label: 'Transparent Fees',
    desc: 'Every role lists the exact referral fee. No hidden terms, no negotiation.',
  },
  {
    label: 'Guaranteed Payout',
    desc: 'Know precisely when you are paid — at hire, on start, or post-probation.',
  },
  {
    label: 'Senior Roles Only',
    desc: 'High-value positions from companies serious about exceptional talent.',
  },
  {
    label: 'Two-Minute Referral',
    desc: 'Submit your referral quickly. We handle the introduction and follow-through.',
  },
]

export default function HomeTrust({
  totalFees,
  jobCount,
  averageFee,
}: {
  totalFees: string
  jobCount: number
  averageFee: string
}) {
  return (
    <section>
      {/* Stats bar */}
      <div className="bg-surface px-6 py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-0">
          {[
            { value: String(jobCount), label: 'Roles Available' },
            { value: averageFee, label: 'Average Fee' },
            { value: totalFees, label: 'Total Fees Available' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i > 0
                  ? 'border-t border-accent/20 pt-12 sm:border-t-0 sm:border-l sm:pt-0'
                  : ''
              }`}
            >
              <p className="font-serif text-4xl text-primary lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-secondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Value propositions */}
      <div className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:gap-16">
            {VALUE_PROPS.map((item) => (
              <div key={item.label}>
                <span className="block h-px w-6 bg-accent" />
                <h3 className="mt-4 text-sm font-semibold text-primary">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
