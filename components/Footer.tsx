'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { tr, lang } = useLanguage();
  const isDa = lang === 'da';

  return (
    <footer className="border-t border-gray-200 bg-[#f7f7f4]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Naetwork home">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-950 text-[11px] font-black text-white">N</span>
              <span className="text-lg font-black tracking-tight text-gray-950">Naetwork</span>
            </Link>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-600">
              {isDa
                ? '60-minutters karrieresessioner med professionelle fra AI, Banking, Management Consulting og Private Equity.'
                : '60-minute career sessions with professionals from AI, Banking, Management Consulting and Private Equity.'}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/match" className="inline-flex w-fit items-center justify-center rounded-full bg-gray-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gray-800">
                Match quiz
              </Link>
              <Link href="/professional/signup" className="inline-flex w-fit items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-950 transition-colors hover:border-gray-950 hover:bg-gray-50">
                {tr('professionals.cta')}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 lg:grid-cols-3">
            <div>
              <p className="mb-4 text-xs font-bold uppercase text-gray-400">Platform</p>
              <div className="space-y-3">
                <Link href="/professionals" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">{tr('nav.find')}</Link>
                <Link href="/match" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">Match quiz</Link>
                <Link href="/onboarding" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">Onboarding</Link>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-bold uppercase text-gray-400">{isDa ? 'Model' : 'Model'}</p>
              <div className="space-y-3">
                <Link href="/#how-it-works" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">{tr('nav.how')}</Link>
                <Link href="/#pricing" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">{isDa ? 'Format' : 'Format'}</Link>
                <Link href="/impact" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">Impact</Link>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-bold uppercase text-gray-400">{isDa ? 'Juridisk' : 'Legal'}</p>
              <div className="space-y-3">
                <Link href="/terms" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">{tr('footer.terms')}</Link>
                <Link href="/privacy" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">{tr('footer.privacy_link')}</Link>
                <Link href="/cookies" className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">{tr('footer.cookies')}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-gray-400">{tr('footer.legal')}</p>
          <p className="text-xs text-gray-400">{tr('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
