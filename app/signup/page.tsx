'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PRIVACY_VERSION, TERMS_VERSION } from '@/lib/legal';

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
      setError('Accepter vilkår og privatlivspolitik for at oprette en konto.');
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
          privacyVersion: PRIVACY_VERSION,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/match`,
      },
    });

    if (authError) {
      setError(/fetch|network/i.test(authError.message)
        ? 'Naetwork kan ikke oprette forbindelse lige nu. Prøv igen lidt senere.'
        : authError.message);
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
    <main className="min-h-[calc(100vh-4rem)] bg-white px-5 py-12 sm:px-8 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_430px] lg:items-start">
        <section className="max-w-2xl pt-2 lg:pt-10">
          <p className="mb-4 text-xs font-black uppercase text-gray-400">Opret konto</p>
          <h1 className="text-4xl font-black leading-[0.96] text-gray-950 text-balance sm:text-5xl md:text-6xl">Find den erfaring, du mangler adgang til.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">Opret en kandidatkonto for at sende bookinganmodninger og samle dine sessioner ét sted.</p>
          <div className="mt-10 border-t border-gray-200 pt-5">
            <p className="text-sm font-semibold text-gray-500">Vil du tilbyde sparring?</p>
            <Link href="/professional/signup" className="mt-2 inline-flex items-center gap-2 text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">Ansøg som professionel <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="border border-gray-200 bg-[#f7f7f4] p-5 sm:p-7">
          <h2 className="text-2xl font-black text-gray-950">Opret kandidatkonto</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Det tager under ét minut.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold text-gray-700">Fulde navn</label>
              <input id="signup-name" type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Dit fulde navn" />
            </div>
            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-gray-700">E-mail</label>
              <input id="signup-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="dit@eksempel.dk" />
            </div>
            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-gray-700">Adgangskode</label>
              <input id="signup-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Mindst 8 tegn" />
            </div>

            <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
              <input type="checkbox" required checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-gray-950" />
              <span>Jeg accepterer Naetworks <Link href="/terms" className="font-semibold text-gray-950 underline underline-offset-2">vilkår</Link> og <Link href="/privacy" className="font-semibold text-gray-950 underline underline-offset-2">privatlivspolitik</Link>.</span>
            </label>

            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60">
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
