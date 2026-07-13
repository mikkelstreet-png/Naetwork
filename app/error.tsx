'use client';

import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app:error]', error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center bg-white px-5 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-3xl border-y border-gray-200 py-12 text-center">
        <p className="editorial-label">Noget gik galt</p>
        <h1 className="mt-5 text-4xl font-medium leading-tight text-gray-950 md:text-6xl">Vi kunne ikke vise siden.</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-600">Prøv igen. Hvis problemet fortsætter, kan du kontakte os, så vi kan hjælpe.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="button-primary">
            <RefreshCw size={16} aria-hidden="true" /> Prøv igen
          </button>
          <Link href="/contact" className="button-secondary">Kontakt os</Link>
        </div>
      </div>
    </main>
  );
}
