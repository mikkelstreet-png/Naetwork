'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'invalid_link') {
      setError('Nulstillingslinket er udløbet eller allerede brugt. Bed om et nyt link.');
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (resetError) {
      setError('Nulstillingsmailen kunne ikke sendes. Vent et øjeblik, og prøv igen.');
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 pt-16">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-black text-gray-950">Tjek din e-mail</h1>
          <p className="leading-relaxed text-gray-500">Hvis kontoen findes, har vi sendt et nulstillingslink til <strong>{email}</strong>.</p>
          <Link href="/login" className="mt-8 inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Tilbage til log ind</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 pt-16">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2" aria-label="Naetwork home">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-[11px] font-black text-white">N</span>
          <span className="font-black text-gray-950">Naetwork</span>
        </Link>
        <h1 className="text-3xl font-black text-gray-950">Glemt password?</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">Skriv din e-mail, så sender vi et link til at nulstille dit password.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="recovery-email" className="mb-1 block text-sm font-semibold text-gray-700">E-mail</label>
            <input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="dit@eksempel.dk" />
          </div>
          {error && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Sender...' : 'Send nulstillingslink'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500"><Link href="/login" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950">Tilbage til log ind</Link></p>
      </div>
    </main>
  );
}
