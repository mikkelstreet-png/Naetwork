'use client';

import Link from 'next/link';
import { ECONOMICS, formatDkk, splitPayment } from '@/lib/economics';

export function ImpactContent() {
  const examples = [600, 900, 1200, 1800] as const;

  const clarity = [
    ['Hvornår bidraget gælder', 'Fordelingen gælder for betalte sessioner. Anmodede, aflyste eller ikke-betalte sessioner tæller ikke som bidrag.'],
    ['Hvordan reglen fungerer', `Fordelingen er ${ECONOMICS.charityPercent}% til ${ECONOMICS.charityName}, ${ECONOMICS.professionalPercent}% til eksperten og ${ECONOMICS.platformPercent}% til platformen.`],
    ['Hvem formålet er', `Bidraget er tiltænkt ${ECONOMICS.charityName}. Naetwork er uafhængig og ikke officielt tilknyttet, medmindre det fremgår eksplicit.`],
    ['Hvad der skal dokumenteres', 'Når platformen modnes, bør betalte sessioner, fordelingsniveauer og samlet impact kunne vises klart.'],
  ] as const;

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_390px] lg:items-end">
          <div>
            <p className="kicker mb-5">Impact model</p>
            <h1 className="display-xl max-w-5xl">Én fast regel for hver betalt session.</h1>
            <p className="body-lg mt-7 max-w-2xl">
              Naetwork viser samme fordeling alle steder: {ECONOMICS.charityPercent}% til {ECONOMICS.charityName}, {ECONOMICS.professionalPercent}% til eksperten og {ECONOMICS.platformPercent}% til platformen.
            </p>
          </div>
          <aside className="dark-panel p-6">
            <p className="text-xs font-black uppercase text-white/40">Fast fordeling</p>
            <p className="mt-5 text-6xl font-black">{ECONOMICS.charityPercent}/{ECONOMICS.professionalPercent}/{ECONOMICS.platformPercent}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">Tallene styres fra én konfiguration, så Mikkel kan justere modellen ét sted.</p>
            <div className="mt-7 grid grid-cols-2 gap-px border border-white/10 bg-white/10">
              <div className="bg-gray-950 p-4">
                <p className="text-2xl font-black">60 min</p>
                <p className="mt-1 text-xs font-bold uppercase text-white/35">Format</p>
              </div>
              <div className="bg-white p-4 text-gray-950">
                <p className="text-2xl font-black">{formatDkk(ECONOMICS.minPriceDkk)}+</p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-400">Fra</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-4">
            {examples.map((price) => {
              const split = splitPayment(price)
              return (
                <div key={price} className="bg-white p-6">
                  <p className="text-xs font-black uppercase text-gray-400">{formatDkk(price)}</p>
                  <p className="mt-5 text-3xl font-black text-gray-950">{formatDkk(split.charity)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">til {ECONOMICS.charityName}</p>
                  <p className="mt-4 text-xs leading-relaxed text-gray-400">{formatDkk(split.professional)} til eksperten · {formatDkk(split.platform)} til platformen</p>
                </div>
              )
            })}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="kicker mb-5">Transparens</p>
              <h2 className="display-lg">Impact skal være let at forstå før betaling.</h2>
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
            <Link href="/professionals" className="pill-dark">Book 60 min</Link>
            <Link href="/professional/signup" className="pill-light">Bliv professional</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
