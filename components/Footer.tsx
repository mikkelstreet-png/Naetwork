'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { tr, lang } = useLanguage();
  const isDa = lang === 'da';

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-2" aria-label="Naetwork home">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-[11px] font-black text-white">N</span>
              <span className="text-lg font-black tracking-tight text-gray-950">Naetwork</span>
            </Link>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-500">{tr('footer.tagline')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
                {isDa ? 'Book 60 min' : 'Book 60 min'}
              </Link>
              <Link href="/professional/signup" className="inline-flex w-fit items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-950 transition-colors hover:border-gray-950 hover:bg-gray-50">
                {tr('professionals.cta')}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase text-gray-400">Platform</p>
              <div className="space-y-3">
                <Link href="/professionals" className="block font-medium text-gray-600 transition-colors hover:text-gray-950">{tr('nav.find')}</Link>
                <Link href="/#pricing" className="block font-medium text-gray-600 transition-colors hover:text-gray-950">{isDa ? 'Format og priser' : 'Format and pricing'}</Link>
                <Link href="/#how-it-works" className="block font-medium text-gray-600 transition-colors hover:text-gray-950">{tr('nav.how')}</Link>
                <Link href="/#impact" className="block font-medium text-gray-600 transition-colors hover:text-gray-950">Impact</Link>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase text-gray-400">{isDa ? 'Juridisk' : 'Legal'}</p>
              <div className="space-y-3">
                <Link href="/terms" className="block font-medium text-gray-600 transition-colors hover:text-gray-950">{tr('footer.terms')}</Link>
                <Link href="/privacy" className="block font-medium text-gray-600 transition-colors hover:text-gray-950">{tr('footer.privacy_link')}</Link>
                <Link href="/cookies" className="block font-medium text-gray-600 transition-colors hover:text-gray-950">{tr('footer.cookies')}</Link>
                <a href="/#contact" className="block font-medium text-gray-600 transition-colors hover:text-gray-950">{tr('footer.contact_link')}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-gray-100 pt-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-gray-400">{tr('footer.legal')}</p>
          <p className="text-xs text-gray-400">{tr('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
