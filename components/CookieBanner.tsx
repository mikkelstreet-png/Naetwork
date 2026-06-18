'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-5">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl shadow-gray-950/10 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-gray-950">Cookies på Naetwork</p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
              Vi bruger nødvendige cookies og lokal lagring til login, sprogvalg og basale funktioner.{' '}
              <Link href="/cookies" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950">Læs mere</Link>.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button onClick={decline} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950">Afvis</button>
            <button onClick={accept} className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800">Accepter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
