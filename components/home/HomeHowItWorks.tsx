const STEPS = [
  {
    num: '1',
    title: 'Browse',
    desc: 'Explore open roles from vetted companies with fees listed upfront.',
  },
  {
    num: '2',
    title: 'Refer',
    desc: 'Submit your referral in minutes. Tell us why they are right for the role.',
  },
  {
    num: '3',
    title: 'Earn',
    desc: 'Your fee is paid when your referral is hired. Clear terms, no surprises.',
  },
]

export default function HomeHowItWorks() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.num}>
              <span className="block font-serif text-[120px] font-bold leading-none text-accent opacity-40">
                {step.num}
              </span>
              <h3 className="mt-4 font-serif text-2xl font-bold text-primary">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
