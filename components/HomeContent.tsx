'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';


export function HomeContent() {
  const { tr } = useLanguage();
  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.65s cubic-bezier(.22,1,.36,1) both;
        }
        .delay-1 { animation-delay: 0.10s; }
        .delay-2 { animation-delay: 0.20s; }
        .delay-3 { animation-delay: 0.32s; }
        .delay-4 { animation-delay: 0.46s; }
        @keyframes bounce-y {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(7px); }
        }
        .animate-bounce-y { animation: bounce-y 1.5s ease-in-out infinite; }
      `}</style>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ HERO Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      <section id="home" className="min-h-screen flex flex-col justify-center bg-white px-6 pt-24 pb-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,70,229,0.06) 0%, transparent 70%)' }}>
        <div className="max-w-6xl mx-auto w-full">

          <div className="animate-fade-up">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-10 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-full">
              {tr('hero.label')}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-gray-950 mb-6 animate-fade-up delay-1">
            {tr('hero.h1')}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mb-10 animate-fade-up delay-2">
            {tr('hero.sub')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-3">
            <Link
              href="/professionals"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-950 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-base"
            >
              {tr('hero.cta_primary')}
            </Link>
            <Link
              href="/professional/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl border-2 border-gray-950 hover:bg-gray-50 transition-colors text-base"
            >
              {tr('hero.cta_secondary')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="max-w-6xl mx-auto w-full mt-20 pb-10 animate-fade-up delay-4">
          <div className="flex flex-col items-start gap-2">
            <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
            <svg
              className="animate-bounce-y text-gray-400"
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ DUAL-VALUE SPLIT Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      <section id="about" className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-700 mb-4">
            {tr('about.label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">
            {tr('about.h2')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Kandidater Ã¢ÂÂ dark */}
            <div id="candidates" className="bg-gray-950 text-white rounded-3xl p-10 md:p-14 flex flex-col justify-between min-h-[400px]">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-6">
                  {tr('candidates.label')}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
                  {tr('candidates.h2')}
                </h3>
                <ul className="space-y-3 mb-8">
                  {[
                    tr('why.candidate.bullet1'),
                    tr('why.candidate.bullet2'),
                    tr('why.candidate.bullet3'),
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                      <span className="text-indigo-400 font-bold mt-0.5 shrink-0">Ã¢ÂÂ</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/professionals"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold border border-white/25 rounded-xl px-6 py-3 hover:bg-white/10 transition-colors w-fit"
              >
                {tr('candidates.cta')}
              </Link>
            </div>

            {/* Professionelle Ã¢ÂÂ indigo */}
            <div id="professionals" className="bg-indigo-600 text-white rounded-3xl p-10 md:p-14 flex flex-col justify-between min-h-[400px]">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200 mb-6">
                  {tr('professionals.label')}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
                  {tr('professionals.h2')}
                </h3>
                <ul className="space-y-3 mb-8">
                  {[
                    tr('why.professional.bullet1'),
                    tr('why.professional.bullet2'),
                    tr('why.professional.bullet3'),
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-indigo-100 text-sm leading-relaxed">
                      <span className="text-indigo-300 font-bold mt-0.5 shrink-0">Ã¢ÂÂ</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/professional/signup"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold border border-white/25 rounded-xl px-6 py-3 hover:bg-white/10 transition-colors w-fit"
              >
                {tr('professionals.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ SESSIONSTYPER Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      <section className="py-24 md:py-32 bg-gray-50 border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-4">
            {tr('sessions.headline')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-3">
            {tr('sessions.sub')}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-12 max-w-xl">
            DKK 300Ã¢ÂÂ2.000 pr. session Ã¢ÂÂ prissat af den professionelle.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Mock Interview */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">Mock Interview</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ÃÂv dig med en der har siddet pÃÂ¥ begge sider af bordet
                </p>
              </div>
              <p className="text-xs font-semibold text-indigo-600 mt-auto">DKK 300Ã¢ÂÂ2.000</p>
            </div>

            {/* CV & LinkedIn */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">CV &amp; LinkedIn Review</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  FÃÂ¥ konkret, ÃÂ¦rlig feedback pÃÂ¥ dit materiale
                </p>
              </div>
              <p className="text-xs font-semibold text-indigo-600 mt-auto">DKK 300Ã¢ÂÂ2.000</p>
            </div>

            {/* Uformel 1:1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">Uformel 1:1</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  En ÃÂ¥ben samtale om karriere, muligheder og nÃÂ¦ste skridt
                </p>
              </div>
              <p className="text-xs font-semibold text-indigo-600 mt-auto">DKK 300Ã¢ÂÂ2.000</p>
            </div>

            {/* KarriererÃÂ¥dgivning */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">KarriererÃÂ¥dgivning</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Strategisk sparring fra nogen der har prÃÂ¸vet det
                </p>
              </div>
              <p className="text-xs font-semibold text-indigo-600 mt-auto">DKK 300Ã¢ÂÂ2.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ SÃÂDAN FUNGERER DET Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-4">
            {tr('how.label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-16">
            {tr('how.tagline')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', titleKey: 'how.step1_title', bodyKey: 'how.step1_body' },
              { num: '02', titleKey: 'how.step2_title', bodyKey: 'how.step2_body' },
              { num: '03', titleKey: 'how.step3_title', bodyKey: 'how.step3_body' },
              { num: '04', titleKey: 'how.step4_title', bodyKey: 'how.step4_body' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-4">
                <span className="text-5xl font-black text-indigo-600 leading-none">{step.num}</span>
                <h3 className="text-xl font-bold text-gray-950">{tr(step.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{tr(step.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ TRANSPARENS / PRISER Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}


      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ KRÃÂFDENS BEKÃÂMPELSE Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      {/* Impact / Pricing section */}
      <section id="pricing" className="bg-gray-950 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-block text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">
              {tr('impact.label')}
            </span>
            <p className="text-white text-xl leading-relaxed max-w-2xl">
              {tr('impact.intro')}
            </p>
            <p className="text-gray-400 mt-3 text-lg leading-relaxed max-w-2xl">
              {tr('impact.sub')}
            </p>
            <p className="text-gray-400 mt-4 text-base leading-relaxed max-w-2xl border-l-2 border-indigo-600 pl-4">
              {tr('impact.both')}
            </p>
          </div>

          {/* Two model cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            {/* Shared Impact */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-bold text-xl">{tr('impact.shared_name')}</span>
                <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">20% fee</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{tr('impact.shared_tag')}</p>
              <div className="bg-gray-800 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-white">50%</div>
                    <div className="text-xs text-gray-500 mt-1">Donation</div>
                  </div>
                  <div className="text-gray-600 text-lg">+</div>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-indigo-400">50%</div>
                    <div className="text-xs text-gray-500 mt-1">{tr('impact.shared_keep')}</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{tr('impact.shared_body')}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-auto">{tr('impact.shared_note')}</p>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-xs text-gray-600">{tr('impact.shared_fee')}</span>
              </div>
            </div>

            {/* All-In Impact */}
            <div className="bg-indigo-950 border border-indigo-800 rounded-2xl p-8 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-bold text-xl">{tr('impact.allin_name')}</span>
                <span className="bg-indigo-900 text-indigo-300 text-xs px-3 py-1 rounded-full">10% fee</span>
              </div>
              <p className="text-indigo-300 text-sm leading-relaxed mb-6">{tr('impact.allin_tag')}</p>
              <div className="bg-indigo-900 rounded-xl p-5 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-xs text-indigo-400 mt-1">Donation</div>
                </div>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed mb-4">{tr('impact.allin_body')}</p>
              <p className="text-indigo-400 text-xs leading-relaxed mt-auto">{tr('impact.allin_note')}</p>
              <div className="mt-4 pt-4 border-t border-indigo-800">
                <span className="text-xs text-indigo-600">{tr('impact.allin_fee')}</span>
              </div>
            </div>

          </div>

          {/* Legal notice */}
          <p className="text-xs text-gray-700 text-center">{tr('impact.kb_legal')}</p>
        </div>
      </section>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ INDUSTRIER Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-4">
            {tr('industries.headline')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-6">
            Karrierevejen i Banking, Private Equity, AI og Management Consulting er sjÃÂ¦ldent gennemsigtig.
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mb-12">
            Bag enhver ansÃÂ¸gning gemmer der sig spÃÂ¸rgsmÃÂ¥l, ingen LinkedIn-post besvarer. Naetworks grundlÃÂ¦ggere har selv arbejdet i Ã¢ÂÂ eller kender stÃÂ¦rke netvÃÂ¦rk inden for Ã¢ÂÂ Banking, Private Equity, AI og Management Consulting. Vi ved, at adgang til ÃÂ¦rlig vejledning ikke burde afhÃÂ¦nge af hvem du tilfÃÂ¦ldigvis kender.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
              <svg className="w-6 h-6 text-indigo-600 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m-4 4h8M4 21h16M6 17V9m4 8V9m4 8V9m4 8V9" />
              </svg>
              <h3 className="font-semibold text-gray-950 mb-2">Banking</h3>
              <p className="text-sm text-gray-500">M&A, ECM, DCM, Corporate Finance. Vi kender presset, recruitmentprocesserne og hvad der faktisk adskiller de stÃÂ¦rke kandidater.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
              <svg className="w-6 h-6 text-indigo-600 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <h3 className="font-semibold text-gray-950 mb-2">Private Equity</h3>
              <p className="text-sm text-gray-500">Deal sourcing, due diligence, portfolio management. Et lukket miljÃÂ¸ Ã¢ÂÂ vi ÃÂ¥bner dÃÂ¸ren.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
              <svg className="w-6 h-6 text-indigo-600 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
              </svg>
              <h3 className="font-semibold text-gray-950 mb-2">AI</h3>
              <p className="text-sm text-gray-500">Fra ML engineer til AI strategy. Feltet bevÃÂ¦ger sig hurtigt Ã¢ÂÂ vi hjÃÂ¦mper dig med at navigere det.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
              <svg className="w-6 h-6 text-indigo-600 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="font-semibold text-gray-950 mb-2">Management Consulting</h3>
              <p className="text-sm text-gray-500">McKinsey, BCG, Bain og de nordiske boutiques. Case-prep, karriereveje og kulturen bag facaden.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ FAQ Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      <section id="faq" className="py-24 md:py-32 bg-gray-50 border-t-2 border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-4">
            {tr('faq.label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">
            {tr('faq.h2')}
          </h2>
          <div className="divide-y divide-gray-100">
            {[
              { q: 'faq.q1', a: 'faq.a1' },
              { q: 'faq.q2', a: 'faq.a2' },
              { q: 'faq.q3', a: 'faq.a3' },
              { q: 'faq.q4', a: 'faq.a4' },
              { q: 'faq.q5', a: 'faq.a5' },
              { q: 'faq.q6', a: 'faq.a6' },
            ].map(item => (
              <div key={item.q} className="py-6">
                <p className="font-semibold text-gray-950 mb-2">{tr(item.q)}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{tr(item.a)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ CONTACT Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      <section id="contact" className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-lg mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-4">
            {tr('contact.label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">
            {tr('contact.h2')}
          </h2>
          <form action="mailto:kontakt@naetwork.dk" method="POST" encType="text/plain" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tr('contact.name')}</label>
              <input
                type="text"
                name="name"
                className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tr('contact.email')}</label>
              <input
                type="email"
                name="email"
                className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tr('contact.subject')}</label>
              <input
                type="text"
                name="subject"
                className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tr('contact.message')}</label>
              <textarea
                name="message"
                rows={5}
                className="border border-gray-200 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <p className="text-xs text-gray-400">{tr('contact.privacy')}</p>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {tr('contact.submit')}
            </button>
          </form>
        </div>
      </section>

      {/* Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ FINAL CTA Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ */}
      <section className="py-32 text-center bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-4">
            {tr('cta.headline')}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            {tr('cta.sub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/professionals"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-base"
            >
              {tr('cta.button')}
            </Link>
            <Link
              href="/professional/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-indigo-400 font-semibold rounded-xl border-2 border-indigo-600 hover:bg-indigo-950 transition-colors text-base"
            >
              {tr('professionals.cta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
