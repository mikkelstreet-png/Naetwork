'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { accountErrorMessage } from '@/lib/authErrors';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [sessionState, setSessionState] = useState<'checking' | 'ready' | 'invalid'>('checking');
  const router = useRouter();

  useEffect(() => {
    let active = true;
    createClient().auth.getUser().then(({ data }) => {
      if (active) setSessionState(data.user ? 'ready' : 'invalid');
    }).catch(() => {
      if (active) setSessionState('invalid');
    });
    return () => { active = false; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Adgangskoderne er ikke ens.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setError(accountErrorMessage(error, 'Adgangskoden kunne ikke opdateres. Bed om et nyt link, og prøv igen.'));
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push('/profil'), 2000);
    }
  }

  if (sessionState === 'checking') {
    return <main className="min-h-[calc(100vh-4rem)] bg-[#f7f7f4] px-5 py-16 text-center text-sm text-gray-400">Kontrollerer nulstillingslink...</main>;
  }

  if (sessionState === 'invalid') {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f7f7f4] px-6">
        <div className="w-full max-w-md border-y border-gray-200 bg-white py-10 text-center">
          <div className="signal-rail mx-auto mb-7 max-w-24"><span /><span /><span /><span /></div>
          <h1 className="text-3xl font-medium text-gray-950">Linket er udløbet eller ugyldigt</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">Bed om et nyt nulstillingslink for at fortsætte sikkert.</p>
          <Link href="/forgot-password" className="button-primary mt-7">Nyt nulstillingslink</Link>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="flex min-h-[calc(100vh-4.75rem)] items-center justify-center bg-[#f7f7f4] px-5 py-12">
        <div role="status" className="w-full max-w-md border-y border-gray-200 bg-white py-10 text-center">
          <div className="signal-rail mx-auto mb-7 max-w-24"><span /><span /><span /><span /></div>
          <h1 className="mb-3 text-3xl font-medium text-gray-950">Adgangskoden er opdateret</h1>
          <p className="text-gray-500">Du bliver sendt videre til din profil...</p>
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
        <h1 className="text-4xl font-medium leading-none text-gray-950">Ny adgangskode</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">Vælg en ny adgangskode med mindst 8 tegn.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="new-password" className="form-label">Ny adgangskode</label>
            <input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="field-control" placeholder="Mindst 8 tegn" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="form-label">Bekræft adgangskode</label>
            <input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} className="field-control" placeholder="Gentag adgangskoden" />
          </div>
          {error && <p role="alert" className="notice-error">{error}</p>}
          <button type="submit" disabled={loading} className="button-primary w-full disabled:opacity-50">
            {loading ? 'Gemmer...' : 'Gem ny adgangskode'}
          </button>
        </form>
      </div>
    </main>
  );
}
