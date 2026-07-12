'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { CONTRIBUTION_MAX, CONTRIBUTION_MIN, PLATFORM_FEE_DKK, PRICE_MAX, PRICE_MIN, SESSION_MINUTES, contributionAmount, formatDkk } from '@/lib/platform';

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
    [isDa ? 'Hvordan procenten forstås' : 'How the percentage works', isDa ? 'Procenten beregnes af sessionsprisen eksklusive moms. Kandidatens totalpris inklusive moms og det konkrete bidrag vises før booking.' : 'The percentage is calculated from the session price excluding VAT. The candidate total including VAT and exact contribution are shown before booking.'],
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
              {isDa ? 'Én session. Tre former for værdi.' : 'One session. Three forms of value.'}
            </h1>
            <p className="body-lg mt-7 max-w-2xl text-white/55">
              {isDa
                ? 'Kandidaten får relevant indsigt. Den professionelle gør sin erfaring tilgængelig. 40%, 60%, 80% eller 90% af sessionsprisen eksklusive moms afsættes til støtte for Kræftens Bekæmpelse efter en gennemført og betalt session.'
                : 'The candidate gets relevant insight. The professional makes experience accessible. 40%, 60%, 80% or 90% of the session price excluding VAT is allocated in support of Kræftens Bekæmpelse after a completed and paid session.'}
            </p>
          </div>
          <aside className="relative overflow-hidden border border-white/20 bg-white/[0.035] p-7">
            <div className="signal-rail absolute inset-x-0 top-0"><span /><span /><span /><span /></div>
            <p className="text-xs font-black uppercase text-white/40">{isDa ? 'Kernemodel' : 'Core model'}</p>
            <p className="mt-5 text-5xl font-black sm:text-6xl">{CONTRIBUTION_MIN}-{CONTRIBUTION_MAX}%</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {isDa ? 'Fire faste bidragsniveauer. Procenten beregnes af prisen eksklusive moms.' : 'Four fixed contribution levels. The percentage is calculated from the price excluding VAT.'}
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
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{percent} {isDa ? 'af pris ekskl. moms' : 'of price excl. VAT'}</p>
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
            <Link href="/start" className="pill-dark">{isDa ? 'Start med din situation' : 'Start with your situation'}</Link>
            <Link href="/professional/signup" className="pill-light">{isDa ? 'Bliv professionel' : 'Become a professional'}</Link>
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-gray-500">{isDa ? `Naetworks platform- og betalingsgebyr er DKK ${PLATFORM_FEE_DKK} pr. gennemført session og ændrer ikke kandidatens viste totalpris. Betaling og bidragsafregning aktiveres først, når de nødvendige aftaler og processer er godkendt.` : `Naetwork's platform and payment fee is DKK ${PLATFORM_FEE_DKK} per completed session and does not change the candidate's displayed total. Payment and contribution settlement will only launch once the required agreements and processes have been approved.`}</p>
        </div>
      </section>
    </main>
  );
}
