'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { sendWelcomeProfessional } from '@/lib/email';

const INDUSTRIES = ['AI', 'Banking', 'Management Consulting', 'Private Equity'];
const FOCUS_AREAS = [
  { type: 'cv_linkedin', label: 'CV / LinkedIn' },
  { type: 'application_review', label: 'Application Review' },
  { type: 'interview_prep', label: 'Interview Prep' },
  { type: 'case_prep', label: 'Case Prep' },
  { type: 'banking_technicals', label: 'Banking Technicals' },
  { type: 'consulting_cases', label: 'Consulting Cases' },
  { type: 'pe_investment_case', label: 'PE / Investment Case' },
  { type: 'career_direction', label: 'Career Direction' },
  { type: 'ai_career_strategy', label: 'AI Career Strategy' },
  { type: 'industry_insight', label: 'Industry Insight' },
];

const STEP_LABELS = ['Profil', 'Session', 'Impact', 'Bekræft'];

export default function ProfessionalSignupPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    title: '', company: '', industry: '',
    bio: '', linkedin: '',
    sessionTypes: [] as string[], priceDkk: 1200,
    donatesToCharity: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));
  const toggleSessionType = (t: string) =>
    set('sessionTypes', form.sessionTypes.includes(t) ? form.sessionTypes.filter(x => x !== t) : [...form.sessionTypes, t]);

  function validateStep(nextStep = step): boolean {
    if (nextStep === 1) {
      if (!form.name.trim() || !form.email.trim() || form.password.length < 8 || !form.title.trim() || !form.industry) {
        setError('Udfyld navn, e-mail, adgangskode, titel og industri.');
        return false;
      }
    }
    if (nextStep === 2 && form.sessionTypes.length === 0) {
      setError('Vælg mindst ét fokusområde.');
      return false;
    }
    setError('');
    return true;
  }

  async function createDraftProfessionalProfile(userId: string) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (!profile?.id) return;

    await supabase
      .from('profiles')
      .update({ name: form.name, role: 'professional' })
      .eq('id', profile.id);

    await supabase.from('professional_profiles').upsert({
      profile_id: profile.id,
      title: form.title,
      company: form.company || null,
      bio: form.bio || null,
      industries: form.industry ? [form.industry] : [],
      focus_areas: form.sessionTypes,
      price_dkk: form.priceDkk,
      visibility: 'hidden',
    }, { onConflict: 'profile_id' });
  }

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) return;

    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          role: 'professional',
          title: form.title,
          company: form.company,
          industry: form.industry,
          bio: form.bio,
          sessionTypes: form.sessionTypes,
          priceDkk: form.priceDkk,
          donatesToCharity: form.donatesToCharity,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/profil/professionel`,
      },
    });

    if (authErr || !authData.user) {
      setError(authErr?.message || 'Kunne ikke oprette konto.');
      setLoading(false);
      return;
    }

    if (authData.session) {
      await createDraftProfessionalProfile(authData.user.id).catch(() => undefined);
    }

    await sendWelcomeProfessional({
      email: form.email,
      name: form.name,
      priceDkk: form.priceDkk,
      donatesToCharity: form.donatesToCharity,
    }).catch(() => false);

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 pt-16">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gray-950 text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7l8 6 8-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-black text-gray-950">Bekræft din e-mail</h1>
          <p className="leading-relaxed text-gray-500">
            Vi har sendt en bekræftelsesmail til <strong>{form.email}</strong>. Når du har bekræftet kontoen, kan du færdiggøre og publicere din professionelle profil.
          </p>
          <Link href="/login" className="mt-8 inline-flex rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Tilbage til log ind</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] pt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <aside className="rounded-2xl border border-gray-900 bg-gray-950 p-8 text-white shadow-2xl shadow-gray-950/10 lg:sticky lg:top-24 lg:h-fit">
          <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-cyan-200">For professionals</p>
          <h1 className="text-4xl font-black leading-none tracking-tight text-white text-balance">Gør din erfaring bookbar på Naetwork.</h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-400">
            Opret en kurateret profil, vælg dine fokusområder, og sæt din pris mellem DKK 500 og 1.800 for en 60-minutters session.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">60</p>
              <p className="mt-1 text-[11px] text-gray-500">min</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">500+</p>
              <p className="mt-1 text-[11px] text-gray-500">DKK</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">4</p>
              <p className="mt-1 text-[11px] text-gray-500">felter</p>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-5 grid grid-cols-4 gap-2">
            {STEP_LABELS.map((label, index) => {
              const n = index + 1;
              return (
                <div key={label} className={`rounded-2xl border px-3 py-3 ${n <= step ? 'border-gray-950 bg-white' : 'border-gray-200 bg-white/60'}`}>
                  <p className={`text-xs font-black ${n <= step ? 'text-gray-950' : 'text-gray-400'}`}>0{n}</p>
                  <p className={`mt-1 hidden text-xs font-semibold sm:block ${n <= step ? 'text-gray-700' : 'text-gray-400'}`}>{label}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Step 01</p>
                  <h1 className="mt-2 text-2xl font-black text-gray-950">Grundlæggende information</h1>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Fulde navn</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Mikkel Jensen" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Email</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="mikkel@firma.dk" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Adgangskode</label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Min. 8 tegn" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Jobtitel</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Senior Manager" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Virksomhed (valgfri)</label>
                    <input value={form.company} onChange={e => set('company', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Nordea" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Industri</label>
                  <select value={form.industry} onChange={e => set('industry', e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950">
                    <option value="">Vælg industri</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Step 02</p>
                  <h1 className="mt-2 text-2xl font-black text-gray-950">Fokusområder og pris</h1>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Alle sessioner er 60 minutter. Kandidaten vælger fokus før booking.</p>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">Hvad kan kandidater bruge din session på?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FOCUS_AREAS.map(s => (
                      <button key={s.type} onClick={() => toggleSessionType(s.type)}
                        className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors ${form.sessionTypes.includes(s.type) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-950'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <label className="mb-4 block text-sm font-semibold text-gray-700">Pris pr. 60 min: <span className="font-black text-gray-950">DKK {form.priceDkk.toLocaleString('da-DK')}</span></label>
                  <input type="range" min={500} max={1800} step={100} value={form.priceDkk} onChange={e => set('priceDkk', Number(e.target.value))}
                    className="w-full accent-gray-950" />
                  <div className="mt-2 flex justify-between text-xs font-medium text-gray-400"><span>DKK 500</span><span>DKK 1.800</span></div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Bio (valgfri)</label>
                  <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Fortæl hvad du kan hjælpe med i en 60-minutters session..." />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Step 03</p>
                  <h1 className="mt-2 text-2xl font-black text-gray-950">Impact model</h1>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Du kan vælge om en del af sessionens værdi skal gå videre til Kræftens Bekæmpelse.</p>
                </div>
                <button onClick={() => set('donatesToCharity', !form.donatesToCharity)}
                  className={`w-full rounded-2xl border p-5 text-left transition-colors ${form.donatesToCharity ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white hover:border-gray-950'}`}>
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <div className="mb-1 font-black">Ja, jeg vil aktivere impact</div>
                      <div className={`text-sm ${form.donatesToCharity ? 'text-gray-300' : 'text-gray-500'}`}>Du kan senere vælge præcis model i din profil.</div>
                    </div>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${form.donatesToCharity ? 'border-white bg-white text-gray-950' : 'border-gray-300'}`}>
                      {form.donatesToCharity && <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                  </div>
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Step 04</p>
                  <h1 className="mt-2 text-2xl font-black text-gray-950">Bekræft og opret profil</h1>
                </div>
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  {[
                    ['Navn', form.name],
                    ['Titel', form.title],
                    ['Industri', form.industry],
                    ['Pris', `DKK ${form.priceDkk.toLocaleString('da-DK')}/60 min`],
                    ['Fokusområder', `${form.sessionTypes.length} valgt`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-5 border-b border-gray-100 px-4 py-3 text-sm last:border-b-0">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-right font-semibold text-gray-950">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="mt-8 flex gap-3">
              {step > 1 && <button onClick={() => { setError(''); setStep(s => s - 1); }} className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50">Tilbage</button>}
              {step < 4
                ? <button onClick={() => { if (validateStep(step)) setStep(s => s + 1); }} className="flex-1 rounded-xl bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800">Næste</button>
                : <button onClick={handleSubmit} disabled={loading} className="flex-1 rounded-xl bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50">{loading ? 'Opretter...' : 'Opret profil'}</button>
              }
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">Har du allerede en profil? <Link href="/login" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4">Log ind</Link></p>
        </section>
      </div>
    </main>
  );
}
