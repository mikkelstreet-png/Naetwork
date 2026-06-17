'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendWelcomeCandidate, sendWelcomeProfessional } from '@/lib/email';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'professional'>('candidate');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const welcomeEmail = role === 'professional'
        ? sendWelcomeProfessional({ email, name, priceDkk: 300, donatesToCharity: false })
        : sendWelcomeCandidate({ email, name });
      await welcomeEmail.catch(() => false);
      setDone(true);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-4xl">✉️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Bekræft din e-mail</h1>
          <p className="text-gray-500">Vi har sendt dig en bekræftelsesmail til <strong>{email}</strong>. Klik på linket i mailen for at aktivere din konto.</p>
          <Link href="/login" className="mt-8 inline-block text-indigo-600 hover:underline text-sm">Tilbage til log ind</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">Naetwork</Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Opret konto</h1>
        <p className="text-gray-500 mb-8">Kom i gang med Naetwork.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Navn</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Dit fulde navn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="dit@eksempel.dk"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Mindst 8 tegn"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jeg er</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-3 rounded-lg border text-sm font-medium transition-colors ${role === 'candidate' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                Kandidat
              </button>
              <button
                type="button"
                onClick={() => setRole('professional')}
                className={`py-3 rounded-lg border text-sm font-medium transition-colors ${role === 'professional' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
              >
                Professionel
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Opretter konto...' : 'Opret konto'}
          </button>
          <p className="text-xs text-gray-400 text-center">
            Ved at oprette en konto accepterer du vores{' '}
            <Link href="/terms" className="underline">vilkår</Link> og{' '}
            <Link href="/privacy" className="underline">privatlivspolitik</Link>.
          </p>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          Har du allerede en konto?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline">Log ind</Link>
        </p>
      </div>
    </main>
  );
}
