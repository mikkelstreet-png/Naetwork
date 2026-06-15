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
            <svg viewBox="-210 -210 420 420" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="nav-clip">
                  <circle r="196"/>
                </clipPath>
                <g id="nav-N">
                  <rect x="-125" y="-150" width="45" height="300"/>
                  <rect x="80" y="-150" width="45" height="300"/>
                  <polygon points="-80,-150 -35,-150 80,150 35,150"/>
                </g>
              </defs>
              <circle r="204" fill="#111111"/>
              <g clipPath="url(#nav-clip)" fill="white">
                <use href="#nav-N" opacity="0.21" transform="rotate(0)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(36)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(72)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(108)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(144)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(180)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(216)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(252)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(288)"/>
                <use href="#nav-N" opacity="0.21" transform="rotate(324)"/>
              </g>
              <circle r="188" fill="none" stroke="#166534" strokeWidth="2.5"/>
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
