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
        ? sendWelcomeProfessional({ email, name, priceDkk: 1200, donatesToCharity: false })
        : sendWelcomeCandidate({ email, name });
      await welcomeEmail.catch(() => false);
      setDone(true);
    }
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 pt-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gray-950 text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7l8 6 8-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h1 className="mb-3 text-2xl font-black text-gray-950">Bekræft din e-mail</h1>
          <p className="leading-relaxed text-gray-500">Vi har sendt dig en bekræftelsesmail til <strong>{email}</strong>. Klik på linket i mailen for at aktivere din konto.</p>
          <Link href="/login" className="mt-8 inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Tilbage til log ind</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-6 pt-16">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="hidden rounded-2xl border border-gray-900 bg-gray-950 p-8 text-white shadow-2xl shadow-gray-950/10 lg:block">
          <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-cyan-200">Create access</p>
          <h1 className="max-w-lg text-5xl font-black leading-none tracking-tight text-white">Start med et netværk, der faktisk kan svare.</h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-400">Kandidater kan booke 60 minutter med relevante professionals. Professionals kan gøre erfaring bookbar og sætte egen pris.</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {['60 min', 'DKK 500+', '4 felter'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-bold text-white">{item}</div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <Link href="/" className="mb-8 inline-flex items-center gap-2" aria-label="Naetwork home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-[11px] font-black text-white">N</span>
            <span className="font-black tracking-tight text-gray-950">Naetwork</span>
          </Link>
          <h1 className="text-3xl font-black text-gray-950">Opret konto</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Kom i gang med Naetwork. Du kan altid færdiggøre din profil bagefter.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Navn</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Dit fulde navn" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">E-mail</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="dit@eksempel.dk" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
              <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Mindst 8 tegn" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Jeg er</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('candidate')} className={`rounded-xl border py-3 text-sm font-semibold transition-colors ${role === 'candidate' ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-950 hover:text-gray-950'}`}>Kandidat</button>
                <button type="button" onClick={() => setRole('professional')} className={`rounded-xl border py-3 text-sm font-semibold transition-colors ${role === 'professional' ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-950 hover:text-gray-950'}`}>Professionel</button>
              </div>
              {role === 'professional' && (
                <p className="mt-2 text-xs leading-relaxed text-gray-500">Du kan også bruge den udvidede professional onboarding med fokusområder og prisramme.</p>
              )}
            </div>
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
              {loading ? 'Opretter konto...' : 'Opret konto'}
            </button>
            {role === 'professional' && (
              <Link href="/professional/signup" className="block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-950 transition-colors hover:border-gray-950 hover:bg-gray-50">
                Brug professional onboarding
              </Link>
            )}
            <p className="text-center text-xs leading-relaxed text-gray-400">
              Ved at oprette en konto accepterer du vores <Link href="/terms" className="underline decoration-gray-300 underline-offset-4 hover:text-gray-950">vilkår</Link> og <Link href="/privacy" className="underline decoration-gray-300 underline-offset-4 hover:text-gray-950">privatlivspolitik</Link>.
            </p>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">Har du allerede en konto? <Link href="/login" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-950">Log ind</Link></p>
        </section>
      </div>
    </main>
  );
}
