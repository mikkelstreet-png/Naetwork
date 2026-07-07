'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { safeInternalPath } from '@/lib/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const errorCode = new URLSearchParams(window.location.search).get('error');
    if (errorCode === 'service_unavailable') {
      setError('Naetwork kan ikke oprette forbindelse lige nu. Prøv igen lidt senere.');
    } else if (errorCode === 'auth_callback_error') {
      setError('Linket er udløbet eller ugyldigt. Prøv at logge ind, eller bed om et nyt link.');
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await createClient().auth.signInWithPassword({ email, password });
    if (authError) {
      setError(/fetch|network/i.test(authError.message)
        ? 'Naetwork kan ikke oprette forbindelse lige nu. Prøv igen lidt senere.'
        : 'Forkert e-mail eller adgangskode. Prøv igen.');
      setLoading(false);
      return;
    }

    const requestedPath = new URLSearchParams(window.location.search).get('next');
    const nextPath = safeInternalPath(requestedPath, '/profil');
    router.push(nextPath);
  }

  return (
    <main className="min-h-[calc(100vh-4.75rem)] bg-white">
      <div className="grid min-h-[calc(100vh-4.75rem)] lg:grid-cols-[1fr_520px]">
        <section className="flex flex-col justify-center bg-[#09090b] px-5 py-12 text-white sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-3xl lg:mx-0 lg:ml-auto lg:pr-16">
          <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
          <p className="kicker mb-5 text-white/40">Log ind</p>
          <h1 className="text-4xl font-medium leading-[0.96] text-white text-balance sm:text-5xl md:text-6xl">Fortsæt din karrieresparring.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">Se dine bookinger, administrer din profil og fortsæt der, hvor du slap.</p>
          <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-white/20">
            {[
              ['60 min', 'Fast format'],
              ['DKK 600+', 'Tydelige priser'],
              ['40%+', 'Til kræftsagen'],
            ].map(([value, label]) => (
              <div key={label} className="border-r border-white/20 py-4 pr-3 last:border-r-0 last:pl-3 sm:px-4 sm:first:pl-0">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-white/40">{label}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="flex flex-col justify-center border-l border-gray-200 bg-white px-5 py-12 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-medium text-gray-950">Log ind på Naetwork</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Brug den e-mail, du oprettede kontoen med.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" aria-busy={loading}>
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-gray-700">E-mail</label>
              <input id="login-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field-control" placeholder="dit@eksempel.dk" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label htmlFor="login-password" className="text-sm font-semibold text-gray-700">Adgangskode</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-gray-950">Glemt adgangskode?</Link>
              </div>
              <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="field-control" placeholder="Din adgangskode" />
            </div>

            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={loading} className="button-primary w-full disabled:cursor-wait disabled:opacity-60">
              {loading ? 'Logger ind...' : 'Log ind'}
              {!loading && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-6 border-t border-gray-200 pt-5 text-center text-sm text-gray-500">Har du ikke en konto? <Link href="/signup" className="font-black text-gray-950 underline decoration-gray-300 underline-offset-4">Opret konto</Link></p>
        </section>
      </div>
    </main>
  );
}
