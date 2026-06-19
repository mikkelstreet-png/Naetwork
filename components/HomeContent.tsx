'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function HomeContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';

  const copy = {
    eyebrow: 'Naetwork',
    title: isDa ? 'Én time. Mere klarhed.' : 'One hour. More clarity.',
    body: isDa
      ? 'Fokuserede karrieresessioner med professionals fra AI, Banking, Management Consulting og Private Equity.'
      : 'Focused career sessions with professionals from AI, Banking, Management Consulting and Private Equity.',
    primary: isDa ? 'Se profiler' : 'Browse profiles',
  };

  const signals = [
    ['60 min', isDa ? 'Fast format' : 'Fixed format'],
    ['DKK 500-1.800', isDa ? 'Tydelig pris' : 'Clear price'],
    ['Brief', isDa ? 'Kontekst før session' : 'Context before session'],
  ];

  const profiles = [
    ['AI', 'AI Product Lead', isDa ? 'Førende AI-miljø' : 'Leading AI environment', isDa ? 'Positionering, portfolio, rollevalg' : 'Positioning, portfolio, role choice', 'DKK 900'],
    ['Banking', 'Associate Director', isDa ? 'Global investment bank' : 'Global investment bank', isDa ? 'Technicals, fit, interviewbar' : 'Technicals, fit, interview bar', 'DKK 1.200'],
    ['Management Consulting', 'Senior Consultant', isDa ? 'Tier-one strategy firm' : 'Tier-one strategy firm', isDa ? 'Casestruktur, hypoteser, fit' : 'Case structure, hypotheses, fit', 'DKK 1.100'],
    ['Private Equity', 'Investment Professional', isDa ? 'Nordisk PE-fond' : 'Nordic PE fund', isDa ? 'Investment case, deal thinking' : 'Investment case, deal thinking', 'DKK 1.500'],
  ];

  const steps = [
    [isDa ? 'Vælg profil' : 'Choose profile', isDa ? 'Rolle, felt, output og pris.' : 'Role, field, output and price.'],
    [isDa ? 'Send brief' : 'Send brief', isDa ? 'Fokus, fase, mål og materiale.' : 'Focus, stage, goal and material.'],
    [isDa ? 'Book 60 min' : 'Book 60 min', isDa ? 'Brug timen på det vigtigste.' : 'Use the hour on what matters most.'],
  ];

  return (
    <>
      <section id="home" className="bg-white px-5 pt-28 sm:px-8 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 text-xs font-black uppercase text-gray-400">{copy.eyebrow}</p>
          <h1 className="max-w-5xl text-7xl font-black leading-[0.88] tracking-tight text-gray-950 text-balance md:text-9xl">
            {copy.title}
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-xl text-base leading-relaxed text-gray-600 md:text-xl">{copy.body}</p>
            <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
              {copy.primary}
            </Link>
          </div>

          <div className="mt-24 grid border-y border-gray-200 md:grid-cols-3">
            {signals.map(([value, label]) => (
              <div key={label} className="border-b border-gray-200 py-5 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <p className="text-2xl font-black text-gray-950">{value}</p>
                <p className="mt-1 text-xs font-semibold text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="market" className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div id="profile-universe" className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <h2 className="text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
              {isDa ? 'Profiler som signal.' : 'Profiles as signal.'}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:ml-auto md:text-base">
              {isDa
                ? 'Et roligt indeks over hvem personen er, hvad sessionen kan bruges til, og hvad timen koster.'
                : 'A calm index of who the person is, what the session can be used for, and what the hour costs.'}
            </p>
          </div>

          <div className="border-t border-gray-200">
            {profiles.map(([field, role, company, use, price]) => (
              <Link key={`${field}-${role}`} href="/professionals" className="group grid gap-4 border-b border-gray-200 py-6 transition-colors hover:bg-[#fafaf8] md:grid-cols-[180px_1fr_1fr_120px] md:items-center md:px-3">
                <p className="text-xs font-black uppercase text-gray-400">{field}</p>
                <div>
                  <p className="text-xl font-black tracking-tight text-gray-950">{role}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{company}</p>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{use}</p>
                <p className="text-sm font-black text-gray-950 md:text-right">{price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-gray-200 bg-[#f7f7f4] px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <h2 className="text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
            {isDa ? 'Ikke mere end nødvendigt.' : 'Nothing more than needed.'}
          </h2>
          <div className="border-t border-gray-200">
            {steps.map(([title, body], index) => (
              <div key={title} className="grid gap-4 border-b border-gray-200 py-7 md:grid-cols-[80px_1fr]">
                <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-950 px-5 py-20 text-white sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase text-white/35">{isDa ? 'Model' : 'Model'}</p>
            <h2 className="max-w-3xl text-5xl font-black leading-none tracking-tight text-white text-balance md:text-7xl">
              {isDa ? 'Tydeligt format. Valgfri impact.' : 'Clear format. Optional impact.'}
            </h2>
          </div>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3 md:min-w-[520px]">
            {[
              ['60 min', isDa ? 'Session' : 'Session'],
              ['DKK 500+', isDa ? 'Fra' : 'From'],
              ['50/100%', 'Impact'],
            ].map(([value, label]) => (
              <div key={label} className="bg-gray-950 p-5">
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
            <h2 className="max-w-4xl text-5xl font-black leading-none tracking-tight text-gray-950 text-balance md:text-7xl">
              {isDa ? 'Find profilen. Book timen.' : 'Find the profile. Book the hour.'}
            </h2>
            <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
              {copy.primary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
