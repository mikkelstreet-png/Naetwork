'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail } from 'lucide-react';
import { CONTRIBUTION_MAX, CONTRIBUTION_MIN, FOCUS_AREAS, INDUSTRIES, PRICE_MAX, PRICE_MIN } from '@/lib/platform';
import { PRIVACY_VERSION, TERMS_VERSION } from '@/lib/legal';

const STEP_LABELS = ['Profil', 'Session', 'Bidrag', 'Bekræft'];

export default function ProfessionalSignupPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    title: '', company: '', industry: '',
    bio: '', linkedin: '',
    sessionTypes: [] as string[], priceDkk: 1200,
    contributionPercent: 40,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const estimatedContribution = Math.round(form.priceDkk * (form.contributionPercent / 100));
  const estimatedProfessionalShare = form.priceDkk - estimatedContribution;
  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));
  const toggleSessionType = (t: string) =>
    set('sessionTypes', form.sessionTypes.includes(t) ? form.sessionTypes.filter(x => x !== t) : [...form.sessionTypes, t]);

  function validateStep(nextStep = step): boolean {
    if (nextStep === 1) {
      if (!form.name.trim() || !form.email.trim() || form.password.length < 8 || !form.title.trim() || !form.company.trim() || !form.industry || !form.linkedin.trim()) {
        setError('Udfyld navn, e-mail, adgangskode, titel, virksomhed, industri og LinkedIn.');
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
      .update({ name: form.name })
      .eq('id', profile.id);

    await supabase.from('professional_profiles').upsert({
      profile_id: profile.id,
      title: form.title,
      company: form.company || null,
      bio: form.bio || null,
      industries: form.industry ? [form.industry] : [],
      focus_areas: form.sessionTypes,
      price_dkk: form.priceDkk,
      linkedin_url: form.linkedin,
      contribution_percent: form.contributionPercent,
      review_status: 'pending',
      visibility: 'hidden',
    }, { onConflict: 'profile_id' });
  }

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) return;
    if (!accepted) {
      setError('Accepter vilkår og privatlivspolitik for at oprette profilen.');
      return;
    }

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
          linkedin: form.linkedin,
          sessionTypes: form.sessionTypes,
          priceDkk: form.priceDkk,
          donatesToCharity: true,
          contributionPercent: form.contributionPercent,
          termsAcceptedAt: new Date().toISOString(),
          termsVersion: TERMS_VERSION,
          privacyVersion: PRIVACY_VERSION,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/profil/professionel`,
      },
    });

    if (authErr || !authData.user) {
      setError(authErr && /fetch|network/i.test(authErr.message)
        ? 'Naetwork kan ikke oprette forbindelse lige nu. Prøv igen lidt senere.'
        : authErr?.message || 'Kunne ikke oprette konto.');
      setLoading(false);
      return;
    }

    if (authData.session) {
      await createDraftProfessionalProfile(authData.user.id).catch(() => undefined);
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f7f7f4] px-5 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gray-950 text-white">
            <Mail size={24} aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-2xl font-black text-gray-950">Bekræft din e-mail</h1>
          <p className="leading-relaxed text-gray-500">
            Vi har sendt en bekræftelsesmail til <strong>{form.email}</strong>. Når kontoen er bekræftet, gennemgår vi profilen, før den kan publiceres.
          </p>
          <Link href="/login" className="mt-8 inline-flex rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Tilbage til log ind</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
        <aside className="rounded-lg border border-gray-900 bg-gray-950 p-5 text-white lg:sticky lg:top-24 lg:h-fit lg:p-8">
          <p className="mb-3 text-[11px] font-semibold uppercase text-cyan-200 sm:mb-6 sm:text-xs">For professionelle</p>
          <h1 className="text-2xl font-black leading-tight text-white text-balance sm:text-4xl sm:leading-none">Gør din erfaring bookbar med mening.</h1>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-gray-400 sm:mt-6 sm:text-sm">
            Ansøg med din nuværende rolle, virksomhed og LinkedIn. Profiler gennemgås før publicering. Du vælger selv fokus, pris og et konkret bidrag mellem 40% og 90%.
          </p>
          <div className="mt-5 hidden grid-cols-3 gap-3 sm:grid lg:mt-8">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">60</p>
              <p className="mt-1 text-[11px] text-gray-500">min</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">600+</p>
              <p className="mt-1 text-[11px] text-gray-500">DKK</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">40-90%</p>
              <p className="mt-1 text-[11px] text-gray-500">bidrag</p>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-4 grid grid-cols-4 gap-1.5 sm:mb-5 sm:gap-2">
            {STEP_LABELS.map((label, index) => {
              const n = index + 1;
              return (
                <div key={label} className={`rounded-lg border px-2 py-2.5 sm:px-3 sm:py-3 ${n <= step ? 'border-gray-950 bg-white' : 'border-gray-200 bg-white/60'}`}>
                  <p className={`text-xs font-black ${n <= step ? 'text-gray-950' : 'text-gray-400'}`}>0{n}</p>
                  <p className={`mt-1 block text-[10px] font-semibold leading-tight sm:text-xs ${n <= step ? 'text-gray-700' : 'text-gray-400'}`}>{label}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Trin 01</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">Grundlæggende information</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="professional-name" className="mb-1 block text-sm font-semibold text-gray-700">Fulde navn</label>
                    <input id="professional-name" autoComplete="name" value={form.name} onChange={e => set('name', e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Mikkel Jensen" />
                  </div>
                  <div>
                    <label htmlFor="professional-email" className="mb-1 block text-sm font-semibold text-gray-700">E-mail</label>
                    <input id="professional-email" type="email" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="mikkel@firma.dk" />
                  </div>
                </div>
                <div>
                  <label htmlFor="professional-password" className="mb-1 block text-sm font-semibold text-gray-700">Adgangskode</label>
                  <input id="professional-password" type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={e => set('password', e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Min. 8 tegn" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="professional-title" className="mb-1 block text-sm font-semibold text-gray-700">Jobtitel</label>
                    <input id="professional-title" value={form.title} onChange={e => set('title', e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Senior Manager" />
                  </div>
                  <div>
                    <label htmlFor="professional-company" className="mb-1 block text-sm font-semibold text-gray-700">Virksomhed</label>
                    <input id="professional-company" value={form.company} onChange={e => set('company', e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Nordea" />
                  </div>
                </div>
                <div>
                  <label htmlFor="professional-industry" className="mb-1 block text-sm font-semibold text-gray-700">Industri</label>
                  <select id="professional-industry" value={form.industry} onChange={e => set('industry', e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950">
                    <option value="">Vælg industri</option>
                    {INDUSTRIES.map((industry) => <option key={industry.id} value={industry.id}>{industry.id}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="professional-linkedin" className="mb-1 block text-sm font-semibold text-gray-700">LinkedIn</label>
                  <input id="professional-linkedin" type="url" inputMode="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="https://linkedin.com/in/..." />
                  <p className="mt-1 text-xs text-gray-400">Bruges til at gennemgå din professionelle baggrund.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Trin 02</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">Fokusområder og pris</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Alle sessioner er 60 minutter. Kandidaten vælger fokus før booking.</p>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">Hvad kan kandidater bruge din session på?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FOCUS_AREAS.map((focus) => (
                      <button key={focus.id} type="button" aria-pressed={form.sessionTypes.includes(focus.id)} onClick={() => toggleSessionType(focus.id)}
                        className={`rounded-lg border px-3 py-3 text-left text-sm font-semibold transition-colors ${form.sessionTypes.includes(focus.id) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-950'}`}>
                        {focus.da}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <label htmlFor="professional-price" className="mb-4 block text-sm font-semibold text-gray-700">Pris pr. 60 min: <span className="font-black text-gray-950">DKK {form.priceDkk.toLocaleString('da-DK')}</span></label>
                  <input id="professional-price" type="range" min={PRICE_MIN} max={PRICE_MAX} step={100} value={form.priceDkk} onChange={e => set('priceDkk', Number(e.target.value))}
                    className="w-full accent-gray-950" />
                  <div className="mt-2 flex justify-between text-xs font-medium text-gray-400"><span>DKK 600</span><span>DKK 1.800</span></div>
                </div>
                <div>
                  <label htmlFor="professional-bio" className="mb-1 block text-sm font-semibold text-gray-700">Bio (valgfri)</label>
                  <textarea id="professional-bio" value={form.bio} maxLength={500} onChange={e => set('bio', e.target.value)} rows={4} className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-gray-950" placeholder="Fortæl konkret, hvad du kan hjælpe med i en 60-minutters session..." />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Trin 03</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">Bidrag pr. session</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Hver betalt session bidrager med minimum 40% og op til 90% af sessionens pris til Kræftens Bekæmpelse.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-[#f7f7f4] p-5">
                  <label htmlFor="professional-contribution" className="mb-4 block text-sm font-semibold text-gray-700">Bidrag pr. betalt session: <span className="font-black text-gray-950">{form.contributionPercent}%</span></label>
                  <input id="professional-contribution" type="range" min={CONTRIBUTION_MIN} max={CONTRIBUTION_MAX} step={5} value={form.contributionPercent} onChange={e => set('contributionPercent', Number(e.target.value))}
                    className="w-full accent-gray-950" />
                  <div className="mt-2 flex justify-between text-xs font-medium text-gray-400"><span>40%</span><span>90%</span></div>
                </div>
                <div className="grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-2">
                  <div className="bg-white p-5">
                    <p className="text-xs font-black uppercase text-gray-400">Til Kræftens Bekæmpelse</p>
                    <p className="mt-4 text-3xl font-black text-gray-950">DKK {estimatedContribution.toLocaleString('da-DK')}</p>
                    <p className="mt-1 text-sm text-gray-500">Estimat pr. betalt session</p>
                  </div>
                  <div className="bg-white p-5">
                    <p className="text-xs font-black uppercase text-gray-400">Din andel</p>
                    <p className="mt-4 text-3xl font-black text-gray-950">DKK {estimatedProfessionalShare.toLocaleString('da-DK')}</p>
                    <p className="mt-1 text-sm text-gray-500">Før eventuelle gebyrer</p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Trin 04</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">Bekræft og opret profil</h2>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  {[
                    ['Navn', form.name],
                    ['Titel', form.title],
                    ['Industri', form.industry],
                    ['Pris', `DKK ${form.priceDkk.toLocaleString('da-DK')}/60 min`],
                    ['Bidrag', `${form.contributionPercent}% / ca. DKK ${estimatedContribution.toLocaleString('da-DK')}`],
                    ['Fokusområder', `${form.sessionTypes.length} valgt`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-5 border-b border-gray-100 px-4 py-3 text-sm last:border-b-0">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-right font-semibold text-gray-950">{value}</span>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                  <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-gray-950" />
                  <span>Jeg accepterer Naetworks <Link href="/terms" className="font-semibold text-gray-950 underline underline-offset-2">vilkår</Link> og <Link href="/privacy" className="font-semibold text-gray-950 underline underline-offset-2">privatlivspolitik</Link>.</span>
                </label>
              </div>
            )}

            {error && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="mt-8 flex gap-3">
              {step > 1 && <button onClick={() => { setError(''); setStep(s => s - 1); }} className="flex-1 rounded-lg border border-gray-200 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50">Tilbage</button>}
              {step < 4
                ? <button onClick={() => { if (validateStep(step)) setStep(s => s + 1); }} className="flex-1 rounded-lg bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800">Næste</button>
                : <button onClick={handleSubmit} disabled={loading} className="flex-1 rounded-lg bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50">{loading ? 'Opretter...' : 'Opret profil'}</button>
              }
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">Har du allerede en profil? <Link href="/login" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4">Log ind</Link></p>
        </section>
      </div>
    </main>
  );
}
