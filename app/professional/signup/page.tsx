'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

const INDUSTRIES = ['Banking', 'Private Equity', 'AI', 'Management Consulting'];
const SESSION_TYPES = [
  { type: 'mock_interview', label: 'Mock Interview' },
  { type: 'cv_review', label: 'CV & LinkedIn' },
  { type: 'informal_chat', label: 'Uformel 1:1' },
  { type: 'career_advice', label: 'Karriereraadgivning' },
];

export default function ProfessionalSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    title: '', company: '', industry: '',
    bio: '', linkedin: '',
    sessionTypes: [] as string[], priceDkk: 500,
    donatesToCharity: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));
  const toggleSessionType = (t: string) =>
    set('sessionTypes', form.sessionTypes.includes(t) ? form.sessionTypes.filter(x => x !== t) : [...form.sessionTypes, t]);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    const supabase = createClient();
    const { data: authData, error: authErr } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (authErr || !authData.user) { setError(authErr?.message || 'Kunne ikke oprette konto.'); setLoading(false); return; }
    const userId = authData.user.id;
    await supabase.from('profiles').insert({ id: userId, email: form.email, full_name: form.name, role: 'professional' });
    const { error: profErr } = await supabase.from('professionals').insert({
      profile_id: userId, name: form.name, title: form.title,
      company: form.company || null, industry: form.industry,
      bio: form.bio || null, linkedin_url: form.linkedin || null,
      session_types: form.sessionTypes, price_dkk: form.priceDkk,
      donates_to_charity: form.donatesToCharity,
    });
    if (profErr) { setError('Profil kunne ikke oprettes. Proev igen.'); setLoading(false); return; }
    router.push('/dashboard');
  };

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-6 py-16">
        <div className="flex gap-1 mb-10">
          {[1,2,3,4].map(n => (
            <div key={n} className={`h-1 flex-1 rounded-full ${n <= step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold text-gray-900">Grundlaegende information</h1>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fulde navn</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" placeholder="Mikkel Jensen" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" placeholder="mikkel@firma.dk" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adgangskode</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" placeholder="Min 8 tegn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jobtitel</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" placeholder="Senior Manager" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Virksomhed (valgfri)</label>
                <input value={form.company} onChange={e => set('company', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600" placeholder="Nordea" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industri</label>
                <select value={form.industry} onChange={e => set('industry', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 bg-white">
                  <option value="">Vælg industri</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h1 className="text-xl font-bold text-gray-900">Session-typer og pris</h1>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Hvad tilbyder du?</label>
                <div className="grid grid-cols-2 gap-2">
                  {SESSION_TYPES.map(s => (
                    <button key={s.type} onClick={() => toggleSessionType(s.type)}
                      className={`text-sm font-medium px-4 py-3 rounded-xl border transition-colors ${form.sessionTypes.includes(s.type) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Pris pr. session: <span className="font-bold text-gray-900">DKK {form.priceDkk.toLocaleString('da-DK')}</span></label>
                <input type="range" min={300} max={2000} step={100} value={form.priceDkk} onChange={e => set('priceDkk', Number(e.target.value))}
                  className="w-full accent-indigo-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>DKK 300</span><span>DKK 2.000</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (valgfri)</label>
                <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 resize-none" placeholder="Fortael hvad du kan hjaelpe med..." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h1 className="text-xl font-bold text-gray-900">Donation til velgorenhed</h1>
              <p className="text-gray-500 text-sm">Naetwork giver dig mulighed for at donere en del af platformsgebyret til Kraeftens Bekaempelse. Hvis du vaelger dette, reduceres dit platformsgebyr fra 15% til 7,5%.</p>
              <button onClick={() => set('donatesToCharity', !form.donatesToCharity)}
                className={`w-full text-left border rounded-2xl p-5 transition-colors ${form.donatesToCharity ? 'border-rose-300 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Ja, jeg vil donere</div>
                    <div className="text-sm text-gray-500">7,5% gebyr (i stedet for 15%). Halvdelen gaar til Kraeftens Bekaempelse.</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${form.donatesToCharity ? 'border-rose-500 bg-rose-500' : 'border-gray-300'}`}>
                    {form.donatesToCharity && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold text-gray-900">Bekraeft og opret profil</h1>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Navn</span><span className="font-medium">{form.name}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Titel</span><span className="font-medium">{form.title}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Industri</span><span className="font-medium">{form.industry}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Pris</span><span className="font-medium">DKK {form.priceDkk.toLocaleString('da-DK')}/session</span></div>
                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Platformsgebyr</span><span className="font-medium">{form.donatesToCharity ? '7,5% (donerer)' : '15%'}</span></div>
                <div className="flex justify-between py-2"><span className="text-gray-500">Sessions</span><span className="font-medium">{form.sessionTypes.length} valgt</span></div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">Tilbage</button>}
            {step < 4
              ? <button onClick={() => setStep(s => s + 1)} className="flex-1 bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition-colors">Naeste</button>
              : <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">{loading ? 'Opretter...' : 'Opret profil'}</button>
            }
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">Har du allerede en profil? <Link href="/login" className="text-indigo-600 hover:underline">Log ind</Link></p>
      </div>
    </main>
  );
}
