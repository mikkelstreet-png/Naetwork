'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Udfyld alle felter.'); return; }
    setSubmitting(true);
    setError('');

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError || !data.user) {
      setError(authError?.message ?? 'Kunne ikke oprette konto.');
      setSubmitting(false);
      return;
    }

    await supabase.from('profiles').insert({
      user_id: data.user.id,
      user_type: 'candidate',
      name,
      email,
    });

    router.push('/professionals');
  };

  return (
    <main className="pt-16">
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Opret konto</h1>
        <p className="text-gray-500 mb-8">Book karrieresessioner med erfarne professionelle.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Navn</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Dit navn"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="din@email.dk"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Adgangskode</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mindst 8 tegn"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-800 text-white font-medium py-3 rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Opretter konto...' : 'Opret konto'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Har du allerede en konto?{' '}
          <Link href="/login" className="text-green-800 hover:underline">Log ind</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">Er du professionel?</p>
          <Link href="/professional/signup" className="text-sm text-green-800 hover:underline">
            Opret professionel profil →
          </Link>
        </div>
      </div>
    </main>
  );
}
