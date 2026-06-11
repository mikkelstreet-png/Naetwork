'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, ArrowRight, Star, Zap, Building2, User } from 'lucide-react'
import Link from 'next/link'
import { PHASE, FOUNDING_DISCOUNT } from '@/lib/phase'
import { Logo } from '@/components/Logo'

// ─── Tier data ────────────────────────────────────────────────────────────────

const tiers = [
  {
    id: 'starter',
    icon: User,
    name: 'Starter',
    audience: 'Kandidat',
    monthlyPrice: 0,
    annualPrice: 0,
    alwaysFree: true,
    charityBadge: 'Gratis',
    commercialBadge: 'Altid gratis',
    features: [
      'Personlig profil',
      'Intelligent match-forslag',
      'Push-notifikationer',
      'Book session med professionelle',
      'Gemt søgning (5 stk.)',
    ],
    cta: 'Opret gratis konto',
    popular: false,
  },
  {
    id: 'professionel',
    icon: Zap,
    name: 'Professionel',
    audience: 'Mentor / Ekspert',
    monthlyPrice: 499,
    annualPrice: 4499,
    alwaysFree: false,
    charityBadge: 'Gratis · Founding Member',
    commercialBadge: `${FOUNDING_DISCOUNT}% rabat · Early bird`,
    features: [
      'Alt i Starter',
      'Udvidet profil og synlighed',
      'AI-matching og prioritering',
      '10 sessions / måned',
      'Prioriteret visning',
      'Statistik & indsigt',
    ],
    cta: 'Start som professionel',
    popular: true,
  },
  {
    id: 'virksomhed',
    icon: Building2,
    name: 'Virksomhed',
    audience: 'Team',
    monthlyPrice: 1499,
    annualPrice: 12999,
    alwaysFree: false,
    charityBadge: 'Gratis · Founding Member',
    commercialBadge: `${FOUNDING_DISCOUNT}% rabat · Early bird`,
    features: [
      'Alt i Professionel',
      'Ubegrænset sessions',
      'API-adgang',
      'Op til 10 team-seats',
      'Dedikeret onboarding',
      'SLA support',
    ],
    cta: 'Kontakt os',
    popular: false,
  },
]

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Hvornår skal jeg betale?',
    a: 'I founding-perioden er alle planer gratis. Vi notificerer dig minimum 30 dage inden vi aktiverer betaling — og du kan altid opsige før da.',
  },
  {
    q: 'Hvad er en "founding member-pris"?',
    a: `Alle der opretter konto i founding-perioden låser ${FOUNDING_DISCOUNT}% rabat på betalte planer — for altid. Det er vores tak for at være med fra starten.`,
  },
  {
    q: 'Kan jeg skifte plan?',
    a: 'Ja. Du kan opgradere eller nedgradere når som helst. Ændringer træder i kraft med det samme, og du betaler kun for brugt tid.',
  },
  {
    q: 'Hvad sker der efter founding-perioden?',
    a: 'Starter-planen er altid gratis. Professionel og Virksomhed aktiveres til den founding member-pris du låste ved oprettelse — ingen overraskelser.',
  },
  {
    q: 'Er der refusion?',
    a: 'Ja. Hvis du ikke er tilfreds inden for de første 14 dage refunderer vi fuldt ud — ingen spørgsmål stillet.',
  },
  {
    q: 'Hvad med fakturering for virksomheder?',
    a: 'Vi udsteder fakturaer til CVR-nummer. Årsplaner faktureres én gang; månedlige planer den 1. i måneden.',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmPrice(price: number): number {
  return Math.round(price * (1 - FOUNDING_DISCOUNT / 100))
}

function formatDKK(n: number): string {
  if (n === 0) return '0 kr'
  return `${n.toLocaleString('da-DK')} kr`
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-medium text-white/80 transition hover:text-white"
      >
        {q}
        {open ? (
          <ChevronUp size={16} className="shrink-0 text-blue-400" />
        ) : (
          <ChevronDown size={16} className="shrink-0 text-white/30" />
        )}
      </button>
      {open && (
        <p className="pb-5 text-[14px] leading-relaxed text-white/50">{a}</p>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PricingContent() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const isCharity = PHASE === 'charity'

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] opacity-100"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,130,246,0.16) 0%, transparent 70%)',
        }}
      />

      {/* Minimal nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050810]/80 backdrop-blur-xl">
        <div className="wrap flex h-16 items-center justify-between">
          <Link href="/" aria-label="Naetwork">
            <Logo tone="paper" />
          </Link>
          <Link
            href="/"
            className="text-[13px] text-white/50 transition hover:text-white"
          >
            ← Tilbage til forsiden
          </Link>
        </div>
      </header>

      <main className="wrap relative z-10 pb-32 pt-20">
        {/* ── Header ── */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mb-6 block">Priser</span>

          {isCharity ? (
            <>
              <h1 className="h2 text-white">
                Gratis i 6 måneder —{' '}
                <span className="gradient-text">Founding Member Adgang</span>
              </h1>
              <p className="lead mt-5 text-white/50">
                Vi tror på Naetwork. Så meget at vi giver dig adgang gratis de
                første 6 måneder, mens vi bygger platformen{' '}
                <em>sammen med jer</em> i branchen.
              </p>
            </>
          ) : (
            <>
              <h1 className="h2 text-white">
                Fleksible planer —{' '}
                <span className="gradient-text">til alle på platformen</span>
              </h1>
              <p className="lead mt-5 text-white/50">
                Fra den individuelle kandidat til den store virksomhed. Founding
                members beholder {FOUNDING_DISCOUNT}% rabat for altid.
              </p>
            </>
          )}
        </div>

        {/* ── Billing toggle (commercial only) ── */}
        {!isCharity && (
          <div className="mt-10 flex justify-center">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`rounded-full px-5 py-2 text-[13px] font-medium transition-all ${
                  billing === 'monthly'
                    ? 'bg-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.4)]'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Månedlig
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-all ${
                  billing === 'annual'
                    ? 'bg-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.4)]'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Årlig
                <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[11px] font-semibold text-green-400">
                  Spar 25%
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ── Tier cards ── */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => {
            const Icon = tier.icon
            const isPopular = tier.popular

            // Price logic
            let displayPrice = 0
            let originalPrice: number | null = null
            if (!isCharity && !tier.alwaysFree) {
              const base =
                billing === 'annual'
                  ? Math.round(tier.annualPrice / 12)
                  : tier.monthlyPrice
              displayPrice = fmPrice(base)
              originalPrice = base
            }

            const badge = isCharity ? tier.charityBadge : tier.commercialBadge

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  isPopular
                    ? 'border-blue-500/50 bg-blue-500/[0.07] shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)]'
                    : 'border-white/[0.09] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.06]'
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 rounded-full bg-blue-500 px-4 py-1 text-[11px] font-semibold text-white shadow-[0_0_16px_rgba(59,130,246,0.5)]">
                      <Star size={10} fill="currentColor" />
                      Mest valgt
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl ${
                        isPopular
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-white/[0.06] text-white/60'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{tier.name}</p>
                      <p className="text-[12px] text-white/40">{tier.audience}</p>
                    </div>
                  </div>

                  {/* Phase badge */}
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${
                      isCharity
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-blue-500/15 text-blue-400'
                    }`}
                  >
                    {badge}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {isCharity || tier.alwaysFree ? (
                    <div>
                      <span className="text-[2.8rem] font-bold leading-none text-white">
                        Gratis
                      </span>
                      {isCharity && !tier.alwaysFree && (
                        <p className="mt-1.5 text-[12px] text-white/35">
                          Founding member-pris låst ved oprettelse
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-[2.8rem] font-bold leading-none text-white">
                          {formatDKK(displayPrice)}
                        </span>
                        <span className="mb-2 text-[13px] text-white/40">/md</span>
                      </div>
                      {originalPrice && originalPrice !== displayPrice && (
                        <p className="mt-1 text-[13px] text-white/35">
                          <span className="line-through">
                            {formatDKK(originalPrice)}/md
                          </span>{' '}
                          · founding member pris
                        </p>
                      )}
                      {billing === 'annual' && !tier.alwaysFree && (
                        <p className="mt-0.5 text-[12px] text-white/30">
                          Faktureret{' '}
                          {formatDKK(fmPrice(tier.annualPrice))}/år
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[14px] text-white/65">
                      <Check
                        size={14}
                        className={`mt-0.5 shrink-0 ${
                          isPopular ? 'text-blue-400' : 'text-white/30'
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#"
                  className={`flex items-center justify-center gap-2 rounded-full py-3.5 text-[13px] font-semibold transition-all ${
                    isPopular
                      ? 'btn-pine'
                      : 'btn-ghost'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            )
          })}
        </div>

        {/* ── After 6 months (charity only) ── */}
        {isCharity && (
          <div className="mt-16 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 lg:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow mb-4 block">Hvad sker efter 6 måneder?</span>
              <h2 className="text-[1.5rem] font-bold text-white">
                Ærlighed fra dag ét
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/50">
                Vi skjuler ikke, at Naetwork på sigt bliver en kommerciel
                platform. Founding members låser deres pris ved oprettelse —
                {' '}{FOUNDING_DISCOUNT}% rabat for altid. Starter-planen er og
                forbliver gratis.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {[
                {
                  tier: 'Starter',
                  after: 'Forbliver altid gratis',
                  note: 'Ingen ændring',
                  color: 'text-green-400',
                  bg: 'bg-green-500/10',
                },
                {
                  tier: 'Professionel',
                  after: `${formatDKK(fmPrice(499))}/md (founding)`,
                  note: `vs. 499 kr/md listepris`,
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/10',
                },
                {
                  tier: 'Virksomhed',
                  after: `${formatDKK(fmPrice(1499))}/md (founding)`,
                  note: `vs. 1.499 kr/md listepris`,
                  color: 'text-indigo-400',
                  bg: 'bg-indigo-500/10',
                },
              ].map((item) => (
                <div
                  key={item.tier}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5"
                >
                  <p className="mb-2 font-semibold text-white">{item.tier}</p>
                  <p className={`text-[15px] font-semibold ${item.color}`}>
                    {item.after}
                  </p>
                  <p className="mt-1 text-[12px] text-white/35">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Global CTA ── */}
        <div className="mt-16 text-center">
          <p className="mb-2 text-[13px] text-white/35">
            {isCharity
              ? 'Gratis under founding-perioden · Lås din founding member-pris'
              : 'Founding members beholder rabatten for altid'}
          </p>
          <a
            href="#"
            className="btn-pine inline-flex items-center gap-2"
          >
            Opret gratis konto → Lås din founding member-pris
            <ArrowRight size={14} />
          </a>
          <p className="mt-3 text-[12px] text-white/25">
            0 kr investering · 5 min setup · Opsig når som helst
          </p>
        </div>

        {/* ── FAQ ── */}
        <div className="mx-auto mt-24 max-w-2xl">
          <h2 className="mb-2 text-center text-[1.5rem] font-bold text-white">
            Spørgsmål om priser
          </h2>
          <p className="mb-10 text-center text-[14px] text-white/40">
            Besvaret ligefremt.
          </p>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-white/[0.07] py-8">
        <div className="wrap text-center text-[13px] text-white/25">
          Naetwork · Gratis under founding-perioden ·{' '}
          <Link href="/" className="hover:text-white/50 transition-colors">
            Tilbage til forsiden
          </Link>
        </div>
      </footer>
    </div>
  )
}
