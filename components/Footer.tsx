'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';

export function Footer() {
  const { tr, lang } = useLanguage();
  const isDa = lang === 'da';
  const pathname = usePathname();

  const columns = [
    {
      title: 'Platform',
      links: [
        { href: '/professionals', label: isDa ? 'Profiler' : 'Profiles' },
        { href: '/match', label: isDa ? 'Find fokus' : 'Find focus' },
        { href: '/contact', label: isDa ? 'Kontakt' : 'Contact' },
      ],
    },
    {
      title: isDa ? 'Felter' : 'Fields',
      links: [
        { href: '/fields/ai', label: 'AI' },
        { href: '/fields/banking', label: 'Banking' },
        { href: '/fields/consulting', label: 'Consulting' },
        { href: '/fields/private-equity', label: 'Private Equity' },
      ],
    },
    {
      title: isDa ? 'Om Naetwork' : 'About Naetwork',
      links: [
        { href: '/mission', label: 'Mission' },
        { href: '/impact', label: isDa ? 'Bidrag' : 'Impact' },
        { href: '/professional/signup', label: isDa ? 'Bliv professionel' : 'Become a professional' },
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

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Naetwork home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-[11px] font-black text-white">N</span>
              <span className="block text-lg font-black text-gray-950">Naetwork</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-600">
              {isDa
                ? 'Fokuseret karrieresparring fra AI, Banking, Management Consulting og Private Equity.'
                : 'Focused career guidance from AI, Banking, Management Consulting and Private Equity.'}
            </p>
            <p className="mt-3 max-w-sm text-xs font-semibold leading-relaxed text-gray-400">
              {isDa ? 'Minimum 40% af hver betalt session går til Kræftens Bekæmpelse.' : 'At least 40% from every paid session goes to Kræftens Bekæmpelse.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-4 lg:grid-cols-4">
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
