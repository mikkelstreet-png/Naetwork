'use client';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export function HomeContent() {
  const { tr, lang } = useTranslation();
  const isDa = lang === 'da';

  // Change 9: removed tone classes from heroSignals — cards will use bg-white/border-gray-100
  const heroSignals = [
    {
      title: '60 min',
      body: isDa ? 'Én tydelig 1:1 session med fri fokusretning' : 'One clear 1:1 session with flexible focus',
    },
    {
      title: 'DKK 500-1.800',
      body: isDa ? 'Prisen sættes af den professionelle' : 'Price set by the professional',
    },
    {
      title: isDa ? 'Fire fokusområder' : 'Four focus areas',
      body: 'AI, Banking, Management Consulting & Private Equity',
    },
  ];

  const focusOptions = [
    { title: 'CV / LinkedIn', body: isDa ? 'Få dit materiale skarpere og mere relevant.' : 'Make your material sharper and more relevant.', tone: 'tone-cyan' },
    { title: 'Interview Prep', body: isDa ? 'Træn svar, struktur og troværdighed.' : 'Practice answers, structure and credibility.', tone: 'tone-mint' },
    { title: 'Case Prep', body: isDa ? 'Øv cases, hypoteser og kommunikation.' : 'Practice cases, hypotheses and communication.', tone: 'tone-blue' },
    { title: 'Career Direction', body: isDa ? 'Få klarhed over roller, brancher og næste skridt.' : 'Get clarity on roles, fields and next steps.', tone: 'tone-sage' },
    { title: 'Banking Technicals', body: isDa ? 'Forstå processer, technicals og interviewkrav.' : 'Understand processes, technicals and interview expectations.', tone: 'tone-mint' },
    { title: 'Consulting Cases', body: isDa ? 'Bliv bedre til struktur, problem solving og fit.' : 'Improve structure, problem solving and fit.', tone: 'tone-cyan' },
    { title: 'PE / Investment Case', body: isDa ? 'Træn investment thinking, diligence og cases.' : 'Practice investment thinking, diligence and cases.', tone: 'tone-sage' },
    { title: 'AI Career Strategy', body: isDa ? 'Afkod roller, portfolio og veje ind i AI.' : 'Decode roles, portfolio and paths into AI.', tone: 'tone-blue' },
  ];

  // Change 7: added taglines + Available badge data; bg-gray-900 initials circle
  const professionalCards = [
    {
      role: 'AI Product Lead',
      field: 'AI',
      price: 'DKK 500-1.800',
      tagline: 'Helped 3 candidates land PM roles at AI-first companies',
      focus: isDa ? 'Product interviews, AI strategy og career direction' : 'Product interviews, AI strategy and career direction',
      tone: 'tone-blue',
    },
    {
      role: 'Investment Banking Associate',
      field: 'Banking',
      price: 'DKK 500-1.800',
      tagline: 'M&A and ECM — knows what Goldman and Rothschild look for',
      focus: isDa ? 'M&A process, technicals, CV og fit interviews' : 'M&A process, technicals, CV and fit interviews',
      tone: 'tone-mint',
    },
    {
      role: 'Management Consultant',
      field: 'Consulting',
      price: 'DKK 500-1.800',
      tagline: 'Case and fit prep from inside McKinsey and Bain',
      focus: isDa ? 'Case struktur, hypoteser og kommunikation' : 'Case structure, hypotheses and communication',
      tone: 'tone-cyan',
    },
    {
      role: 'Private Equity Investor',
      field: 'Private Equity',
      price: 'DKK 500-1.800',
      tagline: 'PE interviews, investment thinking and what the process actually looks like',
      focus: isDa ? 'Investment cases, diligence og deal thinking' : 'Investment cases, diligence and deal thinking',
      tone: 'tone-sage',
    },
  ];

  const industryCards = [
    {
      title: 'AI',
      body: isDa
        ? 'Product, strategy, machine learning og implementation. Få sparring fra folk tæt på et felt, der bevæger sig hurtigt.'
        : 'Product, strategy, machine learning and implementation. Get guidance from people close to a field that moves fast.',
      tone: 'tone-blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
        </svg>
      ),
    },
    {
      title: 'Banking',
      body: isDa
        ? 'M&A, ECM, DCM og Corporate Finance. Forstå processen, tempoet og hvad der adskiller stærke kandidater.'
        : 'M&A, ECM, DCM and Corporate Finance. Understand the process, pace and what separates strong candidates.',
      tone: 'tone-mint',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m-4 4h8M4 21h16M6 17V9m4 8V9m4 8V9m4 8V9" />
        </svg>
      ),
    },
    {
      title: 'Management Consulting',
      body: isDa
        ? 'Case-interviews, problemløsning, klientarbejde og kultur. Træn mod det, der faktisk møder dig.'
        : 'Case interviews, problem solving, client work and culture. Prepare for what you will actually meet.',
      tone: 'tone-cyan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      title: 'Private Equity',
      body: isDa
        ? 'Deal sourcing, due diligence, investment cases og portfolio work. Få et lukket miljø forklaret indefra.'
        : 'Deal sourcing, due diligence, investment cases and portfolio work. Understand a closed world from the inside.',
      tone: 'tone-sage',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
    },
  ];

  const proofCards = [
    {
      title: isDa ? 'Én enkel ydelse' : 'One simple product',
      body: isDa
        ? 'Kandidaten booker 60 minutter og vælger selv, hvad sessionen skal handle om.'
        : 'The candidate books 60 minutes and chooses what the session should focus on.',
    },
    {
      title: isDa ? 'Fleksibelt for professionals' : 'Flexible for professionals',
      body: isDa
        ? 'Professionelle sætter selv pris mellem DKK 500 og 1.800 afhængigt af erfaring og efterspørgsel.'
        : 'Professionals set their own price between DKK 500 and 1,800 based on experience and demand.',
    },
    {
      title: isDa ? 'Direkte adgang' : 'Direct access',
      body: isDa
        ? 'Du booker mennesker med relevant erfaring og får indblik i, hvordan processen føles indefra.'
        : 'You book people with relevant experience and get insight into how the process works from inside.',
    },
  ];

  const howSteps = [
    { num: '01', titleKey: 'how.step1_title', bodyKey: 'how.step1_body' },
    { num: '02', titleKey: 'how.step2_title', bodyKey: 'how.step2_body' },
    { num: '03', titleKey: 'how.step3_title', bodyKey: 'how.step3_body' },
    { num: '04', titleKey: 'how.step4_title', bodyKey: 'how.step4_body' },
  ];

  const faqItems = [
    { q: 'faq.q1', a: 'faq.a1' },
    { q: 'faq.q2', a: 'faq.a2' },
    { q: 'faq.q3', a: 'faq.a3' },
    { q: 'faq.q4', a: 'faq.a4' },
    { q: 'faq.q5', a: 'faq.a5' },
    { q: 'faq.q6', a: 'faq.a6' },
  ];

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.65s cubic-bezier(.22,1,.36,1) both; }
        .delay-1 { animation-delay: 0.10s; }
        .delay-2 { animation-delay: 0.20s; }
        .delay-3 { animation-delay: 0.32s; }
        .delay-4 { animation-delay: 0.46s; }
        .tone-card {
          background: var(--tone-bg, #ffffff);
          border-color: var(--tone-border, rgba(229, 231, 235, 1));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.74), 0 1px 0 rgba(15, 23, 42, 0.02);
        }
        .tone-cyan {
          --tone-bg: linear-gradient(135deg, #f8feff 0%, #e7fbfa 55%, #f9fafb 100%);
          --tone-border: rgba(6, 182, 212, 0.20);
        }
        .tone-mint {
          --tone-bg: linear-gradient(135deg, #fbfff7 0%, #e8f8ec 52%, #f8fafc 100%);
          --tone-border: rgba(34, 197, 94, 0.20);
        }
        .tone-blue {
          --tone-bg: linear-gradient(135deg, #fbfdff 0%, #e8f3ff 52%, #f8fafc 100%);
          --tone-border: rgba(59, 130, 246, 0.18);
        }
        .tone-sage {
          --tone-bg: linear-gradient(135deg, #fcfff7 0%, #edf4df 50%, #f9fafb 100%);
          --tone-border: rgba(132, 204, 22, 0.18);
        }
        .tone-ink {
          --tone-bg: linear-gradient(135deg, #050505 0%, #091617 48%, #0a1710 100%);
          --tone-border: rgba(255, 255, 255, 0.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 28px 70px rgba(15, 23, 42, 0.18);
        }
        .premium-card {
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }
        .premium-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
          border-color: rgba(15, 23, 42, 0.14);
        }
        .market-grid {
          background-image: linear-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* HERO */}
      <section id="home" className="bg-white px-6 pt-20 pb-16 md:pt-28 md:pb-20" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfb 62%, #ffffff 100%)' }}>
        <div className="max-w-6xl mx-auto grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="animate-fade-up">
              {/* Change 2 & 3: removed green dot, updated label text */}
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-gray-700 mb-10 border border-gray-200 bg-white px-3 py-1.5 rounded-full shadow-sm">
                {isDa ? 'For kandidater der forbereder sig seriøst' : 'For candidates who prepare seriously'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-none text-gray-950 mb-6 animate-fade-up delay-1 max-w-5xl">
              {isDa
                ? 'Book 60 minutter med en, der kender vejen indefra.'
                : 'Book 60 minutes with someone who knows the path from inside.'}
            </h1>

            {/* Change 1: updated hero subtitle */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mb-10 animate-fade-up delay-2">
              {isDa
                ? 'Én 1:1 session med én, der allerede har været igennem processen. Vælg dit fokus, book din tid, og kom skarpere frem.'
                : 'One 1:1 session with someone who has already been through the process. Choose your focus, book your time, and arrive sharper.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-3">
              <Link
                href="/professionals"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-950 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-base shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
              >
                {tr('hero.cta_primary')}
              </Link>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl border border-gray-300 hover:border-gray-950 hover:bg-gray-50 transition-colors text-base"
              >
                {isDa ? 'Se format og prisramme' : 'See format and pricing'}
              </Link>
            </div>

            {/* Change 9: pure white cards with gray-100 border */}
            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3 animate-fade-up delay-4">
              {heroSignals.map((item) => (
                <div key={item.title} className="premium-card rounded-2xl border border-gray-100 bg-white p-5">
                  <p className="text-sm font-bold text-gray-950">{item.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up delay-3">
            <div className="market-grid absolute inset-0 rounded-[28px] opacity-70" aria-hidden="true" />
            <div className="relative space-y-4 py-6 lg:py-10">
              <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">{isDa ? 'Session preview' : 'Session preview'}</p>
                    <p className="mt-1 text-sm font-bold text-gray-950">{isDa ? 'Vælg selv fokus før booking' : 'Choose your focus before booking'}</p>
                  </div>
                  <span className="rounded-full bg-gray-950 px-3 py-1 text-xs font-semibold text-white">60 min</span>
                </div>
              </div>

              <div className="premium-card tone-card tone-ink mx-auto max-w-md rounded-2xl border p-6 text-white lg:translate-x-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase text-cyan-200">{isDa ? 'Hovedydelse' : 'Core session'}</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">1:1 Career Session</h3>
                  </div>
                  <p className="text-lg font-black tracking-tight text-white">DKK 500-1.800</p>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-gray-300">
                  {isDa
                    ? '60 minutter med en relevant professionel. Brug tiden på det, der betyder mest for dit næste skridt.'
                    : '60 minutes with a relevant professional. Use the time on what matters most for your next move.'}
                </p>
              </div>

              <div className="mx-auto grid max-w-md grid-cols-2 gap-3 lg:-translate-x-4">
                {['CV / LinkedIn', 'Interview Prep', 'Case Prep', 'Career Direction'].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-bold text-gray-950">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm lg:-translate-x-6">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-lg font-black text-gray-950">1</p><p className="text-[11px] text-gray-500">{isDa ? 'format' : 'format'}</p></div>
                  <div><p className="text-lg font-black text-gray-950">8+</p><p className="text-[11px] text-gray-500">{isDa ? 'fokus' : 'focuses'}</p></div>
                  <div><p className="text-lg font-black text-gray-950">4</p><p className="text-[11px] text-gray-500">{isDa ? 'brancher' : 'fields'}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING / SESSIONS */}
      <section id="pricing" className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{isDa ? 'Format og pris' : 'Format and pricing'}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-950 max-w-3xl">
                {isDa ? 'Én 60-minutters session. Fokus vælges af kandidaten.' : 'One 60-minute session. The candidate chooses the focus.'}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-sm text-sm md:text-base">
              {isDa
                ? 'Det gør oplevelsen renere: vælg den rigtige professionelle, vælg et tidspunkt, og fortæl hvad du vil bruge sessionen på.'
                : 'This keeps the experience cleaner: choose the right professional, pick a time and explain what you want to use the session for.'}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="premium-card tone-card tone-ink border rounded-2xl p-8 text-white flex flex-col min-h-[430px]">
              <p className="text-xs font-semibold uppercase text-cyan-200 mb-5">{isDa ? 'Standardformat' : 'Standard format'}</p>
              <h3 className="text-3xl font-black leading-tight mb-4">1:1 Career Session</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                {isDa
                  ? '60 minutter med en professionel fra AI, Banking, Management Consulting eller Private Equity.'
                  : '60 minutes with a professional from AI, Banking, Management Consulting or Private Equity.'}
              </p>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-5 mb-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-1">{isDa ? 'Prisramme' : 'Price range'}</p>
                    <p className="text-3xl font-black text-white">DKK 500-1.800</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-300">60 min</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mt-auto">
                {isDa
                  ? 'Prisen sættes af den professionelle og vises altid tydeligt før booking.'
                  : 'The price is set by the professional and is always shown clearly before booking.'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {focusOptions.map((card) => (
                <div key={card.title} className={`premium-card tone-card ${card.tone} border rounded-2xl p-5 min-h-[185px] flex flex-col`}>
                  <h3 className="font-bold text-gray-950 mb-3">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              {isDa
                ? 'Alle professionals tilbyder samme 60-minutters format. Forskellen ligger i erfaring, branche, fokus og pris.'
                : 'All professionals offer the same 60-minute format. The difference is experience, field, focus and price.'}
            </p>
            <Link href="/professionals" className="inline-flex items-center justify-center px-6 py-3 bg-gray-950 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-sm w-fit">
              {tr('cta.button')}
            </Link>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL PREVIEW — Change 7: Added Available badge + taglines, bg-gray-900 initials */}
      <section className="py-24 md:py-32 bg-gray-950 border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase text-cyan-200 mb-4">{isDa ? 'Hvem du kan møde' : 'Who you can meet'}</p>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                {isDa ? 'Produktet er ikke en artikel. Det er adgang til et menneske.' : 'The product is not an article. It is access to a person.'}
              </h2>
              {/* Change 4: removed internal product language paragraph */}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {professionalCards.map((card) => (
                <div key={card.role} className={`premium-card tone-card ${card.tone} rounded-2xl border p-6 min-h-[270px] flex flex-col`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Change 7: bg-gray-900 initials circle */}
                    <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">
                      {card.field.slice(0, 2).toUpperCase()}
                    </div>
                    {/* Change 7: Available badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      <span className="text-xs font-semibold text-indigo-600">Available</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-950 mb-1">{card.role}</h3>
                  {/* Change 7: tagline */}
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{card.tagline}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{card.focus}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-gray-950/10 pt-5">
                    <p className="text-xs font-semibold uppercase text-gray-500">{isDa ? 'Prisramme' : 'Price range'}</p>
                    <p className="text-sm font-black text-gray-950">{card.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{tr('industries.headline')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-6 max-w-3xl">
            {isDa ? 'Fire brancher, hvor forberedelse og adgang gør en reel forskel.' : 'Four fields where preparation and access make a real difference.'}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mb-12">
            {isDa ? 'Naetwork er ikke bygget til alt. Det er bevidst smallere, skarpere og mere relevant for de karriereveje, hvor processen ofte er svær at afkode udefra.' : 'Naetwork is not built for everything. It is deliberately narrower, sharper and more relevant for career paths that are hard to decode from the outside.'}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industryCards.map((card) => (
              <div key={card.title} className={`premium-card tone-card ${card.tone} border rounded-2xl p-6 min-h-[300px] flex flex-col`}>
                <div className="w-9 h-9 rounded-full bg-gray-950 text-white flex items-center justify-center mb-8">{card.icon}</div>
                <h3 className="font-semibold text-gray-950 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NAETWORK */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-[1.05fr_1fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 mb-6">{tr('why.label')}</p>
              <h2 className="text-3xl md:text-5xl font-black text-gray-950 leading-tight max-w-2xl">
                {isDa ? 'Forbered dig med folk, der kender vurderingen indefra.' : 'Prepare with people who know the assessment from inside.'}
              </h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">{tr('why.body')}</p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-4">
            {proofCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-sm font-bold text-gray-950 mb-3">{card.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Change 8: SIGNATURE FLOW section removed entirely */}

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{tr('how.label')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-16">{tr('how.tagline')}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howSteps.map((step) => (
              <div key={step.num} className="premium-card border border-gray-200 rounded-2xl p-6 bg-white">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-white text-sm font-bold mb-6">{step.num}</span>
                <h3 className="text-xl font-bold text-gray-950 mb-3">{tr(step.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{tr(step.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL-VALUE SPLIT */}
      <section id="about" className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{tr('about.label')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12 max-w-3xl">{tr('about.h2')}</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div id="candidates" className="premium-card tone-card tone-ink text-white rounded-2xl p-8 md:p-10 flex flex-col min-h-[440px] border overflow-hidden">
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-cyan-200 mb-6">{tr('candidates.label')}</p>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6 max-w-md">{tr('candidates.h2')}</h3>
                  <ul className="space-y-4 mb-8">
                    {[tr('why.candidate.bullet1'), tr('why.candidate.bullet2'), tr('why.candidate.bullet3')].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-200 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-xs text-xs leading-relaxed text-gray-400">
                    {isDa ? 'Konkret sparring fra mennesker, der kender processen indefra.' : 'Concrete guidance from people who know the process from inside.'}
                  </p>
                  <Link href="/professionals" className="inline-flex items-center justify-center text-gray-950 text-sm font-semibold bg-white rounded-xl px-6 py-3 hover:bg-gray-100 transition-colors w-fit">
                    {tr('candidates.cta')}
                  </Link>
                </div>
              </div>
            </div>

            <div id="professionals" className="premium-card tone-card tone-mint text-gray-950 rounded-2xl p-8 md:p-10 flex flex-col min-h-[440px] border overflow-hidden">
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-800 mb-6">{tr('professionals.label')}</p>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6 max-w-md">{tr('professionals.h2')}</h3>
                  <ul className="space-y-4 mb-8">
                    {[tr('why.professional.bullet1'), tr('why.professional.bullet2'), tr('why.professional.bullet3')].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <p className="max-w-xs text-xs leading-relaxed text-gray-600">
                    {isDa ? 'Sæt din erfaring i spil på en enkel, troværdig måde.' : 'Put your experience to work in a simple, credible way.'}
                  </p>
                  <Link href="/professional/signup" className="inline-flex items-center justify-center text-white text-sm font-semibold bg-gray-950 rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors w-fit">
                    {tr('professionals.cta')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT MODEL */}
      <section id="impact" className="bg-gray-950 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="inline-block text-cyan-200 text-xs font-semibold uppercase mb-4">{tr('impact.label')}</span>
            <p className="text-white text-xl leading-relaxed max-w-2xl">{tr('impact.intro')}</p>
            <p className="text-gray-400 mt-3 text-lg leading-relaxed max-w-2xl">{tr('impact.sub')}</p>
            <p className="text-gray-400 mt-4 text-base leading-relaxed max-w-2xl border-l-2 border-cyan-300 pl-4">{tr('impact.both')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div className="premium-card tone-card tone-ink border rounded-2xl p-6 flex flex-col text-white">
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-xl">{tr('impact.shared_name')}</span>
                <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">20% fee</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{tr('impact.shared_tag')}</p>
              <div className="bg-white/10 rounded-xl p-5 mb-6 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center"><div className="text-3xl font-bold text-white">50%</div><div className="text-xs text-gray-500 mt-1">Donation</div></div>
                  <div className="text-gray-600 text-lg">+</div>
                  <div className="flex-1 text-center"><div className="text-3xl font-bold text-cyan-200">50%</div><div className="text-xs text-gray-500 mt-1">{tr('impact.shared_keep')}</div></div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{tr('impact.shared_body')}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-auto">{tr('impact.shared_note')}</p>
              <div className="mt-4 pt-4 border-t border-white/10"><span className="text-xs text-gray-600">{tr('impact.shared_fee')}</span></div>
            </div>

            <div className="premium-card tone-card tone-cyan border rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <span className="text-gray-950 font-bold text-xl">{tr('impact.allin_name')}</span>
                <span className="bg-gray-950 text-white text-xs px-3 py-1 rounded-full">10% fee</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{tr('impact.allin_tag')}</p>
              <div className="bg-white/70 rounded-xl p-5 mb-6 border border-white/80">
                <div className="text-center"><div className="text-3xl font-bold text-gray-950">100%</div><div className="text-xs text-gray-500 mt-1">Donation</div></div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{tr('impact.allin_body')}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-auto">{tr('impact.allin_note')}</p>
              <div className="mt-4 pt-4 border-t border-gray-200"><span className="text-xs text-gray-500">{tr('impact.allin_fee')}</span></div>
            </div>
          </div>

          {/* Change 10: hardcoded Danish legal disclaimer */}
          <p className="text-xs text-gray-700 text-center">Naetwork er et uafhængigt initiativ og er ikke officielt tilknyttet Kræftens Bekæmpelse.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{tr('faq.label')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">{tr('faq.h2')}</h2>
          <div className="divide-y divide-gray-200 bg-white border border-gray-200 rounded-2xl px-6">
            {faqItems.map(item => (
              <div key={item.q} className="py-6">
                <p className="font-semibold text-gray-950 mb-2">{tr(item.q)}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.q === 'faq.q3'
                    ? (isDa
                      ? 'Alle sessioner er 60 minutter. Den professionelle sætter selv prisen mellem DKK 500 og 1.800, og prisen vises altid før booking.'
                      : 'All sessions are 60 minutes. The professional sets the price between DKK 500 and 1,800, and the price is always shown before booking.')
                    : tr(item.a)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-lg mx-auto px-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{tr('contact.label')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">{tr('contact.h2')}</h2>
          <form action="mailto:kontakt@naetwork.dk" method="POST" encType="text/plain" className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{tr('contact.name')}</label><input type="text" name="name" className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-950" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{tr('contact.email')}</label><input type="email" name="email" className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-950" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{tr('contact.subject')}</label><input type="text" name="subject" className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-950" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{tr('contact.message')}</label><textarea name="message" rows={5} className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-950 resize-none" /></div>
            <p className="text-xs text-gray-400">{tr('contact.privacy')}</p>
            <button type="submit" className="w-full bg-gray-950 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors">{tr('contact.submit')}</button>
          </form>
        </div>
      </section>

      {/* FINAL CTA — Changes 5 & 6 */}
      <section className="py-32 text-center bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <p className="mx-auto mb-8 h-px max-w-2xl bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" aria-hidden="true" />
          {/* Change 5: updated headline */}
          <h2 className="text-4xl md:text-6xl font-black text-white leading-none mb-4">
            {isDa ? 'Book 60 minutter. Kom tættere på jobbet.' : 'Book 60 minutes. Get closer to the job.'}
          </h2>
          {/* Change 6: updated sub */}
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            {isDa ? 'Konkret vejledning fra folk, der allerede forstår processen, kulturen og kravene.' : 'Concrete guidance from people who already understand the process, the culture and the bar.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/professionals" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-base">{tr('cta.button')}</Link>
            <Link href="/professional/signup" className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border border-white/30 hover:bg-white/10 transition-colors text-base">{tr('professionals.cta')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
