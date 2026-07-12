'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PRIVACY_VERSION, TERMS_VERSION } from '@/lib/legal';
import { accountErrorMessage } from '@/lib/authErrors';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!accepted) {
      setError('Accepter vilkårene og bekræft, at du har læst privatlivspolitikken.');
      setLoading(false);
      return;
    }

    const { error: authError } = await createClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.trim(),
          role: 'candidate',
          termsAcceptedAt: new Date().toISOString(),
          termsVersion: TERMS_VERSION,
          privacyNoticedAt: new Date().toISOString(),
          privacyVersion: PRIVACY_VERSION,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/match`,
      },
    });

    if (authError) {
      setError(accountErrorMessage(authError, 'Kontoen kunne ikke oprettes. Kontrollér oplysningerne, og prøv igen.'));
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white px-5 py-12 sm:px-8">
        <section className="w-full max-w-lg border-y border-gray-200 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-950 text-white"><Mail size={20} aria-hidden="true" /></div>
          <h1 className="mt-6 text-3xl font-black text-gray-950">Bekræft din e-mail</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">Vi har sendt et bekræftelseslink til <strong className="text-gray-950">{email}</strong>. Linket aktiverer din konto og fører dig videre til at finde det rette fokus.</p>
          <Link href="/login" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">Til log ind <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4.75rem)] bg-white">
      <div className="grid min-h-[calc(100vh-4.75rem)] lg:grid-cols-[1fr_520px]">
        <section className="flex flex-col justify-center bg-[#09090b] px-5 py-12 text-white sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-3xl lg:mx-0 lg:ml-auto lg:pr-16">
          <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
          <p className="kicker mb-5 text-white/40">Opret konto</p>
          <h1 className="text-4xl font-medium leading-[0.96] text-white text-balance sm:text-5xl md:text-6xl">Find den erfaring, du mangler adgang til.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">Opret en kandidatkonto for at sende bookinganmodninger og samle dine sessioner ét sted.</p>
          <div className="mt-10 border-t border-white/20 pt-5">
            <p className="text-sm font-semibold text-white/40">Vil du tilbyde sparring?</p>
            <Link href="/professional/signup" className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-white/30 underline-offset-4">Ansøg som professionel <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          </div>
        </section>

        <section className="flex flex-col justify-center border-l border-gray-200 bg-white px-5 py-12 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-medium text-gray-950">Opret kandidatkonto</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Det tager under ét minut.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" aria-busy={loading}>
            <div>
              <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold text-gray-700">Fulde navn</label>
              <input id="signup-name" type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className="field-control" placeholder="Dit fulde navn" />
            </div>
            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-gray-700">E-mail</label>
              <input id="signup-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field-control" placeholder="dit@eksempel.dk" />
            </div>
            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-gray-700">Adgangskode</label>
              <input id="signup-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="field-control" placeholder="Mindst 8 tegn" />
            </div>

            <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
              <input type="checkbox" required checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-gray-950" />
              <span>Jeg accepterer Naetworks <Link href="/terms" className="font-semibold text-gray-950 underline underline-offset-2">vilkår</Link> og bekræfter, at jeg har læst <Link href="/privacy" className="font-semibold text-gray-950 underline underline-offset-2">privatlivspolitikken</Link>.</span>
            </label>

            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={loading} className="button-primary w-full disabled:cursor-wait disabled:opacity-60">
              {loading ? 'Opretter konto...' : 'Opret konto'}
              {!loading && <ArrowRight size={16} aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-5 border-t border-gray-200 pt-5 text-center text-sm text-gray-500">Har du allerede en konto? <Link href="/login" className="font-black text-gray-950 underline decoration-gray-300 underline-offset-4">Log ind</Link></p>
        </section>
      </div>
    </main>
  );
}
