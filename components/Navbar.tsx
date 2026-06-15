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
        <Link href="/" className="flex-shrink-0">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 160 160" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="160" height="160" rx="16" fill="#0f0f0f" stroke="#166534" strokeWidth="2.5"/>
              <rect x="30" y="28" width="22" height="104" fill="white"/>
              <rect x="108" y="28" width="22" height="104" fill="white"/>
              <polygon points="30,28 52,28 130,132 108,132" fill="white"/>
            </svg>
            <span className="font-bold text-lg tracking-tight">Naetwork</span>
          </span>
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
