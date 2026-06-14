'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { LanguageToggle } from './LanguageToggle';

export function Navbar() {
  const { lang } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="font-semibold text-lg text-gray-900 tracking-tight flex-shrink-0">
          Naetwork
        </Link>

        {/* Left nav */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <Link href="/professionals" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            {t(lang, 'nav.find')}
          </Link>
          <Link href="/professional/signup" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            {t(lang, 'nav.become')}
          </Link>
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link href="/login" className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors">
            {t(lang, 'nav.login')}
          </Link>
          <Link
            href="/professionals"
            className="bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-green-900 transition-colors"
          >
            {t(lang, 'nav.book')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
