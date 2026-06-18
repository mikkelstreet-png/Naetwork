'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function HomeContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';

  const hero = {
    eyebrow: isDa ? 'Naetwork career sessions' : 'Naetwork career sessions',
    title: isDa
      ? 'Forberedelse til ambitiøse karrierevalg.'
      : 'Preparation for ambitious career decisions.',
    body: isDa
      ? 'Én fokuseret 60-minutters session med en professional fra AI, Banking, Management Consulting eller Private Equity. Vælg fokus, send kontekst, og brug timen på det, der flytter dig mest.'
      : 'One focused 60-minute session with a professional from AI, Banking, Management Consulting or Private Equity. Choose the focus, send context, and use the hour on what moves you most.',
    primary: isDa ? 'Se profiler' : 'Browse profiles',
    secondary: isDa ? 'Find dit fokus' : 'Find your focus',
  };

  const signals = [
    ['60 min', isDa ? 'Altid samme format' : 'Always the same format'],
    ['DKK 500-1.800', isDa ? 'Tydelig pris før booking' : 'Clear price before booking'],
    ['4', isDa ? 'Kuraterede karrierespor' : 'Curated career tracks'],
    ['Brief', isDa ? 'Kontekst før samtalen' : 'Context before the call'],
  ];

  const profiles = [
    {
      field: 'AI',
      role: 'AI Product Lead',
      company: 'Google DeepMind',
      use: isDa ? 'AI-positionering, portfolio, rollevalg' : 'AI positioning, portfolio, role choice',
      price: 'DKK 900',
      accent: 'bg-sky-300',
    },
    {
      field: 'Banking',
      role: 'Associate Director',
      company: 'Goldman Sachs',
      use: isDa ? 'Technicals, fit, interviewbar' : 'Technicals, fit, interview bar',
      price: 'DKK 1.200',
      accent: 'bg-emerald-300',
    },
    {
      field: 'Management Consulting',
      role: 'Senior Consultant',
      company: 'McKinsey & Company',
      use: isDa ? 'Casestruktur, hypoteser, fit' : 'Case structure, hypotheses, fit',
      price: 'DKK 1.100',
      accent: 'bg-cyan-300',
    },
    {
      field: 'Private Equity',
      role: 'Investment Professional',
      company: 'Nordic PE fund',
      use: isDa ? 'Investment case, deal thinking, diligence' : 'Investment case, deal thinking, diligence',
      price: 'DKK 1.500',
      accent: 'bg-lime-300',
    },
  ];

  const principles = [
    {
      title: isDa ? 'Færre valg. Bedre signal.' : 'Fewer choices. Better signal.',
      body: isDa ? 'Naetwork er bevidst smalt: fire krævende karriereveje, ét sessionformat og tydelig pris.' : 'Naetwork is intentionally narrow: four demanding career paths, one session format and clear pricing.',
    },
    {
      title: isDa ? 'Kontekst før rådgivning.' : 'Context before advice.',
      body: isDa ? 'Kandidaten vælger fokus, procesfase, mål og materiale, så samtalen starter skarpere.' : 'The candidate chooses focus, process stage, goal and material, so the conversation starts sharper.',
    },
    {
      title: isDa ? 'Output over inspiration.' : 'Output over inspiration.',
      body: isDa ? 'Målet er ikke mere støj. Målet er bedre svar, skarpere materiale eller klarere næste skridt.' : 'The goal is not more noise. The goal is better answers, sharper materials or clearer next steps.',
    },
  ];

  const fields = ['AI', 'Banking', 'Management Consulting', 'Private Equity'];

  return (
    <>
      <section id="home" className="bg-white px-5 pt-28 sm:px-8 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-5xl">
            <p className="mb-7 text-xs font-black uppercase text-gray-400">{hero.eyebrow}</p>
            <h1 className="max-w-5xl text-6xl font-black leading-[0.92] tracking-tight text-gray-950 text-balance md:text-8xl lg:text-9xl">
              {hero.title}
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-gray-600 md:text-xl">
              {hero.body}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/professionals" className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                {hero.primary}
              </Link>
              <Link href="/match" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950">
                {hero.secondary}
              </Link>
            </div>
          </div>

          <div className="mt-20 grid border-y border-gray-200 md:grid-cols-4">
            {signals.map(([value, label]) => (
              <div key={label} className="border-b border-gray-200 py-5 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <p className="text-2xl font-black text-gray-950">{value}</p>
                <p className="mt-1 text-xs font-semibold text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="profile-universe" className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Profil-univers' : 'Profile universe'}</p>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-6xl">
                {isDa ? 'Vælg på signal, ikke støj.' : 'Choose by signal, not noise.'}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">
              {isDa
                ? 'Profil-universet skal fungere som et roligt indeks: felt, rolle, use case, pris. Intet overforklaret, intet pakket ind.'
                : 'The profile universe works like a calm index: field, role, use case, price. Nothing over-explained, nothing over-packaged.'}
            </p>
          </div>

          <div className="border-t border-gray-200">
            {profiles.map((profile) => (
              <Link key={`${profile.field}-${profile.role}`} href="/professionals" className="group grid gap-5 border-b border-gray-200 py-6 transition-colors hover:bg-[#fafaf8] md:grid-cols-[160px_1fr_1fr_120px] md:items-center md:px-3">
                <div className="flex items-center gap-3">
                  <span className={`block h-2 w-10 rounded-full ${profile.accent}`} />
                  <p className="text-xs font-black uppercase text-gray-500">{profile.field}</p>
                </div>
                <div>
                  <p className="text-xl font-black tracking-tight text-gray-950">{profile.role}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{profile.company}</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{profile.use}</p>
                <p className="text-left text-sm font-black text-gray-950 md:text-right">{profile.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f7f7f4] px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Produkt' : 'Product'}</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-6xl">
              {isDa ? 'Én time. Ét fokus. Et bedre næste skridt.' : 'One hour. One focus. One better next step.'}
            </h2>
          </div>
          <div className="space-y-0 border-t border-gray-200">
            {principles.map((item, index) => (
              <div key={item.title} className="grid gap-4 border-b border-gray-200 py-7 md:grid-cols-[80px_1fr]">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-gray-950">{item.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Format' : 'Format'}</p>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-6xl">
                {isDa ? 'Så simpelt skal det føles.' : 'This simple is the point.'}
              </h2>
            </div>
            <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
              {hero.primary}
            </Link>
          </div>

          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-4">
            {[
              [isDa ? 'Vælg profil' : 'Choose profile', isDa ? 'Se rolle, branche, use case og pris.' : 'See role, field, use case and price.'],
              [isDa ? 'Vælg fokus' : 'Choose focus', isDa ? 'CV, interview, case, technicals eller retning.' : 'CV, interview, case, technicals or direction.'],
              [isDa ? 'Send brief' : 'Send brief', isDa ? 'Giv kontekst før sessionen.' : 'Give context before the session.'],
              [isDa ? 'Book 60 min' : 'Book 60 min', isDa ? 'Brug timen på det vigtigste.' : 'Use the hour on what matters most.'],
            ].map(([title, body], index) => (
              <div key={title} className="bg-white p-6 md:min-h-[260px]">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <h3 className="mt-16 text-xl font-black tracking-tight text-gray-950">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="market" className="border-y border-gray-200 bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Spor' : 'Tracks'}</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-6xl">
              {isDa ? 'Kun de spor, hvor insider-kontekst betyder mest.' : 'Only the tracks where insider context matters most.'}
            </h2>
          </div>
          <div className="border-t border-gray-200">
            {fields.map((field) => (
              <div key={field} className="flex items-center justify-between gap-6 border-b border-gray-200 py-6">
                <p className="text-2xl font-black tracking-tight text-gray-950">{field}</p>
                <p className="text-right text-xs font-bold uppercase text-gray-400">60 min</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-950 px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-black uppercase text-white/35">{isDa ? 'Pris og impact' : 'Price and impact'}</p>
            <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white text-balance md:text-6xl">
              {isDa ? 'Tydelig pris. Valgfri impact.' : 'Clear price. Optional impact.'}
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
              {isDa
                ? 'Professionelle sætter selv prisen inden for platformens ramme og kan vælge en impact-model med donation til Kræftens Bekæmpelse.'
                : 'Professionals set their own price within the platform range and can choose an impact model with donation to the Danish Cancer Society.'}
            </p>
          </div>
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              ['DKK 500+', isDa ? 'Startpris' : 'Starting price'],
              ['60 min', isDa ? 'Fast format' : 'Fixed format'],
              ['50/100%', isDa ? 'Impact options' : 'Impact options'],
            ].map(([value, label]) => (
              <div key={label} className="bg-gray-950 p-6">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs font-semibold text-white/45">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-6xl border-t border-gray-200 pt-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-gray-400">Naetwork</p>
              <h2 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-6xl">
                {isDa ? 'Find en profil. Book én time. Bliv skarpere.' : 'Find a profile. Book one hour. Get sharper.'}
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link href="/professionals" className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                {hero.primary}
              </Link>
              <Link href="/match" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950">
                {hero.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
