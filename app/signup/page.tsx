'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'business' | 'specialist'>('business');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, user_type: role } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        user_id: data.user.id,
        user_type: role,
        name,
        email,
      });
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] px-4">
        <div className="w-full max-w-sm bg-white border border-[#e5e5e5] rounded-xl p-8 text-center">
          <div className="text-3xl mb-4">✓</div>
          <h2 className="text-[18px] font-semibold text-[#0a0a0a] mb-2">Konto oprettet</h2>
          <p className="text-[14px] text-[#6b7280]">
            Tjek din email og bekræft din konto. Derefter kan du{' '}
            <Link href="/login" className="text-[#0a0a0a] underline">logge ind</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] px-4">
      <div className="w-full maw-w-sm">
        <Link href="/" className="block mb-8 text-center font-semibold text-[15px] text-[#0a0a0a]">
          Naetwork
        </Link>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-8">
          <h1 className="text-[20px] font-semibold text-[#0a0a0a] mb-6">Opret konto</h1>

          {/* Role toggle */}
          <div className="flex rounded-md border border-[#e5e5e5] p-1 mb-5">
            {(['business', 'specialist'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded py-2 text-[13px] font-medium transition-colors ${
                  role === r
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#6b7280] hover:text-[#0a0a0a]'
                }`}
              >
                {r === 'business' ? 'Virksomhed' : 'Specialist'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Navn</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors"
                placeholder="Dit navn"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors"
                placeholder="din@email.dk"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Adgangskode</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#1a1a1a] transition-colors"
                placeholder="Min. 8 tegn"
              />
            </div>
            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#1a1a1a] py-2.5 text-[14px] font-medium text-white hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {loading ? 'Opretter konto…' : 'Opret konto'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-[13px] text-[#6b7280]">
          Har du en konto?{' '}
          <Link href="/login" className="text-[#0a0a0a] font-medium hover:underline">
            Log ind
          </Link>
        </p>
      </div>
    </div>
  );
}
