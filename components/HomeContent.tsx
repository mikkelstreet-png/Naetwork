'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function HomeContent() {
  const { tr } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sessionTypes = [
    { titleKey: 'sessions.s1.title', textKey: 'sessions.s1.text', bestKey: 'sessions.s1.best' },
    { titleKey: 'sessions.s2.title', textKey: 'sessions.s2.text', bestKey: 'sessions.s2.best' },
    { titleKey: 'sessions.s3.title', textKey: 'sessions.s3.text', bestKey: 'sessions.s3.best' },
    { titleKey: 'sessions.s4.title', textKey: 'sessions.s4.text', bestKey: 'sessions.s4.best' },
    { titleKey: 'sessions.s5.title', textKey: 'sessions.s5.text', bestKey: 'sessions.s5.best' },
    { titleKey: 'sessions.s6.title', textKey: 'sessions.s6.text', bestKey: 'sessions.s6.best' },
  ];

  const paths = [
    { titleKey: 'paths.p1.title', textKey: 'paths.p1.text', tagsKey: 'paths.p1.tags', ctaKey: 'paths.p1.cta' },
    { titleKey: 'paths.p2.title', textKey: 'paths.p2.text', tagsKey: 'paths.p2.tags', ctaKey: 'paths.p2.cta' },
    { titleKey: 'paths.p3.title', textKey: 'paths.p3.text', tagsKey: 'paths.p3.tags', ctaKey: 'paths.p3.cta' },
    { titleKey: 'paths.p4.title', textKey: 'paths.p4.text', tagsKey: 'paths.p4.tags', ctaKey: 'paths.p4.cta' },
    { titleKey: 'paths.p5.title', textKey: 'paths.p5.text', tagsKey: 'paths.p5.tags', ctaKey: 'paths.p5.cta' },
    { titleKey: 'paths.p6.title', textKey: 'paths.p6.text', tagsKey: 'paths.p6.tags', ctaKey: 'paths.p6.cta' },
  ];

  const pricingTiers = [
    { priceKey: 'pricing.t1.price', labelKey: 'pricing.t1.label', expKey: 'pricing.t1.exp' },
    { priceKey: 'pricing.t2.price', labelKey: 'pricing.t2.label', expKey: 'pricing.t2.exp' },
    { priceKey: 'pricing.t3.price', labelKey: 'pricing.t3.label', expKey: 'pricing.t3.exp' },
    { priceKey: 'pricing.t4.price', labelKey: 'pricing.t4.label', expKey: 'pricing.t4.exp' },
  ];

  const trustCards = [
    { titleKey: 'trust.c1.title', textKey: 'trust.c1.text' },
    { titleKey: 'trust.c2.title', textKey: 'trust.c2.text' },
    { titleKey: 'trust.c3.title', textKey: 'trust.c3.text' },
    { titleKey: 'trust.c4.title', textKey: 'trust.c4.text' },
    { titleKey: 'trust.c5.title', textKey: 'trust.c5.text' },
  ];

  const faqs = [
    { qKey: 'faq.q1', aKey: 'faq.a1' },
    { qKey: 'faq.q2', aKey: 'faq.a2' },
    { qKey: 'faq.q5', aKey: 'faq.a5' },
    { qKey: 'faq.q6', aKey: 'faq.a6' },
    { qKey: 'faq.q7', aKey: 'faq.a7' },
    { qKey: 'faq.q9', aKey: 'faq.a9' },
    { qKey: 'faq.q10', aKey: 'faq.a10' },
    { qKey: 'faq.q11', aKey: 'faq.a11' },
    { qKey: 'faq.q3', aKey: 'faq.a3' },
    { qKey: 'faq.q4', aKey: 'faq.a4' },
  ];

  return (
    <>
      {/* ─── 1. HERO ─────────────────────────────────────────── */}
      <section id="home" className="bg-white pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left: copy */}
            <div>
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-6 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-full">
                {tr('hero.label')}
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-gray-950 mb-6">
                {tr('hero.h1')}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {tr('hero.sub')}
              </p>
              <p className="text-base text-gray-500 leading-relaxed mb-4">
                {tr('hero.support')}
              </p>
              <p className="text-sm text-indigo-600 font-medium mb-8">
                {tr('hero.impact')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  href="/professionals"
                  className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-base"
                >
                  {tr('hero.cta1')}
                </Link>
                <Link
                  href="/professional/signup"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-base"
                >
                  {tr('hero.cta2')}
                </Link>
              </div>
              <p className="text-xs text-gray-400">{tr('hero.trust')}</p>
            </div>

            {/* Right: booking card mockup */}
            <div className="mt-12 lg:mt-0">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">SL</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-950 text-sm">Sofie Larsen</p>
                    <p className="text-xs text-gray-500">Investment Banking · 4 år</p>
                  </div>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Demo profil</span>
                </div>
                <div className="space-y-2 mb-4">
                  {['CV & LinkedIn Review', 'Mock Interview', 'Career Direction'].map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-950">DKK 799 / 60 min</span>
                  <button className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
                    Book session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. WHY ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-8">{tr('why.h1')}</h2>
          <p className="text-lg text-gray-600 mb-8">{tr('why.body1')}</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {(['why.q1','why.q2','why.q3','why.q4','why.q5'] as const).map((k) => (
              <div key={k} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-sm text-gray-700 font-medium">
                {tr(k)}
              </div>
            ))}
          </div>
          <p className="text-base text-gray-600 leading-relaxed">{tr('why.body2')}</p>
        </div>
      </section>

      {/* ─── 3. WHAT ─────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-6">{tr('what.h1')}</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">{tr('what.body')}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { titleKey: 'what.c1.title', textKey: 'what.c1.text' },
              { titleKey: 'what.c2.title', textKey: 'what.c2.text' },
              { titleKey: 'what.c3.title', textKey: 'what.c3.text' },
            ].map((c) => (
              <div key={c.titleKey} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-950 mb-2">{tr(c.titleKey)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tr(c.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. CANDIDATES ───────────────────────────────────── */}
      <section id="candidates" className="bg-gray-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-3">{tr('cand.h1')}</h2>
          <p className="text-lg text-gray-600 mb-6">{tr('cand.sub')}</p>
          <p className="text-base text-gray-600 leading-relaxed mb-8">{tr('cand.body')}</p>
          <ul className="space-y-3 mb-10">
            {(['cand.b1','cand.b2','cand.b3','cand.b4','cand.b5','cand.b6'] as const).map((k) => (
              <li key={k} className="flex items-start gap-3 text-gray-700 text-sm">
                <span className="text-indigo-600 font-bold mt-0.5 shrink-0">→</span>
                {tr(k)}
              </li>
            ))}
          </ul>
          {/* 4-step journey card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(['cand.step1','cand.step2','cand.step3','cand.step4'] as const).map((k, i) => (
                <div key={k} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium text-gray-950">{tr(k)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Link href="/professionals" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
              {tr('cand.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 5. PROFESSIONALS ────────────────────────────────── */}
      <section id="professionals-section" className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-3">{tr('pro.h1')}</h2>
            <p className="text-lg text-gray-600 mb-6">{tr('pro.sub')}</p>
            <p className="text-base text-gray-600 leading-relaxed mb-8">{tr('pro.body')}</p>
            <ul className="space-y-3 mb-8">
              {(['pro.b1','pro.b2','pro.b3','pro.b4','pro.b5','pro.b6'] as const).map((k) => (
                <li key={k} className="flex items-start gap-3 text-gray-700 text-sm">
                  <span className="text-indigo-600 font-bold mt-0.5 shrink-0">→</span>
                  {tr(k)}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/professional/signup" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                {tr('pro.cta')}
              </Link>
              <Link href="/#how" className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                {tr('pro.cta2')}
              </Link>
            </div>
          </div>
          {/* Demo pro card */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">SL</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-950 text-sm">Sofie Larsen</p>
                  <p className="text-xs text-gray-500">Investment Banking · 4 år erfaring</p>
                </div>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Demo profil</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Rådgiver kandidater om IBD recruitment, CV, og karriereovervejelser inden for banking og finance.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['CV Review', 'Mock Interview', 'Career Direction'].map(tag => (
                  <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-950">DKK 799 / 60 min</span>
                <button className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">Book session</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SESSION TYPES ────────────────────────────────── */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-3">{tr('sessions.h1')}</h2>
          <p className="text-lg text-gray-600 mb-12">{tr('sessions.sub')}</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sessionTypes.map((s) => (
              <div key={s.titleKey} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                <h3 className="font-bold text-gray-950 mb-2">{tr(s.titleKey)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{tr(s.textKey)}</p>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-indigo-600 font-medium">Best for: {tr(s.bestKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CAREER PATHS ─────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 leading-tight">{tr('paths.h1')}</h2>
          <p className="text-base text-gray-600 leading-relaxed mb-12 max-w-2xl">{tr('paths.intro')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paths.map((p) => (
              <div key={p.titleKey} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                <h3 className="font-bold text-gray-950 mb-2">{tr(p.titleKey)}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{tr(p.textKey)}</p>
                <p className="text-xs text-gray-400 mb-4">{tr(p.tagsKey)}</p>
                <Link href="/professionals" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                  {tr(p.ctaKey)} →
                </Link>
              </div>
            ))}
          </div>
          <div className="border-l-4 border-indigo-600 pl-6 max-w-2xl">
            <p className="text-sm text-gray-600 leading-relaxed">{tr('paths.trust')}</p>
          </div>
        </div>
      </section>

      {/* ─── 8. HOW IT WORKS ─────────────────────────────────── */}
      <section id="how" className="bg-gray-950 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{tr('how.h1')}</h2>
          <p className="text-gray-400 text-lg mb-16">{tr('how.sub')}</p>
          {/* Desktop horizontal stepper */}
          <div className="hidden md:grid md:grid-cols-4 gap-8">
            {[
              { num: '01', titleKey: 'how.s1.title', textKey: 'how.s1.text' },
              { num: '02', titleKey: 'how.s2.title', textKey: 'how.s2.text' },
              { num: '03', titleKey: 'how.s3.title', textKey: 'how.s3.text' },
              { num: '04', titleKey: 'how.s4.title', textKey: 'how.s4.text' },
            ].map((step, i, arr) => (
              <div key={step.num} className="relative flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {step.num}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex-1 h-px bg-indigo-800 ml-4" />
                  )}
                </div>
                <h3 className="font-bold text-white mb-2">{tr(step.titleKey)}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{tr(step.textKey)}</p>
              </div>
            ))}
          </div>
          {/* Mobile vertical stepper */}
          <div className="md:hidden space-y-8">
            {[
              { num: '01', titleKey: 'how.s1.title', textKey: 'how.s1.text' },
              { num: '02', titleKey: 'how.s2.title', textKey: 'how.s2.text' },
              { num: '03', titleKey: 'how.s3.title', textKey: 'how.s3.text' },
              { num: '04', titleKey: 'how.s4.title', textKey: 'how.s4.text' },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{tr(step.titleKey)}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{tr(step.textKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. PRICING ──────────────────────────────────────── */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">{tr('pricing.h1')}</h2>
          <p className="text-gray-600 leading-relaxed mb-12">{tr('pricing.intro')}</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <div key={tier.priceKey} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
                <p className="text-xl font-black text-gray-950 mb-1">{tr(tier.priceKey)}</p>
                <p className="text-sm font-semibold text-indigo-600 mb-2">{tr(tier.labelKey)}</p>
                <p className="text-xs text-gray-500">{tr(tier.expKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. COMMISSION / IMPACT ─────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">{tr('impact.h1')}</h2>
          <p className="text-gray-600 leading-relaxed mb-12">{tr('impact.body')}</p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Standard */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-950">{tr('impact.std.title')}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{tr('impact.std.fee')}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
                <p className="text-3xl font-black text-gray-950">80%</p>
                <p className="text-xs text-gray-500 mt-1">{tr('impact.std.pro')}</p>
              </div>
            </div>
            {/* Impact */}
            <div className="bg-indigo-950 border border-indigo-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">{tr('impact.imp.title')}</h3>
                <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-1 rounded-full">{tr('impact.imp.fee')}</span>
              </div>
              <div className="bg-indigo-900 rounded-lg p-4 text-center mb-4">
                <p className="text-3xl font-black text-white">90%</p>
                <p className="text-xs text-indigo-300 mt-1">{tr('impact.imp.pro')}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed border-l-4 border-indigo-600 pl-4">{tr('impact.close')}</p>
        </div>
      </section>

      {/* ─── 11. TRUST ───────────────────────────────────────── */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">{tr('trust.h1')}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {trustCards.map((c) => (
              <div key={c.titleKey} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-950 mb-2 text-sm">{tr(c.titleKey)}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{tr(c.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 12. FAQ ─────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">{tr('faq.h1')}</h2>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={faq.qKey}>
                <button
                  className="w-full text-left py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-950 text-sm">{tr(faq.qKey)}</span>
                  <span className="text-gray-400 shrink-0 text-lg leading-none">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{tr(faq.aKey)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 13. FINAL CTA ───────────────────────────────────── */}
      <section className="bg-gray-950 text-white py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{tr('cta.h1')}</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">{tr('cta.body')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/professionals"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              {tr('cta.cta1')}
            </Link>
            <Link
              href="/professional/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-400 font-medium rounded-lg hover:bg-indigo-950 transition-colors"
            >
              {tr('cta.cta2')}
            </Link>
          </div>
          {/* Professional variant */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500 text-sm mb-2">{tr('cta.pro.label')}</p>
            <p className="text-gray-400 text-sm">{tr('cta.pro.text')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
