'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export function CookieBanner() {
  const { tr } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('naetwork_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('naetwork_cookie_consent', 'accepted');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-600 leading-relaxed">
          {tr('cookie.text')}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/privatlivspolitik"
            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
          >
            {tr('cookie.readMore')}
          </Link>
          <button
            onClick={accept}
            className="inline-flex items-center justify-center rounded-md bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors"
          >
            {tr('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
