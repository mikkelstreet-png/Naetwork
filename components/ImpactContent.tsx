'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function ImpactContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';

  const examples = [
    ['DKK 600', 'DKK 240+', '40%'],
    ['DKK 900', 'DKK 360+', '40%'],
    ['DKK 1.200', 'DKK 480+', '40%'],
    ['DKK 1.800', 'DKK 720+', '40%'],
  ] as const;

  const clarity = [
    [isDa ? 'Hvornår bidraget gælder' : 'When it applies', isDa ? 'Bidraget gælder for betalte sessioner. Anmodede, aflyste eller ikke-betalte sessioner tæller ikke som bidrag.' : 'The contribution applies to paid sessions. Requested, cancelled or unpaid sessions do not count as contributions.'],
    [isDa ? 'Hvordan procenten forstås' : 'How the percentage works', isDa ? 'Procenten beregnes ud fra den viste sessionspris. Minimumsbidraget vises før booking.' : 'The percentage is calculated from the displayed session price. The minimum contribution is visible before booking.'],
    [isDa ? 'Hvem formålet er' : 'Who it supports', isDa ? 'Bidraget er tiltænkt Kræftens Bekæmpelse. Naetwork er uafhængig og ikke officielt tilknyttet, medmindre det fremgår eksplicit.' : 'The contribution is intended for Kræftens Bekæmpelse. Naetwork is independent and not officially affiliated unless explicitly stated.'],
    [isDa ? 'Hvad der skal dokumenteres' : 'What should be documented', isDa ? 'Når platformen modnes, bør betalte sessioner, bidragsniveauer og samlet impact kunne vises klart.' : 'As the platform matures, paid sessions, contribution levels and total impact should be shown clearly.'],
  ] as const;

  return (
    <main className="page-shell">
      <section className="border-b border-gray-200 bg-white px-5 py-10 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_390px] lg:items-end">
          <div>
            <p className="kicker mb-5">Impact model</p>
            <h1 className="display-xl max-w-5xl">
              {isDa ? 'Karrieresparring skal skabe værdi efter timen.' : 'Career guidance should create value beyond the hour.'}
            </h1>
            <p className="body-lg mt-7 max-w-2xl">
              {isDa
                ? 'Hver betalt Naetwork-session bidrager med minimum 40% og op til 90% af sessionsprisen til Kræftens Bekæmpelse. Det gør impact konkret, før kandidaten booker.'
                : 'Every paid Naetwork session contributes at least 40% and up to 90% of the session price to Kræftens Bekæmpelse. That makes impact concrete before the candidate books.'}
            </p>
          </div>
          <aside className="dark-panel p-6">
            <p className="text-xs font-black uppercase text-white/40">{isDa ? 'Kernemodel' : 'Core model'}</p>
            <p className="mt-5 text-5xl font-black sm:text-6xl">40-90%</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {isDa ? 'Minimum 40% fra hver betalt session. Professionals kan vælge et højere bidragsniveau.' : 'Minimum 40% from every paid session. Professionals can choose a higher contribution level.'}
            </p>
            <div className="mt-7 grid grid-cols-2 gap-px border border-white/10 bg-white/10">
              <div className="bg-gray-950 p-4">
                <p className="text-2xl font-black">60 min</p>
                <p className="mt-1 text-xs font-bold uppercase text-white/35">Format</p>
              </div>
              <div className="bg-white p-4 text-gray-950">
                <p className="text-2xl font-black">DKK 600+</p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-400">{isDa ? 'Fra' : 'From'}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-4">
            {examples.map(([price, impact, percent]) => (
              <div key={price} className="bg-white p-6">
                <p className="text-xs font-black uppercase text-gray-400">{price}</p>
                <p className="mt-5 text-3xl font-black text-gray-950">{impact}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{percent} {isDa ? 'som minimumsbidrag' : 'minimum contribution'}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="kicker mb-5">{isDa ? 'Transparens' : 'Transparency'}</p>
              <h2 className="display-lg">
                {isDa ? 'Impact skal være let at forstå før betaling.' : 'Impact should be easy to understand before payment.'}
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
            <Link href="/professional/signup" className="pill-light">{isDa ? 'Bliv professional' : 'Become a professional'}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
