'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export default function Home() {
  const { tr } = useTranslation();

  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-gray-900 inline-block"></span>
          <span className="text-sm text-gray-600">{tr('hero.badge')}</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[#0A0A0A] leading-[1.05] max-w-3xl mb-6">
          {tr('hero.h1')}
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
          {tr('hero.sub')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
          >
            {tr('hero.cta1')}
          </Link>
          <Link
            href="/specialist/profil"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-[#0A0A0A] hover:border-gray-900 transition-colors"
          >
            {tr('hero.cta2')}
          </Link>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['value.free', 'value.nonprofit', 'value.danish', 'value.open'] as const).map((key) => (
            <div key={key} className="text-sm text-gray-700 leading-relaxed">
              {tr(key)}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-black text-[#0A0A0A] mb-12">{tr('how.title')}</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: tr('how.step1.icon'), title: tr('how.step1.title'), desc: tr('how.step1.desc') },
            { icon: tr('how.step2.icon'), title: tr('how.step2.title'), desc: tr('how.step2.desc') },
            { icon: tr('how.step3.icon'), title: tr('how.step3.title'), desc: tr('how.step3.desc') },
          ].map((step, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 p-6 hover:border-gray-900 transition-colors">
              <span className="text-3xl block mb-4">{step.icon}</span>
              <h3 className="font-bold text-[#0A0A0A] mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS SECTION */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 grid sm:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 mb-4">{tr('biz.label')}</span>
            <h2 className="text-3xl font-black text-[#0A0A0A] mb-4">{tr('biz.title')}</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">{tr('biz.desc')}</p>
            <ul className="space-y-3 mb-8">
              {[tr('biz.feature1'), tr('biz.feature2'), tr('biz.feature3'), tr('biz.feature4')].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors">
              {tr('biz.cta')}
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-100 p-8 bg-white">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{tr('biz.label')}</p>
            <div className="space-y-3">
              {['Machine Learning', 'Generativ AI', 'Data & Analytics', 'Automation'].map(cat => (
                <div key={cat} className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 hover:border-gray-900 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-gray-900 shrink-0"></span>
                  <span className="text-sm font-medium text-[#0A0A0A]">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALIST SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 grid sm:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl border border-gray-100 p-8 bg-white order-2 sm:order-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{tr('spec.label')}</p>
          <div className="space-y-4">
            {[tr('spec.feature1'), tr('spec.feature2'), tr('spec.feature3'), tr('spec.feature4')].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 sm:order-2">
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 mb-4">{tr('spec.label')}</span>
          <h2 className="text-3xl font-black text-[#0A0A0A] mb-4">{tr('spec.title')}</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">{tr('spec.desc')}</p>
          <Link href="/specialist/profil" className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors">
            {tr('spec.cta')}
          </Link>
        </div>
      </section>

    </main>
  );
}
