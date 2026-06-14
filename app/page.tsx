'use client';

import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { MicrophoneIcon } from '@/components/icons/MicrophoneIcon';
import { DocumentCheckIcon } from '@/components/icons/DocumentCheckIcon';
import { ChatBubbleIcon } from '@/components/icons/ChatBubbleIcon';
import { LightBulbIcon } from '@/components/icons/LightBulbIcon';
import { HeartIcon } from '@/components/icons/HeartIcon';
import Link from 'next/link';

const SESSION_TYPES = [
  { type: 'mock_interview', icon: <MicrophoneIcon className="w-8 h-8" />, titleKey: 'sessions.mock', descKey: 'sessions.mock.desc' },
  { type: 'cv_review', icon: <DocumentCheckIcon className="w-8 h-8" />, titleKey: 'sessions.cv', descKey: 'sessions.cv.desc' },
  { type: 'informal_chat', icon: <ChatBubbleIcon className="w-8 h-8" />, titleKey: 'sessions.chat', descKey: 'sessions.chat.desc' },
  { type: 'career_advice', icon: <LightBulbIcon className="w-8 h-8" />, titleKey: 'sessions.advice', descKey: 'sessions.advice.desc' },
];

export default function HomePage() {
  const { lang } = useLanguage();

  return (
    <main className="pt-16">

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            {t(lang, 'hero.h1')}
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed">
            {t(lang, 'hero.sub')}
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/professionals"
              className="bg-green-800 text-white font-medium px-6 py-3 rounded-xl hover:bg-green-900 transition-colors"
            >
              {t(lang, 'hero.cta1')}
            </Link>
            <Link
              href="/professional/signup"
              className="border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:border-gray-400 transition-colors"
            >
              {t(lang, 'hero.cta2')}
            </Link>
          </div>
          <p className="text-xs text-gray-400">{t(lang, 'hero.trust')}</p>
        </div>
      </section>

      {/* ── What is Naetwork ── */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-medium text-green-800 uppercase tracking-widest mb-4">Hvad er Naetwork?</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              En simpel platform hvor din naeste karrieresprog sker over en time med den rette person.
            </h2>
            <p className="text-gray-500">
              Vi har fjernet alt det besvaerlige. Ingen lange processer, ingen bureaukrati.
              Du finder den rigtige professionelle, booker en session, og moedes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { num: '1', title: 'Vaelg session-type', desc: 'Mock interview, CV-gennemgang, uformel snak eller karriereraadgivning.' },
              { num: '2', title: 'Book direkte', desc: 'Send en besked og foreslaa en tid. Ingen mellemmand.' },
              { num: '3', title: 'Betal sikkert', desc: 'Betaling via Stripe. Pengene overfoeres kun efter bekraeftet session.' },
            ].map(item => (
              <div key={item.num} className="border border-gray-100 rounded-2xl p-5 bg-white flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-800 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {item.num}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Session Types ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-xs font-medium text-green-800 uppercase tracking-widest mb-3">Sessions</div>
          <h2 className="text-3xl font-bold text-gray-900">Fire maader vi kan hjaelpe dig</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SESSION_TYPES.map(s => (
            <div key={s.type} className="border border-gray-100 rounded-2xl p-6 hover:border-gray-300 transition-colors">
              <div className="text-green-800 mb-4">{s.icon}</div>
              <div className="font-semibold text-gray-900 mb-2">{t(lang, s.titleKey)}</div>
              <div className="text-sm text-gray-500">{t(lang, s.descKey)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── For Candidates ── */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-green-800 uppercase tracking-widest mb-4">For kandidater</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Kom videre med din karriere — en time ad gangen</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            {[
              { title: 'Aerkelige svar', desc: 'Tal med nogen der faktisk har vaeret i din situation og ved hvad det kraever.' },
              { title: 'Konkret feedback', desc: 'Faa direkte input paa dit CV, dine svar eller din strategi — ikke vage raad.' },
              { title: 'Pris du kan styre', desc: 'Fra DKK 300. Vaelg den professionelle der passer til dit behov og din lomme.' },
            ].map(item => (
              <div key={item.title} className="border border-gray-100 rounded-2xl p-6 bg-white">
                <div className="font-semibold text-gray-900 mb-2">{item.title}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/professionals" className="bg-green-800 text-white font-medium px-6 py-3 rounded-xl hover:bg-green-900 transition-colors inline-block">
              Find en professionel
            </Link>
          </div>
        </div>
      </section>

      {/* ── For Professionals ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-xs font-medium text-green-800 uppercase tracking-widest mb-4">For professionelle</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Del din viden. Faa betaling. Goer en forskel.</h2>
            <p className="text-gray-500 mb-6">
              Du saetter prisen — fra DKK 300 til 2.000 per session. Naetwork tager 15% i platformsbidrag.
            </p>
            <div className="border border-rose-200 bg-rose-50 rounded-2xl p-5 flex gap-3">
              <HeartIcon className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-800 text-sm mb-1">Vaelg at donere til Kraeftens Bekaempelse</div>
                <p className="text-sm text-rose-700">
                  Vaelg at donere dit honorar til Kraeftens Bekaempelse og betaler du kun 7,5% i platformsbidrag i stedet for 15%.
                  Din samlede donation vises paa din profil.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Du saetter prisen', desc: 'DKK 300–2.000 per session. Du bestemmer fuldt ud.' },
              { title: 'Faa booking direkte', desc: 'Kandidater booker og betaler. Du bekraefter og moedes.' },
              { title: 'Simpel udbetaling', desc: 'Pengene overfoeres til dig efter sessionen via Stripe.' },
              { title: 'Din profil — dit brand', desc: 'Vis dine erfaringer, sessions-typer og tilgaengelighed.' },
            ].map(item => (
              <div key={item.title} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-800" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link href="/professional/signup" className="border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:border-gray-400 transition-colors inline-block text-sm">
                Bliv professionel →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xs font-medium text-green-800 uppercase tracking-widest mb-4">Sikkerhed</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sikker betaling via Stripe</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Pengene overfoeres kun efter bekraeftet session. Vi gemmer aldrig kortoplysninger.
            Alle transaktioner er krypterede og beskyttede.
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Klar til din naeste karrieresession?
        </h2>
        <p className="text-gray-500 mb-8">Vaelg en professionel og book din session i dag.</p>
        <Link
          href="/professionals"
          className="bg-green-800 text-white font-medium px-8 py-4 rounded-xl hover:bg-green-900 transition-colors inline-block text-lg"
        >
          Find din session
        </Link>
      </section>

    </main>
  );
}
