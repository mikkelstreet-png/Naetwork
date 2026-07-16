'use client';
import { useEffect, useState } from 'react';
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
    const response = await fetch('/api/auth/password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Nulstillingsmailen kunne ikke sendes. Vent et øjeblik, og prøv igen.');
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="flex min-h-[calc(100vh-4.75rem)] items-center justify-center bg-[#f7f7f4] px-5 py-12">
        <div role="status" className="w-full max-w-md border-y border-gray-200 bg-white py-10 text-center">
          <div className="signal-rail mx-auto mb-7 max-w-24"><span /><span /><span /><span /></div>
          <h1 className="mb-3 text-3xl font-medium text-gray-950">Tjek din e-mail</h1>
          <p className="leading-relaxed text-gray-500">Hvis kontoen findes, har vi sendt et nulstillingslink til <strong>{email}</strong>.</p>
          <Link href="/login" className="button-primary mt-8">Tilbage til log ind</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4.75rem)] items-center justify-center bg-[#f7f7f4] px-5 py-12">
      <div className="w-full max-w-md border-y border-gray-200 bg-white px-5 py-9 sm:px-8">
        <Link href="/" className="mb-8 flex w-fit items-center gap-2" aria-label="Naetwork home">
          <span className="brand-mark">N</span>
          <span className="font-['Space_Grotesk'] font-semibold text-gray-950">Naetwork</span>
        </Link>
        <p className="kicker mb-4">Kontosikkerhed</p>
        <h1 className="text-4xl font-medium leading-none text-gray-950">Glemt adgangskode?</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">Skriv din e-mail, så sender vi et sikkert link til at vælge en ny adgangskode.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="recovery-email" className="form-label">E-mail</label>
            <input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="field-control" placeholder="dit@eksempel.dk" />
          </div>
          {error && <p role="alert" className="notice-error">{error}</p>}
          <button type="submit" disabled={loading} className="button-primary w-full disabled:opacity-50">
            {loading ? 'Sender...' : 'Send nulstillingslink'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500"><Link href="/login" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950">Tilbage til log ind</Link></p>
      </div>
    </main>
  );
}
