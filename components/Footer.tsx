'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export function Footer() {
  const { tr } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Logo + tagline */}
          <div>
            <p className="font-bold text-base tracking-tight text-gray-900">Naetwork</p>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">{tr('footer.tagline')}</p>
          </div>

          {/* Column 2: Links */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Links</p>
            <ul className="space-y-3">
              <li>
                <Link href="/projekter" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Projekter
                </Link>
              </li>
              <li>
                <Link href="/signup?role=specialist" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Bliv specialist
                </Link>
              </li>
              <li>
                <Link href="#om" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Om Naetwork
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Legal</p>
            <ul className="space-y-3">
              <li>
                <Link href="/privatlivspolitik" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {tr('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/vilkaar" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {tr('footer.terms')}
                </Link>
              </li>
              <li>
                <a href="mailto:kontakt@naetwork.dk" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400">{tr('footer.copy')}</p>
        </div>
      </div>
    </footer>
  );
}
