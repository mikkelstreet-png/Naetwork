'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { CONTRIBUTION_MAX, CONTRIBUTION_MIN, PRICE_MAX, PRICE_MIN, SESSION_MINUTES, contributionAmount, formatDkk } from '@/lib/platform';

export function ImpactContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';

  const examples = [PRICE_MIN, 900, 1200, PRICE_MAX].map((price) => [
    formatDkk(price),
    `${formatDkk(contributionAmount(price, CONTRIBUTION_MIN))}-${formatDkk(contributionAmount(price, CONTRIBUTION_MAX)).replace('DKK ', '')}`,
    `${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}%`,
  ] as const);

  const clarity = [
    [isDa ? 'Hvornår bidraget gælder' : 'When it applies', isDa ? 'Bidraget gælder for betalte sessioner. Anmodede, aflyste eller ikke-betalte sessioner tæller ikke som bidrag.' : 'The contribution applies to paid sessions. Requested, cancelled or unpaid sessions do not count as contributions.'],
    [isDa ? 'Hvordan procenten forstås' : 'How the percentage works', isDa ? 'Procenten beregnes ud fra den viste sessionspris. Minimumsbidraget vises før booking.' : 'The percentage is calculated from the displayed session price. The minimum contribution is visible before booking.'],
    [isDa ? 'Hvem formålet er' : 'Who it supports', isDa ? 'Bidraget er tiltænkt Kræftens Bekæmpelse. Naetwork er uafhængig og ikke officielt tilknyttet, medmindre det fremgår eksplicit.' : 'The contribution is intended for Kræftens Bekæmpelse. Naetwork is independent and not officially affiliated unless explicitly stated.'],
    [isDa ? 'Hvad der tæller' : 'What counts', isDa ? 'Kun gennemførte og betalte sessioner tæller. Aflyste, tilbageførte eller refunderede sessioner fjernes fra opgørelsen. Betaling aktiveres først, når aftaler og dokumentation er på plads.' : 'Only completed and paid sessions count. Cancelled, reversed or refunded sessions are excluded. Payments launch only after agreements and documentation are in place.'],
  ] as const;

  return (
    <main className="page-shell">
      <section className="border-b border-white/15 bg-[#09090b] px-5 py-12 text-white sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[1fr_410px] lg:items-end">
          <div>
            <p className="kicker mb-5 text-white/40">{isDa ? 'Bidragsmodel' : 'Impact model'}</p>
            <h1 className="display-xl max-w-5xl text-white">
              {isDa ? 'Karrieresparring skal skabe værdi efter timen.' : 'Career guidance should create value beyond the hour.'}
            </h1>
            <p className="body-lg mt-7 max-w-2xl text-white/55">
              {isDa
                ? 'Minimum 40% og op til 90% af en gennemført, betalt Naetwork-session afsættes til støtte for Kræftens Bekæmpelse. Den konkrete andel vises, før kandidaten sender sin anmodning.'
                : 'At least 40% and up to 90% of a completed, paid Naetwork session is allocated in support of Kræftens Bekæmpelse. The exact share is shown before the candidate sends a request.'}
            </p>
          </div>
          <aside className="relative overflow-hidden border border-white/20 bg-white/[0.035] p-7">
            <div className="signal-rail absolute inset-x-0 top-0"><span /><span /><span /><span /></div>
            <p className="text-xs font-black uppercase text-white/40">{isDa ? 'Kernemodel' : 'Core model'}</p>
            <p className="mt-5 text-5xl font-black sm:text-6xl">{CONTRIBUTION_MIN}-{CONTRIBUTION_MAX}%</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {isDa ? 'Minimum 40% fra hver betalt session. Professionelle kan vælge et højere bidragsniveau.' : 'Minimum 40% from every paid session. Professionals can choose a higher contribution level.'}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-px border border-white/10 bg-white/10">
              <div className="bg-gray-950 p-4">
                <p className="text-2xl font-black">{SESSION_MINUTES} min</p>
                <p className="mt-1 text-xs font-bold uppercase text-white/35">Format</p>
              </div>
              <div className="bg-white p-4 text-gray-950">
                <p className="text-2xl font-black">{formatDkk(PRICE_MIN)}+</p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-400">{isDa ? 'Fra' : 'From'}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-4">
            {examples.map(([price, impact, percent]) => (
              <div key={price} className="bg-white p-6">
                <p className="text-xs font-black uppercase text-gray-400">{price}</p>
                <p className="mt-5 text-3xl font-black text-gray-950">{impact}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{percent} {isDa ? 'af sessionsprisen' : 'of the session price'}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="kicker mb-5">{isDa ? 'Transparens' : 'Transparency'}</p>
              <h2 className="display-lg">
                {isDa ? 'Bidraget skal være let at forstå før betaling.' : 'Impact should be easy to understand before payment.'}
              </h2>
            </div>
            <div className="border-t border-gray-200">
              {clarity.map(([title, body], index) => (
                <div key={title} className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[70px_1fr]">
                  <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                  <div>
                    <h3 className="text-xl font-black text-gray-950">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/professionals" className="pill-dark">{isDa ? 'Book 60 min' : 'Book 60 min'}</Link>
            <Link href="/professional/signup" className="pill-light">{isDa ? 'Bliv professionel' : 'Become a professional'}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
