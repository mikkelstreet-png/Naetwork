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

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center bg-white px-6 pt-24 pb-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(22,101,52,0.06) 0%, transparent 70%)' }}>
        <div className="max-w-6xl mx-auto w-full">

          <div className="animate-fade-up">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-green-700 mb-10 border border-green-200 bg-green-50 px-3 py-1.5 rounded-full">
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
              href="/find-professionel"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-950 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-base"
            >
              {tr('hero.cta_primary')}
            </Link>
            <Link
              href="/bliv-professionel"
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

      {/* ─── DUAL-VALUE SPLIT ─────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-700 mb-4">
            {tr('about.label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">
            {tr('about.h2')}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Kandidater – dark */}
            <div className="bg-gray-950 text-white rounded-3xl p-10 md:p-14 flex flex-col justify-between min-h-[400px]">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-green-400 mb-6">
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
                      <span className="text-green-400 font-bold mt-0.5 shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/find-professionel"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold border border-white/25 rounded-xl px-6 py-3 hover:bg-white/10 transition-colors w-fit"
              >
                {tr('candidates.cta')}
              </Link>
            </div>

            {/* Professionelle – green */}
            <div className="bg-green-800 text-white rounded-3xl p-10 md:p-14 flex flex-col justify-between min-h-[400px]">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-green-200 mb-6">
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
                    <li key={item} className="flex items-start gap-3 text-green-100 text-sm leading-relaxed">
                      <span className="text-green-300 font-bold mt-0.5 shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/bliv-professionel"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold border border-white/25 rounded-xl px-6 py-3 hover:bg-white/10 transition-colors w-fit"
              >
                {tr('professionals.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SESSIONSTYPER ────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-gray-50 border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
            {tr('sessions.headline')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-3">
            {tr('sessions.sub')}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-12 max-w-xl">
            DKK 300–2.000 pr. session — prissat af den professionelle.
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
                  Øv dig med en der har siddet på begge sider af bordet
                </p>
              </div>
              <p className="text-xs font-semibold text-green-700 mt-auto">DKK 300–2.000</p>
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
                  Få konkret, ærlig feedback på dit materiale
                </p>
              </div>
              <p className="text-xs font-semibold text-green-700 mt-auto">DKK 300–2.000</p>
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
                  En åben samtale om karriere, muligheder og næste skridt
                </p>
              </div>
              <p className="text-xs font-semibold text-green-700 mt-auto">DKK 300–2.000</p>
            </div>

            {/* Karriererådgivning */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">Karriererådgivning</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Strategisk sparring fra nogen der har prøvet det
                </p>
              </div>
              <p className="text-xs font-semibold text-green-700 mt-auto">DKK 300–2.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SÅDAN FUNGERER DET ───────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
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
                <span className="text-5xl font-black text-green-700 leading-none">{step.num}</span>
                <h3 className="text-xl font-bold text-gray-950">{tr(step.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{tr(step.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRANSPARENS ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-gray-50 border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
            {tr('trust.headline')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">
            {tr('trust.sub')}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <p className="text-4xl font-black text-gray-950 mb-1">300–2.000</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">DKK pr. session</p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Prisen sættes af den professionelle. Du ser den altid inden du booker.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <p className="text-4xl font-black text-gray-950 mb-1">15%</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Provision til Naetwork</p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Resten går direkte til den professionelle. Vi tager intet skjult.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <p className="text-4xl font-black text-gray-950 mb-1">60 min</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Pr. session</p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Fokuseret, konkret, no-nonsense. Ingen small talk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KRÆFTENS BEKÆMPELSE ──────────────────────────────── */}

      {/* ─── INDUSTRIER ────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
            {tr('industries.headline')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-6">
            Karrierevejen i Banking, Private Equity, AI og Management Consulting er sjældent gennemsigtig.
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mb-12">
            Bag enhver ansøgning gemmer der sig spørgsmål, ingen LinkedIn-post besvarer. Naetworks grundlæggere har selv arbejdet i — eller kender stærke netværk inden for — Banking, Private Equity, AI og Management Consulting. Vi ved, at adgang til ærlig vejledning ikke burde afhænge af hvem du tilfældigvis kender.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
              <svg className="w-6 h-6 text-green-700 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m-4 4h8M4 21h16M6 17V9m4 8V9m4 8V9m4 8V9" />
              </svg>
              <h3 className="font-semibold text-gray-950 mb-2">Banking</h3>
              <p className="text-sm text-gray-500">M&A, ECM, DCM, Corporate Finance. Vi kender presset, recruitmentprocesserne og hvad der faktisk adskiller de stærke kandidater.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
              <svg className="w-6 h-6 text-green-700 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <h3 className="font-semibold text-gray-950 mb-2">Private Equity</h3>
              <p className="text-sm text-gray-500">Deal sourcing, due diligence, portfolio management. Et lukket miljø — vi åbner døren.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
              <svg className="w-6 h-6 text-green-700 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
              </svg>
              <h3 className="font-semibold text-gray-950 mb-2">AI</h3>
              <p className="text-sm text-gray-500">Fra ML engineer til AI strategy. Feltet bevæger sig hurtigt — vi hjælper dig med at navigere det.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition">
              <svg className="w-6 h-6 text-green-700 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="font-semibold text-gray-950 mb-2">Management Consulting</h3>
              <p className="text-sm text-gray-500">McKinsey, BCG, Bain og de nordiske boutiques. Case-prep, karriereveje og kulturen bag facaden.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl p-8 md:p-16" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)' }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
              {tr('charity.headline')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">
              Vi donerer til dem der kæmper.
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mb-8 text-base">
              Professionelle der vælger at donere 7,5% af deres honorar til Kræftens Bekæmpelse, betaler kun 7,5% i provision til Naetwork. En lille beslutning med stor effekt.
            </p>
            <p className="text-sm font-semibold text-pink-700 tracking-wide">
              Officiel partner: Kræftens Bekæmpelse
            </p>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
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
              href="/find-professionel"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-base"
            >
              {tr('cta.button')}
            </Link>
            <Link
              href="/bliv-professionel"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-green-400 font-semibold rounded-xl border-2 border-green-700 hover:bg-green-950 transition-colors text-base"
            >
              {tr('professionals.cta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
