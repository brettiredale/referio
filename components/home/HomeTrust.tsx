const ITEMS = [
  {
    label: 'Transparent Fees',
    desc: 'Every role lists the exact referral fee. No hidden terms.',
  },
  {
    label: 'Guaranteed Payout',
    desc: 'Know precisely when you are paid — at hire, on start, or post-probation.',
  },
  {
    label: 'Senior Roles Only',
    desc: 'High-value positions from companies serious about talent.',
  },
  {
    label: 'Two-Minute Referral',
    desc: 'Submit your referral quickly. We handle the rest.',
  },
]

export default function HomeTrust() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              className={`py-6 lg:py-0 lg:px-8 ${
                i > 0 ? 'border-t border-border sm:border-t lg:border-t-0 lg:border-l' : ''
              } ${i === 1 ? 'sm:border-t-0 sm:border-l' : ''} ${i === 2 ? 'sm:border-l-0 lg:border-l' : ''} ${i === 3 ? 'sm:border-l lg:border-l' : ''}`}
            >
              <p className="text-sm font-semibold text-primary">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
