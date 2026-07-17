import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center bg-white px-5 py-16 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
        <div>
          <p className="editorial-label mb-5">404</p>
          <h1 className="max-w-3xl text-4xl font-medium leading-none text-gray-950 text-balance sm:text-5xl md:text-7xl">Siden findes ikke.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">Linket kan være forældet, eller siden kan være flyttet. Du kan fortsætte direkte til oversigten over fagpersoner.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/professionals" className="button-primary">
              <Search size={16} aria-hidden="true" /> Se profiler
            </Link>
            <Link href="/" className="button-secondary">
              <ArrowLeft size={16} aria-hidden="true" /> Til forsiden
            </Link>
          </div>
        </div>
        <aside className="border-t border-gray-200 pt-6">
          <span className="block h-1.5 w-16 rounded-full bg-cyan-300" />
          <p className="mt-5 text-xl font-semibold text-gray-950">Har du brug for hjælp?</p>
          <Link href="/contact" className="mt-3 inline-flex text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">Kontakt Naetwork</Link>
        </aside>
      </div>
    </main>
  );
}
