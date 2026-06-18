'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function HomeContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';

  const copy = {
    eyebrow: isDa ? 'For kandidater med høje ambitioner' : 'For ambitious candidates',
    heroTitle: isDa
      ? 'Karrieresparring fra mennesker, der kender vejen indefra.'
      : 'Career guidance from people who know the path from inside.',
    heroBody: isDa
      ? 'Book en 60-minutters 1:1 session med en professionel fra AI, Banking, Management Consulting eller Private Equity. Vælg selv fokus: CV, interview, case, technicals, AI strategy eller karrierevalg.'
      : 'Book a 60-minute 1:1 session with a professional from AI, Banking, Management Consulting or Private Equity. Choose the focus yourself: CV, interview, case, technicals, AI strategy or career direction.',
    primaryCta: isDa ? 'Find en professionel' : 'Find a professional',
    secondaryCta: isDa ? 'Bliv professionel' : 'Become a professional',
    snapshotTitle: isDa ? 'Sådan føles produktet' : 'What the product feels like',
    snapshotBody: isDa
      ? 'En enkel booking, et klart session brief og konkret sparring fra en person, der har stået i miljøet.'
      : 'A simple booking, a clear session brief and concrete guidance from someone who has been in the environment.',
    howTitle: isDa ? 'Et simpelt format. Mere skarphed.' : 'A simple format. More clarity.',
    marketTitle: isDa ? 'Kurateret omkring fire karriereveje.' : 'Curated around four career paths.',
    impactTitle: isDa ? 'Professionelt format. Men med mening.' : 'Professional format. With purpose.',
    finalTitle: isDa ? 'Book 60 minutter tættere på virkeligheden.' : 'Book 60 minutes closer to the real thing.',
  };

  const productSteps = [
    {
      number: '01',
      title: isDa ? 'Vælg den rette profil' : 'Choose the right profile',
      body: isDa ? 'Filtrer efter AI, Banking, Consulting eller Private Equity.' : 'Filter by AI, Banking, Consulting or Private Equity.',
    },
    {
      number: '02',
      title: isDa ? 'Book 60 minutter' : 'Book 60 minutes',
      body: isDa ? 'Én ydelse, én varighed, tydelig pris før booking.' : 'One product, one duration, clear price before booking.',
    },
    {
      number: '03',
      title: isDa ? 'Lav et session brief' : 'Create a session brief',
      body: isDa ? 'Vælg fokus og skriv, hvad du vil opnå.' : 'Choose a focus and explain what you want to achieve.',
    },
    {
      number: '04',
      title: isDa ? 'Mød forberedt op' : 'Show up prepared',
      body: isDa ? 'Få konkrete svar, feedback og næste skridt.' : 'Get concrete answers, feedback and next steps.',
    },
  ];

  const fields = [
    {
      title: 'AI',
      body: isDa ? 'Product, strategy, machine learning og veje ind i et hurtigt felt.' : 'Product, strategy, machine learning and paths into a fast-moving field.',
      accent: 'bg-sky-300',
    },
    {
      title: 'Banking',
      body: isDa ? 'M&A, technicals, fit interviews og det tempo, der møder dig.' : 'M&A, technicals, fit interviews and the pace you will meet.',
      accent: 'bg-emerald-300',
    },
    {
      title: 'Management Consulting',
      body: isDa ? 'Cases, struktur, hypoteser, kommunikation og personlig fit.' : 'Cases, structure, hypotheses, communication and personal fit.',
      accent: 'bg-cyan-300',
    },
    {
      title: 'Private Equity',
      body: isDa ? 'Investment cases, diligence, deal thinking og adgang til et lukket miljø.' : 'Investment cases, diligence, deal thinking and access to a closed environment.',
      accent: 'bg-lime-300',
    },
  ];

  const focusAreas = ['CV / LinkedIn', 'Interview Prep', 'Case Prep', 'Banking Technicals', 'Consulting Cases', 'PE / Investment Case', 'AI Career Strategy', 'Career Direction'];

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .home-fade { animation: fade-up 0.72s cubic-bezier(.22,1,.36,1) both; }
        .home-delay-1 { animation-delay: 0.08s; }
        .home-delay-2 { animation-delay: 0.18s; }
        .home-delay-3 { animation-delay: 0.28s; }
        .hero-field {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0)),
            radial-gradient(circle at 16% 24%, rgba(125, 211, 252, 0.32), transparent 28%),
            radial-gradient(circle at 82% 18%, rgba(134, 239, 172, 0.22), transparent 30%),
            radial-gradient(circle at 54% 78%, rgba(6, 182, 212, 0.22), transparent 34%),
            linear-gradient(135deg, #050505 0%, #101211 52%, #050505 100%);
        }
        .quiet-grid {
          background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, black 0%, transparent 72%);
        }
      `}</style>

      <section id="home" className="relative isolate overflow-hidden bg-gray-950 text-white">
        <div className="quiet-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="hero-field absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-950 to-transparent" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col justify-end px-5 pb-10 pt-28 sm:px-8 md:min-h-[780px] md:pb-14">
          <div className="max-w-4xl">
            <p className="home-fade mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-white/75 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {copy.eyebrow}
            </p>
            <h1 className="home-fade home-delay-1 text-5xl font-black leading-[0.95] tracking-tight text-white text-balance md:text-7xl lg:text-8xl">
              {copy.heroTitle}
            </h1>
            <p className="home-fade home-delay-2 mt-7 max-w-2xl text-base leading-relaxed text-white/72 md:text-xl">
              {copy.heroBody}
            </p>
            <div className="home-fade home-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/professionals" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-gray-950 transition-colors hover:bg-gray-100">
                {copy.primaryCta}
              </Link>
              <Link href="/professional/signup" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15">
                {copy.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur md:grid-cols-4">
            {[
              ['60 min', isDa ? 'Ét enkelt format' : 'One simple format'],
              ['DKK 500-1.800', isDa ? 'Pris sat af profilen' : 'Price set by profile'],
              ['4', isDa ? 'Karriereveje' : 'Career paths'],
              ['8+', isDa ? 'Mulige fokusområder' : 'Possible focus areas'],
            ].map(([value, label]) => (
              <div key={label} className="bg-gray-950/42 p-5">
                <p className="text-xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs font-medium text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 text-xs font-bold uppercase text-gray-400">{copy.snapshotTitle}</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-5xl">{copy.howTitle}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">{copy.snapshotBody}</p>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-[#f7f7f4] p-4 md:p-6">
            <div className="rounded-[1.5rem] bg-gray-950 p-5 text-white shadow-2xl shadow-gray-950/15 md:p-7">
              <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-white/45">Session brief</p>
                  <h3 className="mt-2 text-2xl font-black">1:1 Career Session</h3>
                  <p className="mt-2 text-sm text-white/55">AI Product Lead · 60 min · DKK 900</p>
                </div>
                <span className="w-fit rounded-full bg-emerald-300 px-3 py-1.5 text-xs font-bold text-gray-950">{isDa ? 'Ledig denne uge' : 'Available this week'}</span>
              </div>

              <div className="grid gap-3 py-6 sm:grid-cols-2">
                {focusAreas.slice(0, 6).map((focus, index) => (
                  <div key={focus} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${index === 0 ? 'border-white bg-white text-gray-950' : 'border-white/10 bg-white/[0.04] text-white/70'}`}>
                    {focus}
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-bold uppercase text-white/40">{isDa ? 'Mål for sessionen' : 'Session goal'}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/72">
                  {isDa
                    ? 'Jeg vil forstå, hvordan jeg bedst positionerer min erfaring til AI product roles og hvilke spørgsmål jeg skal kunne svare stærkt på.'
                    : 'I want to understand how to position my experience for AI product roles and which questions I need to answer well.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-gray-200 bg-[#f7f7f4] px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-bold uppercase text-gray-400">{isDa ? 'Sådan virker det' : 'How it works'}</p>
              <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-5xl">
                {isDa ? 'Fra ambition til konkret forberedelse.' : 'From ambition to concrete preparation.'}
              </h2>
            </div>
            <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-full bg-gray-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {copy.primaryCta}
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 md:grid-cols-4">
            {productSteps.map((step) => (
              <div key={step.number} className="bg-white p-6 md:min-h-[260px] md:p-7">
                <p className="text-xs font-black text-gray-300">{step.number}</p>
                <h3 className="mt-12 text-lg font-black leading-tight text-gray-950 md:mt-16">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="market" className="bg-white px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase text-gray-400">{isDa ? 'Markedet' : 'Marketplace'}</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-5xl">{copy.marketTitle}</h2>
            <p className="mt-5 text-base leading-relaxed text-gray-600">
              {isDa
                ? 'Naetwork skal ikke være alt for alle. Det skal være skarpt, relevant og hurtigt at forstå for kandidater, der sigter mod krævende miljøer.'
                : 'Naetwork should not be everything for everyone. It should be sharp, relevant and easy to understand for candidates aiming at demanding environments.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {fields.map((field) => (
              <article key={field.title} className="group flex min-h-[330px] flex-col justify-between rounded-3xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-950/8">
                <div>
                  <span className={`block h-2 w-16 rounded-full ${field.accent}`} />
                  <h3 className="mt-8 text-2xl font-black tracking-tight text-gray-950">{field.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">{field.body}</p>
                </div>
                <div className="mt-10 border-t border-gray-100 pt-5">
                  <p className="text-xs font-bold uppercase text-gray-400">60 min · DKK 500-1.800</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-950 px-5 py-24 text-white sm:px-8 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="mb-4 text-xs font-bold uppercase text-white/40">{isDa ? 'Format og impact' : 'Format and impact'}</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-white text-balance md:text-5xl">{copy.impactTitle}</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              {isDa
                ? 'Prisen er konkret, formatet er enkelt, og professionelle kan vælge en impact-model med donation til Kræftens Bekæmpelse.'
                : 'The price is concrete, the format is simple, and professionals can choose an impact model with donation to the Danish Cancer Society.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-bold uppercase text-white/40">{isDa ? 'Standardformat' : 'Standard format'}</p>
              <p className="mt-5 text-3xl font-black">60 min</p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {isDa ? 'Kandidaten vælger selv fokus før booking.' : 'The candidate chooses the focus before booking.'}
              </p>
              <div className="mt-8 rounded-2xl bg-white p-5 text-gray-950">
                <p className="text-xs font-bold uppercase text-gray-400">{isDa ? 'Prisramme' : 'Price range'}</p>
                <p className="mt-2 text-2xl font-black">DKK 500-1.800</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white p-6 text-gray-950">
              <p className="text-xs font-bold uppercase text-gray-400">Impact</p>
              <p className="mt-5 text-3xl font-black">50% / 100%</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {isDa
                  ? 'Professionelle kan vælge at donere en del af deres indtjening via platformens impact-model.'
                  : 'Professionals can choose to donate part of their earnings through the platform impact model.'}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-100 p-4">
                  <p className="text-xl font-black">20%</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">Shared Impact fee</p>
                </div>
                <div className="rounded-2xl bg-emerald-100 p-4">
                  <p className="text-xl font-black">10%</p>
                  <p className="mt-1 text-xs font-medium text-gray-600">All-in Impact fee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 text-center sm:px-8 md:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="mx-auto mb-8 h-px max-w-md bg-gradient-to-r from-transparent via-gray-300 to-transparent" aria-hidden="true" />
          <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-6xl">{copy.finalTitle}</h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600">
            {isDa
              ? 'Find en person med erfaring fra den karrierevej, du sigter efter, og brug timen på det, der flytter dig mest.'
              : 'Find someone with experience from the career path you are aiming for, and use the hour on what moves you most.'}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/professionals" className="inline-flex items-center justify-center rounded-full bg-gray-950 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {copy.primaryCta}
            </Link>
            <Link href="/professional/signup" className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3.5 text-sm font-bold text-gray-950 transition-colors hover:border-gray-950 hover:bg-gray-50">
              {copy.secondaryCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
