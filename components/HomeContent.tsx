'use client';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export function HomeContent() {
  const { tr, lang } = useTranslation();
  const isDa = lang === 'da';

  const heroSignals = [
    {
      title: '1:1 sparring',
      body: isDa ? 'CV, interviews, cases og karrierevalg' : 'CVs, interviews, cases and career decisions',
      surface: 'surface-sky',
    },
    {
      title: isDa ? 'Fra DKK 300' : 'From DKK 300',
      body: isDa ? 'Book direkte hos den professionelle' : 'Book directly with the professional',
      surface: 'surface-green',
    },
    {
      title: isDa ? 'Fire fokusområder' : 'Four focus areas',
      body: 'AI, Banking, Management Consulting & Private Equity',
      surface: 'surface-blue',
    },
  ];

  const sessionCards = [
    {
      title: 'Mock Interview',
      body: isDa
        ? 'Træn interviewet med en, der ved hvordan vurderingen foregår.'
        : 'Practice the interview with someone who knows how candidates are assessed.',
      surface: 'surface-sky',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: 'CV & LinkedIn Review',
      body: isDa
        ? 'Gør dit materiale skarpere, mere relevant og nemmere at vælge til.'
        : 'Make your material sharper, more relevant and easier to shortlist.',
      surface: 'surface-green',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
    },
    {
      title: 'Case Prep',
      body: isDa
        ? 'Øv struktur, hypoteser og kommunikation før de svære cases.'
        : 'Practice structure, hypotheses and communication before demanding cases.',
      surface: 'surface-blue',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      title: 'Career Strategy',
      body: isDa
        ? 'Få klarhed over næste skridt, branchevalg og den rigtige indgang.'
        : 'Get clarity on next steps, target industries and the right way in.',
      surface: 'surface-olive',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  const industryCards = [
    {
      title: 'AI',
      body: isDa
        ? 'Fra AI product og strategy til machine learning og implementation. Feltet bevæger sig hurtigt; få sparring fra folk tæt på udviklingen.'
        : 'From AI product and strategy to machine learning and implementation. The field moves fast; get guidance from people close to the work.',
      surface: 'surface-blue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
        </svg>
      ),
    },
    {
      title: 'Banking',
      body: isDa
        ? 'M&A, ECM, DCM og Corporate Finance. Forstå processerne, tempoet og hvad der faktisk adskiller de stærke kandidater.'
        : 'M&A, ECM, DCM and Corporate Finance. Understand the processes, pace and what actually separates strong candidates.',
      surface: 'surface-green',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m-4 4h8M4 21h16M6 17V9m4 8V9m4 8V9m4 8V9" />
        </svg>
      ),
    },
    {
      title: 'Management Consulting',
      body: isDa
        ? 'Case-interviews, problemløsning, klientarbejde og kultur. Gå fra abstrakt forberedelse til træning, der ligner virkeligheden.'
        : 'Case interviews, problem solving, client work and culture. Move from abstract preparation to practice that feels close to the real thing.',
      surface: 'surface-sky',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      title: 'Private Equity',
      body: isDa
        ? 'Deal sourcing, due diligence, investment cases og portfolio work. Et lukket miljø bliver lettere at forstå, når du taler med folk indefra.'
        : 'Deal sourcing, due diligence, investment cases and portfolio work. A closed world becomes easier to understand when you speak with insiders.',
      surface: 'surface-olive',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
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
        @keyframes bounce-y {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(7px); }
        }
        .animate-bounce-y { animation: bounce-y 1.5s ease-in-out infinite; }
        .surface-field {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background-size: 155% 155%;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22), inset 0 -36px 72px rgba(0,0,0,0.12);
        }
        .surface-field::before {
          content: '';
          position: absolute;
          inset: -18%;
          z-index: -1;
          background: linear-gradient(115deg, rgba(255,255,255,0.38), transparent 34%, rgba(255,255,255,0.16) 58%, transparent 76%);
          transform: rotate(-7deg);
        }
        .surface-field::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.18), transparent 46%, rgba(0,0,0,0.12));
          mix-blend-mode: soft-light;
        }
        .surface-sky { background-image: linear-gradient(135deg, #bff7ff 0%, #1bd8d1 34%, #0aa979 70%, #063f2d 100%); }
        .surface-green { background-image: linear-gradient(135deg, #dcfce7 0%, #47e6c5 31%, #13a453 66%, #0b5a2d 100%); }
        .surface-blue { background-image: linear-gradient(135deg, #e7f4ff 0%, #73dcff 28%, #088deb 63%, #0a35a8 100%); }
        .surface-olive { background-image: linear-gradient(135deg, #eff6d8 0%, #9fd567 34%, #2b8b44 66%, #25351f 100%); }
        .premium-card {
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }
        .premium-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
          border-color: rgba(15, 23, 42, 0.14);
        }
        .value-card-glow {
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.14);
        }
      `}</style>

      {/* HERO */}
      <section id="home" className="min-h-screen flex flex-col justify-center bg-white px-6 pt-24 pb-0" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fbfbfb 62%, #ffffff 100%)' }}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-gray-700 mb-10 border border-gray-200 bg-white px-3 py-1.5 rounded-full shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {tr('hero.label')}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-none text-gray-950 mb-6 animate-fade-up delay-1 max-w-4xl">
            {tr('hero.h1')}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mb-10 animate-fade-up delay-2">
            {tr('hero.sub')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-3">
            <Link
              href="/professionals"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-950 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-base shadow-[0_18px_40px_rgba(0,0,0,0.16)]"
            >
              {tr('hero.cta_primary')}
            </Link>
            <Link
              href="/professional/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl border border-gray-300 hover:border-gray-950 hover:bg-gray-50 transition-colors text-base"
            >
              {tr('hero.cta_secondary')}
            </Link>
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3 animate-fade-up delay-4">
            {heroSignals.map((item) => (
              <div key={item.title} className="premium-card border border-gray-200 bg-white rounded-2xl p-4 shadow-sm">
                <div className={`surface-field ${item.surface} h-2 rounded-full mb-4`} aria-hidden="true" />
                <p className="text-sm font-bold text-gray-950">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full mt-20 pb-10 animate-fade-up delay-4">
          <div className="flex flex-col items-start gap-2">
            <span className="text-xs text-gray-400 uppercase">Scroll</span>
            <svg className="animate-bounce-y text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* WHY NAETWORK */}
      <section className="py-24 md:py-32 bg-gray-950">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase text-gray-400 mb-6">{tr('why.label')}</p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">{tr('why.body')}</p>
        </div>
      </section>

      {/* DUAL-VALUE SPLIT */}
      <section id="about" className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{tr('about.label')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12 max-w-3xl">{tr('about.h2')}</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div id="candidates" className="premium-card value-card-glow bg-gray-950 text-white rounded-2xl p-5 md:p-6 flex flex-col min-h-[480px] border border-gray-900 overflow-hidden">
              <div className="surface-field surface-sky h-44 rounded-xl mb-8" aria-hidden="true" />
              <div className="px-2 pb-2 flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-cyan-200 mb-5">{tr('candidates.label')}</p>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6">{tr('candidates.h2')}</h3>
                  <ul className="space-y-3 mb-8">
                    {[tr('why.candidate.bullet1'), tr('why.candidate.bullet2'), tr('why.candidate.bullet3')].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/professionals" className="inline-flex items-center justify-center text-gray-950 text-sm font-semibold bg-white rounded-xl px-6 py-3 hover:bg-gray-100 transition-colors w-fit">
                  {tr('candidates.cta')}
                </Link>
              </div>
            </div>

            <div id="professionals" className="premium-card bg-white text-gray-950 rounded-2xl p-5 md:p-6 flex flex-col min-h-[480px] border border-gray-200 overflow-hidden">
              <div className="surface-field surface-green h-44 rounded-xl mb-8" aria-hidden="true" />
              <div className="px-2 pb-2 flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-emerald-700 mb-5">{tr('professionals.label')}</p>
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6">{tr('professionals.h2')}</h3>
                  <ul className="space-y-3 mb-8">
                    {[tr('why.professional.bullet1'), tr('why.professional.bullet2'), tr('why.professional.bullet3')].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/professional/signup" className="inline-flex items-center justify-center text-white text-sm font-semibold bg-gray-950 rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors w-fit">
                  {tr('professionals.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSION TYPES */}
      <section className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{tr('sessions.headline')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-3">{tr('sessions.sub')}</h2>
          <p className="text-gray-600 leading-relaxed mb-12 max-w-xl">
            {isDa ? 'Fra CV-review til case-prep: vælg en session med konkret output, ikke generiske råd.' : 'From CV reviews to case prep: choose a session with concrete output, not generic advice.'}
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {sessionCards.map((card) => (
              <div key={card.title} className="premium-card bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col min-h-[310px]">
                <div className={`surface-field ${card.surface} h-24 rounded-xl mb-5`} aria-hidden="true" />
                <div className="w-10 h-10 rounded-full bg-gray-950 text-white flex items-center justify-center mb-5">{card.icon}</div>
                <h3 className="font-bold text-gray-950 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
                <p className="text-xs font-semibold text-gray-950 mt-auto pt-6">DKK 300-2.000</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* IMPACT / PRICING */}
      <section id="pricing" className="bg-gray-950 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="inline-block text-cyan-200 text-xs font-semibold uppercase mb-4">{tr('impact.label')}</span>
            <p className="text-white text-xl leading-relaxed max-w-2xl">{tr('impact.intro')}</p>
            <p className="text-gray-400 mt-3 text-lg leading-relaxed max-w-2xl">{tr('impact.sub')}</p>
            <p className="text-gray-400 mt-4 text-base leading-relaxed max-w-2xl border-l-2 border-cyan-300 pl-4">{tr('impact.both')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div className="premium-card bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
              <div className="surface-field surface-olive h-24 rounded-xl mb-6" aria-hidden="true" />
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-bold text-xl">{tr('impact.shared_name')}</span>
                <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">20% fee</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{tr('impact.shared_tag')}</p>
              <div className="bg-gray-800 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center"><div className="text-3xl font-bold text-white">50%</div><div className="text-xs text-gray-500 mt-1">Donation</div></div>
                  <div className="text-gray-600 text-lg">+</div>
                  <div className="flex-1 text-center"><div className="text-3xl font-bold text-cyan-200">50%</div><div className="text-xs text-gray-500 mt-1">{tr('impact.shared_keep')}</div></div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{tr('impact.shared_body')}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-auto">{tr('impact.shared_note')}</p>
              <div className="mt-4 pt-4 border-t border-gray-800"><span className="text-xs text-gray-600">{tr('impact.shared_fee')}</span></div>
            </div>

            <div className="premium-card bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
              <div className="surface-field surface-sky h-24 rounded-xl mb-6" aria-hidden="true" />
              <div className="flex items-center justify-between mb-5">
                <span className="text-gray-950 font-bold text-xl">{tr('impact.allin_name')}</span>
                <span className="bg-gray-950 text-white text-xs px-3 py-1 rounded-full">10% fee</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{tr('impact.allin_tag')}</p>
              <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                <div className="text-center"><div className="text-3xl font-bold text-gray-950">100%</div><div className="text-xs text-gray-500 mt-1">Donation</div></div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{tr('impact.allin_body')}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-auto">{tr('impact.allin_note')}</p>
              <div className="mt-4 pt-4 border-t border-gray-100"><span className="text-xs text-gray-500">{tr('impact.allin_fee')}</span></div>
            </div>
          </div>

          <p className="text-xs text-gray-700 text-center">{tr('impact.kb_legal')}</p>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase text-gray-500 mb-4">{tr('industries.headline')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-6 max-w-3xl">
            {isDa ? 'AI, Banking, Management Consulting og Private Equity er svære at afkode udefra.' : 'AI, Banking, Management Consulting and Private Equity are hard to decode from the outside.'}
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mb-12">
            {isDa ? 'Bag enhver ansøgning ligger spørgsmål, ingen LinkedIn-post besvarer. Naetwork samler professionelle fra de brancher, hvor adgang til ærlig vejledning ofte afhænger af, hvem du tilfældigvis kender.' : 'Behind every application are questions no LinkedIn post can answer. Naetwork brings together professionals from industries where honest guidance often depends on who you happen to know.'}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {industryCards.map((card) => (
              <div key={card.title} className="premium-card bg-white border border-gray-200 rounded-2xl p-4 shadow-sm min-h-[300px] flex flex-col">
                <div className={`surface-field ${card.surface} h-28 rounded-xl mb-5`} aria-hidden="true" />
                <div className="w-9 h-9 rounded-full bg-gray-950 text-white flex items-center justify-center mb-4">{card.icon}</div>
                <h3 className="font-semibold text-gray-950 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
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
                <p className="text-gray-600 text-sm leading-relaxed">{tr(item.a)}</p>
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

      {/* FINAL CTA */}
      <section className="py-32 text-center bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="surface-field surface-blue h-24 rounded-2xl mb-12 max-w-3xl mx-auto" aria-hidden="true" />
          <h2 className="text-4xl md:text-6xl font-black text-white leading-none mb-4">{tr('cta.headline')}</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">{tr('cta.sub')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/professionals" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-base">{tr('cta.button')}</Link>
            <Link href="/professional/signup" className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border border-white/30 hover:bg-white/10 transition-colors text-base">{tr('professionals.cta')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
