'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { tr, lang } = useLanguage();
  const isDa = lang === 'da';

  const columns = [
    {
      title: 'Platform',
      links: [
        { href: '/professionals', label: isDa ? 'Profiler' : 'Profiles' },
        { href: '/match', label: 'Match quiz' },
        { href: '/onboarding', label: 'Onboarding' },
      ],
    },
    {
      title: isDa ? 'Model' : 'Model',
      links: [
        { href: '/mission', label: 'Mission' },
        { href: '/#pricing', label: isDa ? 'Format' : 'Format' },
        { href: '/impact', label: 'Impact' },
      ],
    },
    {
      title: isDa ? 'Juridisk' : 'Legal',
      links: [
        { href: '/terms', label: tr('footer.terms') },
        { href: '/privacy', label: tr('footer.privacy_link') },
        { href: '/cookies', label: tr('footer.cookies') },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="grid gap-12 border-b border-gray-200 pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-black uppercase text-gray-400">Naetwork</p>
            <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-gray-950 text-balance md:text-6xl">
              {isDa ? 'Én fokuseret time. Mere klarhed.' : 'One focused hour. More clarity.'}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-gray-600 lg:ml-auto">
            {isDa
              ? '60-minutters karrieresessioner med professionals fra AI, Banking, Management Consulting og Private Equity.'
              : '60-minute career sessions with professionals from AI, Banking, Management Consulting and Private Equity.'}
          </p>
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Naetwork home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-[11px] font-black text-white">N</span>
              <span className="block text-lg font-black tracking-tight text-gray-950">Naetwork</span>
            </Link>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/professionals" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-gray-800">
                {isDa ? 'Se profiler' : 'Browse profiles'}
              </Link>
              <Link href="/match" className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-black text-gray-950 transition-colors hover:border-gray-950">
                Match quiz
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 lg:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="mb-4 text-xs font-bold uppercase text-gray-400">{column.title}</p>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} className="block font-semibold text-gray-600 transition-colors hover:text-gray-950">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
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
