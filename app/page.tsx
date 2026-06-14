'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const ProjectIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const HandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5V6.75a1.75 1.75 0 013.5 0v2.5m0 0V5.25a1.75 1.75 0 013.5 0V14m0-8.25a1.75 1.75 0 013.5 0V14a6 6 0 01-6 6h-2.343A3.375 3.375 0 015.5 17.128V14.25c0-.966.784-1.75 1.75-1.75H7" />
  </svg>
);

const ConnectIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);

const SpeedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-green-800 shrink-0 mt-0.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const FreeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

export default function HomePage() {
  const { tr } = useTranslation();

  return (
    <div className="bg-white text-gray-900">
      <Navbar />

      {/* 1. HERO */}
      <section className="min-h-screen flex flex-col justify-center py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
              {tr('hero.label')}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
              {tr('hero.h1')}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed mb-10 max-w-xl">
              {tr('hero.sub')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/projekt/opret"
                className="bg-green-800 text-white hover:bg-green-900 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                {tr('hero.cta1')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/signup?role=specialist"
                className="border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                {tr('hero.cta2')}
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FreeIcon />
                <span>{tr('hero.trust1')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span>{tr('hero.trust2')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <GlobeIcon />
                <span>{tr('hero.trust3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OM NAETWORK */}
      <section id="om" className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            {tr('about.label')}
          </p>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                {tr('about.h2')}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                {tr('about.body')}
              </p>
            </div>
            <div className="space-y-6">
              {[
                { n: '1', key: 'about.fact1' },
                { n: '2', key: 'about.fact2' },
                { n: '3', key: 'about.fact3' },
              ].map(({ n, key }) => (
                <div key={n} className="flex items-start gap-4">
                  <span className="text-xs font-semibold text-gray-400 w-6 shrink-0 mt-0.5">{n}.</span>
                  <p className="text-base text-gray-700 font-medium">{tr(key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SÅDAN FUNGERER DET */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            {tr('how.label')}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-16">
            {tr('how.h2')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <ProjectIcon />, step: '01', titleKey: 'how.step1.title', descKey: 'how.step1.desc' },
              { icon: <HandIcon />, step: '02', titleKey: 'how.step2.title', descKey: 'how.step2.desc' },
              { icon: <ConnectIcon />, step: '03', titleKey: 'how.step3.title', descKey: 'how.step3.desc' },
            ].map(({ icon, step, titleKey, descKey }) => (
              <div key={step} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
                    {icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-300 tracking-widest">{step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{tr(titleKey)}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{tr(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOR VIRKSOMHEDER */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Virksomheder</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
                {tr('biz.h2')}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-8">
                {tr('biz.sub')}
              </p>
              <Link
                href="/projekt/opret"
                className="bg-green-800 text-white hover:bg-green-900 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                {tr('biz.cta')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { icon: <SpeedIcon />, key: 'biz.b1' },
                { icon: <ShieldIcon />, key: 'biz.b2' },
                { icon: <ChartIcon />, key: 'biz.b3' },
              ].map(({ icon, key }) => (
                <div key={key} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 shrink-0">
                    {icon}
                  </div>
                  <p className="text-base text-gray-700 font-medium pt-1">{tr(key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOR SPECIALISTER */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-4 order-2 md:order-1">
              {[
                { icon: <UserIcon />, key: 'spec.b1' },
                { icon: <BriefcaseIcon />, key: 'spec.b2' },
                { icon: <SpeedIcon />, key: 'spec.b3' },
              ].map(({ icon, key }) => (
                <div key={key} className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-600 shrink-0 border border-gray-100">
                    {icon}
                  </div>
                  <p className="text-base text-gray-700 font-medium pt-1">{tr(key)}</p>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Specialister</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
                {tr('spec.h2')}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-8">
                {tr('spec.sub')}
              </p>
              <Link
                href="/signup?role=specialist"
                className="bg-green-800 text-white hover:bg-green-900 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                {tr('spec.cta')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST SECTION */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 mb-6">
              <GlobeIcon />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
              {tr('trust.h2')}
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              {tr('trust.body')}
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA FOOTER SECTION */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
            {tr('cta.h2')}
          </h2>
          <p className="text-base text-gray-500 mb-10">{tr('cta.sub')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/projekt/opret"
              className="bg-green-800 text-white hover:bg-green-900 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              {tr('cta.cta1')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/signup?role=specialist"
              className="border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              {tr('cta.cta2')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
