'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { useEffect, useRef } from 'react';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('opacity-100', 'translate-y-0'); el.classList.remove('opacity-0', 'translate-y-4'); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const { tr } = useTranslation();
  const s1 = useFadeIn();
  const s2 = useFadeIn();
  const s3 = useFadeIn();
  const s4 = useFadeIn();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
            <span className="text-xs text-gray-500 font-medium">{tr('hero.badge')}</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-[#0A0A0A] leading-tight mb-6">
            {tr('hero.h1')}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
            {tr('hero.sub')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup?role=business"
              className="inline-flex items-center justify-center rounded-md bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors"
            >
              {tr('hero.cta1')}
            </Link>
            <Link
              href="/signup?role=specialist"
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0A] hover:border-[#4F46E5] transition-colors"
            >
              {tr('hero.cta2')}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 py-20">
        <div
          ref={s1}
          className="max-w-5xl mx-auto px-4 sm:px-6 opacity-0 translate-y-4 transition-all duration-500"
        >
          <h2 className="text-3xl font-bold text-[#0A0A0A] mb-12">{tr('how.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', title: tr('how.step1.title'), desc: tr('how.step1.desc') },
              { num: '02', title: tr('how.step2.title'), desc: tr('how.step2.desc') },
              { num: '03', title: tr('how.step3.title'), desc: tr('how.step3.desc') },
            ].map((step) => (
              <div
                key={step.num}
                className="border border-gray-200 rounded-xl p-6 hover:border-[#4F46E5] transition-all duration-150 hover:-translate-y-0.5"
              >
                <div className="text-xs font-bold text-[#4F46E5] mb-3 tracking-widest">{step.num}</div>
                <h3 className="font-bold text-[#0A0A0A] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For businesses */}
      <section className="border-t border-gray-100 py-20">
        <div
          ref={s2}
          className="max-w-5xl mx-auto px-4 sm:px-6 opacity-0 translate-y-4 transition-all duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold text-[#4F46E5] tracking-widest mb-3 uppercase">Virksomheder</div>
              <h2 className="text-3xl font-bold text-[#0A0A0A] mb-4">{tr('biz.title')}</h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">{tr('biz.desc')}</p>
              <Link
                href="/signup?role=business"
                className="inline-flex items-center justify-center rounded-md bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors"
              >
                {tr('biz.cta')}
              </Link>
            </div>
            <div className="space-y-3">
              {['Gratis at oprette projekter', 'AI-specialister melder sig direkte', 'Fuld kontrol over samarbejdet', 'Ingen platform-gebyrer nogensinde'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></div>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For specialists */}
      <section className="border-t border-gray-100 py-20">
        <div
          ref={s3}
          className="max-w-5xl mx-auto px-4 sm:px-6 opacity-0 translate-y-4 transition-all duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-3">
              {['Byg erfaring på rigtige projekter', 'Ingen screening eller godkendelse', 'Du bestemmer hvilke projekter du tager', 'Styrk din AI-profil med praktisk erfaring'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></div>
                  </div>
                  {item}
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <div className="text-xs font-bold text-[#4F46E5] tracking-widest mb-3 uppercase">Specialister</div>
              <h2 className="text-3xl font-bold text-[#0A0A0A] mb-4">{tr('spec.title')}</h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">{tr('spec.desc')}</p>
              <Link
                href="/signup?role=specialist"
                className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] hover:border-[#4F46E5] transition-colors"
              >
                {tr('spec.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={s4}
        className="border-t border-gray-100 py-10 opacity-0 translate-y-4 transition-all duration-500"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-extrabold text-sm text-[#0A0A0A]">Naetwork</span>
            <span className="ml-3 text-xs text-gray-400">{tr('footer.tagline')}</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/privatlivspolitik" className="hover:text-gray-600 transition-colors">{tr('footer.privacy')}</Link>
            <Link href="/vilkaar" className="hover:text-gray-600 transition-colors">{tr('footer.terms')}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
