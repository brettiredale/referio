'use client'

import { useEffect, useState, useCallback } from 'react'

const TARGET = '$847,000'
const FLIP_DURATION = 220
const DELAY_BETWEEN = 120
const PAUSE_BEFORE_TAGLINE = 400
const PAUSE_BEFORE_CTA = 600

function SolariDigit({
  target,
  delay,
}: {
  target: string
  delay: number
}) {
  const [phase, setPhase] = useState<'idle' | 'flipping' | 'done'>('idle')
  const [display, setDisplay] = useState('\u00A0')

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setPhase('flipping')
      // Halfway through flip, change the character
      const midTimer = setTimeout(() => {
        setDisplay(target)
      }, FLIP_DURATION / 2)
      // End of flip
      const endTimer = setTimeout(() => {
        setPhase('done')
      }, FLIP_DURATION)
      return () => {
        clearTimeout(midTimer)
        clearTimeout(endTimer)
      }
    }, delay)
    return () => clearTimeout(startTimer)
  }, [target, delay])

  // Static characters ($ and ,) render immediately
  const isStatic = target === '$' || target === ','
  if (isStatic) {
    return (
      <span className="inline-block font-serif text-[56px] leading-none text-[#F5F5F5] sm:text-[96px]">
        {target}
      </span>
    )
  }

  return (
    <span className="relative inline-block overflow-hidden font-serif text-[56px] leading-none sm:text-[96px]">
      <span
        className="inline-block text-[#F5F5F5]"
        style={{
          transform:
            phase === 'flipping' ? 'rotateX(90deg)' : 'rotateX(0deg)',
          transition: `transform ${FLIP_DURATION / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          transformOrigin: 'bottom',
        }}
      >
        {display}
      </span>
    </span>
  )
}

export default function EntryScreen({
  onEnter,
}: {
  onEnter: () => void
}) {
  const [showTagline, setShowTagline] = useState(false)
  const [showCta, setShowCta] = useState(false)

  // Calculate total animation time
  const digits = TARGET.split('')
  const animatedCount = digits.filter((d) => d !== '$' && d !== ',').length
  const totalFlipTime = animatedCount * (FLIP_DURATION + DELAY_BETWEEN)

  useEffect(() => {
    const taglineTimer = setTimeout(() => {
      setShowTagline(true)
    }, totalFlipTime + PAUSE_BEFORE_TAGLINE)

    const ctaTimer = setTimeout(() => {
      setShowCta(true)
    }, totalFlipTime + PAUSE_BEFORE_TAGLINE + PAUSE_BEFORE_CTA)

    return () => {
      clearTimeout(taglineTimer)
      clearTimeout(ctaTimer)
    }
  }, [totalFlipTime])

  const handleEnter = useCallback(() => {
    sessionStorage.setItem('referio_entered', '1')
    onEnter()
  }, [onEnter])

  // Calculate delays for each animated digit
  let animIndex = 0
  const digitElements = digits.map((char, i) => {
    const isStatic = char === '$' || char === ','
    const delay = isStatic ? 0 : animIndex * (FLIP_DURATION + DELAY_BETWEEN)
    if (!isStatic) animIndex++
    return <SolariDigit key={i} target={char} delay={delay} />
  })

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A]">
      <div className="flex items-baseline" style={{ perspective: '600px' }}>
        {digitElements}
      </div>

      <p
        className="mt-8 text-xs font-medium uppercase tracking-[0.3em] text-[#888888] transition-opacity duration-500"
        style={{ opacity: showTagline ? 1 : 0 }}
      >
        available to the right introduction
      </p>

      <button
        onClick={handleEnter}
        className="mt-10 border border-[#F5F5F5] px-8 py-3 text-sm font-medium tracking-wide text-[#F5F5F5] transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
        style={{
          opacity: showCta ? 1 : 0,
          pointerEvents: showCta ? 'auto' : 'none',
          transition: 'opacity 500ms, background-color 300ms, border-color 300ms, color 300ms',
        }}
      >
        Enter &rarr;
      </button>
    </div>
  )
}
