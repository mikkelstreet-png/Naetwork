'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { tr } = useLanguage();

  return (
    <footer className="border-t border-gray-100 bg-white mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="font-semibold text-gray-900 text-lg mb-2">Naetwork</div>
            <p className="text-sm text-gray-500">{tr('footer.tagline')}</p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-gray-900 mb-3">Platform</div>
              <Link href="/professionals" className="block text-gray-500 hover:text-gray-900">Find professionelle</Link>
              <Link href="/professional/signup" className="block text-gray-500 hover:text-gray-900">Bliv professionel</Link>
              <Link href="/login" className="block text-gray-500 hover:text-gray-900">Log ind</Link>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-gray-900 mb-3">Juridisk</div>
              <Link href="/privatlivspolitik" className="block text-gray-500 hover:text-gray-900">Privatlivspolitik</Link>
              <Link href="/vilkaar" className="block text-gray-500 hover:text-gray-900">Vilkaar</Link>
              <Link href="/ansvarsfraskrivelse" className="block text-gray-500 hover:text-gray-900">Ansvarsfraskrivelse</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">{tr('footer.legal')}</p>
          <p className="text-xs text-gray-400 mt-1">&copy; {new Date().getFullYear()} Naetwork</p>
        </div>
      </div>
    </footer>
  );
}
