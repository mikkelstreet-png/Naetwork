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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-sm text-gray-600">
          Vi bruger cookies til at forbedre din oplevelse.{' '}
          <Link href="/privatlivspolitik" className="underline hover:text-gray-900">Laes mere</Link>.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={decline} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">Afvis</button>
          <button onClick={accept} className="text-sm bg-green-800 text-white px-4 py-1.5 rounded-lg hover:bg-green-900 transition-colors">Accepter</button>
        </div>
      </div>
    </div>
  );
}
