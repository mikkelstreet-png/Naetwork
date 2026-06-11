'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, ArrowRight, Zap, Building2, User } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

// ─── Tier data ────────────────────────────────────────────────────────────────

const tiers = [
  {
    id: 'gratis',
    icon: User,
    name: 'Gratis',
    label: 'Professionel',
    monthlyPrice: 0,
    alwaysFree: true,
    features: [
      'Opret profil med mål',
      '3 AI-matches per måned',
      'Community-adgang',
      'Grundlæggende mål-tracking',
      'Synlighed for relevante virksomheder',
    ],
    cta: 'Opret gratis profil',
    popular: false,
    note: 'Altid gratis',
  },
  {
    id: 'pro',
    icon: Zap,
    name: 'Professionel+',
    label: 'For ambitiøse',
    monthlyPrice: 249,
    alwaysFree: false,
    features: [
      'Alt i Gratis +',
      'Ubegrænsede AI-matches',
      'Prioriteret synlighed',
      'Avancerede filtre',
      'Direkte besked til matches',
      'Fuld outcome-tracking',
      'Månedlige karriere-insights (AI)',
    ],
    cta: 'Start Professionel+',
    popular: true,
    note: '249 kr/md',
  },
  {
    id: 'virksomhed',
    icon: Building2,
    name: 'Virksomhed',
    label: 'Op til 5 brugere',
    monthlyPrice: 999,
    alwaysFree: false,
    features: [
      'Talent pipeline dashboard',
      'Søg i opt-in profiler',
      'Anonymiseret talent-search',
      'Jobopslag til målrettede profiler',
      'Teamoverblik og samarbejde',
      'Dedikeret onboarding',
    ],
    cta: 'Kontakt os',
    popular: false,
    note: '999 kr/md · op til 5 brugere',
  },
]

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Er det virkelig gratis at starte?',
    a: 'Ja. Gratisplanen inkluderer profiloprettelse, 3 AI-matches per måned og grundlæggende mål-tracking. Intet kreditkort kræves.',
  },
  {
    q: 'Hvad er forskellen på Gratis og Professionel+?',
    a: 'Gratisplanen giver dig adgang til platformen og 3 månedlige AI-matches. Professionel+ (249 kr/md) giver ubegrænsede matches, prioriteret synlighed, direkte besked til matches og fuld outcome-tracking med månedlige AI-insights.',
  },
  {
    q: 'Kan jeg skifte plan?',
    a: 'Ja. Du kan opgradere eller nedgradere når som helst. Ændringer træder i kraft med det samme.',
  },
  {
    q: 'Hvad inkluderer virksomhedsplanen?',
    a: 'Op til 5 brugere, talent pipeline dashboard, anonymiseret søgning i opt-in profiler, målrettede jobopslag og dedikeret onboarding. 999 kr/md.',
  },
  {
    q: 'Er der refusion?',
    a: 'Ja. Hvis du ikke er tilfreds inden for de første 14 dage refunderer vi fuldt ud — ingen spørgsmål stillet.',
  },
  {
    q: 'Hvad med enterprise-aftaler?',
    a: 'For større organisationer, kæder eller koncerner tilbyder vi custom aftaler. Kontakt os for en snak.',
  },
]

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
  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {/* Ambient glow */}
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
          <h1 className="h2 text-white">
            Gratis at starte —{' '}
            <span className="gradient-text">resultater fra dag ét</span>
          </h1>
          <p className="lead mt-5 text-white/50">
            Tre planer. Klar pricing. Ingen skjulte gebyrer.
          </p>
        </div>

        {/* ── Tier cards ── */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => {
            const Icon = tier.icon
            const isPopular = tier.popular

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
                      <p className="text-[12px] text-white/40">{tier.label}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {tier.alwaysFree ? (
                    <div>
                      <span className="text-[2.8rem] font-bold leading-none text-white">
                        Gratis
                      </span>
                      <p className="mt-1.5 text-[12px] text-white/35">For altid</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-[2.8rem] font-bold leading-none text-white">
                          {tier.monthlyPrice.toLocaleString('da-DK')} kr
                        </span>
                        <span className="mb-2 text-[13px] text-white/40">/md</span>
                      </div>
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
                    isPopular ? 'btn-pine' : 'btn-ghost'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            )
          })}
        </div>

        {/* ── Enterprise note ── */}
        <div className="mt-8 text-center">
          <p className="text-[14px] text-white/40">
            Enterprise?{' '}
            <a href="#" className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors">
              Kontakt os for custom kæde- eller koncernaftaler.
            </a>
          </p>
        </div>

        {/* ── Global CTA ── */}
        <div className="mt-16 text-center">
          <a href="#" className="btn-pine inline-flex items-center gap-2">
            Opret gratis profil →
            <ArrowRight size={14} />
          </a>
          <p className="mt-3 text-[12px] text-white/25">
            Gratis at starte · Intet kreditkort · Opsig når som helst
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
          Naetwork ·{' '}
          <Link href="/" className="hover:text-white/50 transition-colors">
            Tilbage til forsiden
          </Link>
        </div>
      </footer>
    </div>
  )
}
