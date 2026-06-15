'use client';

import { useState } from 'react';
import Link from 'next/link';
import { t, Lang } from '@/lib/translations';

export default function Home() {
  const [lang, setLang] = useState<Lang>('da');
  const [howTab, setHowTab] = useState<'candidate' | 'professional'>('candidate');
  const T = (key: string) => t[lang][key] ?? key;

  return (
    <main className="font-[Inter,sans-serif] bg-white text-gray-900">
      {/* Language toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setLang('da')}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${lang === 'da' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
        >
          DA
        </button>
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${lang === 'en' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
        >
          EN
        </button>
      </div>

      {/* ── 1. HERO ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
          {T('hero.h1')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          {T('hero.sub')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/professionals"
            className="px-8 py-4 bg-black text-white rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors"
          >
            {T('hero.cta.primary')}
          </Link>
          <Link
            href="/become-professional"
            className="px-8 py-4 border border-gray-300 text-gray-900 rounded-xl font-semibold text-base hover:border-gray-500 transition-colors"
          >
            {T('hero.cta.secondary')}
          </Link>
        </div>
      </section>

      {/* ── 2. OM NAETWORK ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{T('about.headline')}</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {T('about.body')}
          </p>
          <ul className="space-y-4">
            {(['bullet1', 'bullet2', 'bullet3'] as const).map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-green-800">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <span className="text-gray-700">{T(`about.${b}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 3. HVORFOR NAETWORK ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{T('why.headline')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kandidat */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <h3 className="text-xl font-bold">{T('why.candidate.title')}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{T('why.candidate.body')}</p>
              <ul className="space-y-3">
                {(['bullet1', 'bullet2', 'bullet3', 'bullet4'] as const).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0 text-green-800">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {T(`why.candidate.${b}`)}
                  </li>
                ))}
              </ul>
            </div>
            {/* Professionel */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <h3 className="text-xl font-bold">{T('why.professional.title')}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{T('why.professional.body')}</p>
              <ul className="space-y-3">
                {(['bullet1', 'bullet2', 'bullet3', 'bullet4'] as const).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0 text-green-800">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {T(`why.professional.${b}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SESSION-TYPER ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{T('sessions.headline')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mock Interview */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">{T('sessions.mock.title')}</h3>
              <p className="text-sm font-medium text-green-800 mb-3">{T('sessions.mock.tagline')}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{T('sessions.mock.desc')}</p>
            </div>
            {/* CV & LinkedIn */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">{T('sessions.cv.title')}</h3>
              <p className="text-sm font-medium text-green-800 mb-3">{T('sessions.cv.tagline')}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{T('sessions.cv.desc')}</p>
            </div>
            {/* Uformel 1:1 */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">{T('sessions.chat.title')}</h3>
              <p className="text-sm font-medium text-green-800 mb-3">{T('sessions.chat.tagline')}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{T('sessions.chat.desc')}</p>
            </div>
            {/* Karriererådgivning */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">{T('sessions.career.title')}</h3>
              <p className="text-sm font-medium text-green-800 mb-3">{T('sessions.career.tagline')}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{T('sessions.career.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SÅDAN FUNGERER DET ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">{T('how.headline')}</h2>
          {/* Tabs */}
          <div className="flex gap-2 mb-10 bg-gray-100 p-1 rounded-xl w-fit mx-auto">
            <button
              onClick={() => setHowTab('candidate')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${howTab === 'candidate' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {T('how.tab.candidate')}
            </button>
            <button
              onClick={() => setHowTab('professional')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${howTab === 'professional' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {T('how.tab.professional')}
            </button>
          </div>
          {/* Steps */}
          <div className="space-y-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  {step}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    {T(`how.${howTab}.step${step}.title`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {T(`how.${howTab}.step${step}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. KRÆFTENS BEKÆMPELSE ── */}
      <section className="py-20 px-6 bg-green-50 border-y border-green-100">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-900 mb-4">{T('charity.headline')}</h2>
            <p className="text-green-800 leading-relaxed">{T('charity.body')}</p>
          </div>
        </div>
      </section>

      {/* ── 7. TRUST SIGNALS ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
              <div className="text-3xl font-bold mb-2 text-gray-900">{T(`trust.stat${i}.value`)}</div>
              <div className="text-gray-500 text-sm">{T(`trust.stat${i}.desc`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. FINAL CTA ── */}
      <section className="py-24 px-6 bg-black text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{T('cta.headline')}</h2>
          <p className="text-gray-300 text-lg mb-10">{T('cta.sub')}</p>
          <Link
            href="/professionals"
            className="inline-block px-10 py-4 bg-white text-black rounded-xl font-semibold text-base hover:bg-gray-100 transition-colors"
          >
            {T('cta.button')}
          </Link>
        </div>
      </section>
    </main>
  );
}
