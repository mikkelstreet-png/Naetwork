'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { PHASE, CHARITY_END_DATE } from '@/lib/phase'

export function FoundingMemberBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem('fmb-v1')) setDismissed(true)
    } catch {}

    const now = new Date()
    const diff = CHARITY_END_DATE.getTime() - now.getTime()
    setDaysLeft(Math.max(0, Math.ceil(diff / 86_400_000)))
  }, [])

  if (PHASE !== 'charity') return null
  if (!mounted || dismissed) return null

  const endStr = CHARITY_END_DATE.toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleDismiss = () => {
    setDismissed(true)
    try { sessionStorage.setItem('fmb-v1', '1') } catch {}
  }

  return (
    <div
      role="banner"
      className="relative z-50 flex items-center justify-center gap-3 px-4 py-2.5 text-[13px] font-medium text-white"
      style={{
        background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 45%, #6366f1 100%)',
      }}
    >
      {/* Content */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center leading-snug">
        <span className="font-semibold">🎁 Founding Member Periode</span>
        <span className="opacity-60">·</span>
        <span>
          Gratis adgang de næste{' '}
          <span className="font-bold">
            {daysLeft !== null ? `${daysLeft} dage` : '6 måneder'}
          </span>
        </span>
        <span className="opacity-60">·</span>
        <span className="opacity-80">Slutter {endStr}</span>
        <span className="opacity-60">·</span>
        <a
          href="/pricing"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Bliv en del af historien →
        </a>
      </div>

      {/* Close */}
      <button
        onClick={handleDismiss}
        aria-label="Luk banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 grid h-6 w-6 shrink-0 place-items-center rounded-full hover:bg-white/20 transition-colors"
      >
        <X size={12} />
      </button>
    </div>
  )
}
