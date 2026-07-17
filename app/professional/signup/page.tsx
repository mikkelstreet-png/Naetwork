'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { RevenueSplit } from '@/components/RevenueSplit';
import { CATEGORIES, isCategoryId } from '@/lib/categories';
import {
  CONTRIBUTION_PERCENT,
  PLATFORM_SHARE_PERCENT,
  PRICE_OPTIONS,
  PROFESSIONAL_SHARE_PERCENT,
  formatDkk,
  normalizeLinkedInUrl,
  sessionEconomics,
} from '@/lib/platform';
import { SESSION_TYPES } from '@/lib/sessionTypes';

const STEP_LABELS = ['Profil', 'Session', 'Fordeling', 'Bekræft'];

export default function ProfessionalSignupPage() {
  const [step, setStep] = useState(1);
  const [isInteractive, setIsInteractive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    title: '', company: '', category: '', areas: [] as string[],
    bio: '', linkedin: '',
    sessionTypes: [] as string[], priceDkk: 1200,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setIsInteractive(true);
  }, []);

  const economics = sessionEconomics(form.priceDkk);
  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));
  const toggleSessionType = (t: string) =>
    set('sessionTypes', form.sessionTypes.includes(t) ? form.sessionTypes.filter(x => x !== t) : [...form.sessionTypes, t]);
  const toggleArea = (area: string) =>
    set('areas', form.areas.includes(area) ? form.areas.filter((value) => value !== area) : [...form.areas, area]);

  function validateStep(nextStep = step): boolean {
    if (nextStep === 1) {
      if (!form.name.trim() || !form.email.trim() || form.password.length < 8 || !form.title.trim() || !form.company.trim() || !isCategoryId(form.category) || form.areas.length === 0 || !form.linkedin.trim()) {
        setError('Udfyld navn, e-mail, adgangskode, titel, virksomhed, kategori, mindst ét fagområde og LinkedIn.');
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

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) return;
    if (!normalizeLinkedInUrl(form.linkedin)) {
      setStep(1);
      setError('Indtast et gyldigt LinkedIn-link, der starter med https://.');
      return;
    }
    if (!accepted) {
      setError('Accepter vilkårene og bekræft, at du har læst privatlivspolitikken.');
      return;
    }

    setLoading(true);
    setError('');
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'professional', accepted }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Kontoen kunne ikke oprettes. Kontrollér oplysningerne, og prøv igen.');
      setLoading(false);
      return;
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
    <main className="min-h-screen bg-[#f4f4f0]">
      <div className="mx-auto grid max-w-[82rem] gap-6 px-5 py-8 sm:gap-8 sm:px-8 sm:py-12 lg:grid-cols-[0.88fr_1.12fr] lg:px-12 lg:py-20">
        <aside className="relative overflow-hidden rounded-md border border-gray-900 bg-[#09090b] p-6 text-white shadow-[0_24px_70px_rgba(9,9,11,0.14)] lg:sticky lg:top-24 lg:h-fit lg:p-9">
          <div className="signal-rail absolute inset-x-0 top-0"><span /><span /><span /><span /></div>
          <p className="editorial-label mb-5 text-white/45 sm:mb-7">For professionelle</p>
          <h1 className="text-3xl font-semibold leading-[1.02] text-white text-balance sm:text-5xl">Gør din indsigt fra branchen tilgængelig.</h1>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-gray-400 sm:mt-6 sm:text-sm">
            Vis hvilke situationer din erfaring kan hjælpe med, hvem den er relevant for, og hvad kandidaten konkret kan forvente. Vi gennemgår baggrunden før publicering.
          </p>
          <div className="mt-5 hidden grid-cols-3 gap-3 sm:grid lg:mt-8">
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">60</p>
              <p className="mt-1 text-[11px] text-gray-500">min</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">600+</p>
              <p className="mt-1 text-[11px] text-gray-500">DKK</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
              <p className="text-lg font-black">{CONTRIBUTION_PERCENT}%</p>
              <p className="mt-1 text-[11px] text-gray-500">bidrag</p>
            </div>
          </div>
        </aside>

        <section aria-busy={!isInteractive} data-interactive={isInteractive ? 'true' : 'false'}>
          <div className="mb-4 grid grid-cols-4 gap-1.5 sm:mb-5 sm:gap-2">
            {STEP_LABELS.map((label, index) => {
              const n = index + 1;
              return (
                <div key={label} className={`rounded-md border px-2 py-2.5 sm:px-3 sm:py-3 ${n <= step ? 'border-gray-950 bg-white shadow-sm' : 'border-gray-200 bg-white/60'}`}>
                  <p className={`text-xs font-black ${n <= step ? 'text-gray-950' : 'text-gray-400'}`}>0{n}</p>
                  <p className={`mt-1 block text-[10px] font-semibold leading-tight sm:text-xs ${n <= step ? 'text-gray-700' : 'text-gray-400'}`}>{label}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-[0_20px_60px_rgba(9,9,11,0.07)] sm:p-7 md:p-9">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Trin 01</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-950">Grundlæggende information</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="professional-name" className="mb-1 block text-sm font-semibold text-gray-700">Fulde navn</label>
                    <input id="professional-name" required aria-required="true" disabled={!isInteractive} autoComplete="name" value={form.name} onChange={e => set('name', e.target.value)} className="field-control text-sm" placeholder="Mikkel Jensen" />
                  </div>
                  <div>
                    <label htmlFor="professional-email" className="mb-1 block text-sm font-semibold text-gray-700">E-mail</label>
                    <input id="professional-email" type="email" required aria-required="true" disabled={!isInteractive} autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} className="field-control text-sm" placeholder="mikkel@firma.dk" />
                  </div>
                </div>
                <div>
                  <label htmlFor="professional-password" className="mb-1 block text-sm font-semibold text-gray-700">Adgangskode</label>
                  <input id="professional-password" type="password" required aria-required="true" disabled={!isInteractive} autoComplete="new-password" minLength={8} value={form.password} onChange={e => set('password', e.target.value)} className="field-control text-sm" placeholder="Min. 8 tegn" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="professional-title" className="mb-1 block text-sm font-semibold text-gray-700">Jobtitel</label>
                    <input id="professional-title" required aria-required="true" disabled={!isInteractive} autoComplete="organization-title" value={form.title} onChange={e => set('title', e.target.value)} className="field-control text-sm" placeholder="Senior Manager" />
                  </div>
                  <div>
                    <label htmlFor="professional-company" className="mb-1 block text-sm font-semibold text-gray-700">Virksomhed</label>
                    <input id="professional-company" required aria-required="true" disabled={!isInteractive} autoComplete="organization" value={form.company} onChange={e => set('company', e.target.value)} className="field-control text-sm" placeholder="Nordea" />
                  </div>
                </div>
                <div>
                  <label htmlFor="professional-category" className="mb-1 block text-sm font-semibold text-gray-700">Kategori</label>
                  <select id="professional-category" required aria-required="true" disabled={!isInteractive} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value, areas: [] }))} className="field-control text-sm">
                    <option value="">Vælg kategori</option>
                    {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.id}</option>)}
                  </select>
                </div>
                {isCategoryId(form.category) && (
                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold text-gray-700">Relaterede fagområder</legend>
                    <p className="mb-3 text-xs leading-relaxed text-gray-400">Vælg mindst ét område, hvor din erfaring er konkret og aktuel.</p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.find((category) => category.id === form.category)!.areas.map((area) => (
                        <button key={area} type="button" aria-pressed={form.areas.includes(area)} onClick={() => toggleArea(area)} className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${form.areas.includes(area) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-950 hover:text-gray-950'}`}>{area}</button>
                      ))}
                    </div>
                  </fieldset>
                )}
                <div>
                  <label htmlFor="professional-linkedin" className="mb-1 block text-sm font-semibold text-gray-700">LinkedIn</label>
                  <input id="professional-linkedin" type="url" required aria-required="true" disabled={!isInteractive} inputMode="url" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} className="field-control text-sm" placeholder="https://linkedin.com/in/..." />
                  <p className="mt-1 text-xs text-gray-400">Bruges til at gennemgå din professionelle baggrund.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Trin 02</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">Sessionstyper og pris</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Vælg de konkrete 60-minutters sessioner, hvor din erfaring giver størst værdi.</p>
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-700">Hvilke sessioner tilbyder du?</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {SESSION_TYPES.map((session) => (
                      <button key={session.id} type="button" aria-pressed={form.sessionTypes.includes(session.focusArea)} onClick={() => toggleSessionType(session.focusArea)}
                        className={`rounded-lg border px-4 py-3 text-left transition-colors ${form.sessionTypes.includes(session.focusArea) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-950'}`}>
                        <span className="block text-sm font-semibold">{session.title.da}</span>
                        <span className={`mt-1 block text-xs leading-relaxed ${form.sessionTypes.includes(session.focusArea) ? 'text-white/55' : 'text-gray-400'}`}>{session.outcome.da}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <fieldset className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <legend className="px-1 text-sm font-semibold text-gray-700">Pris pr. 60 minutter, inkl. moms</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PRICE_OPTIONS.map((amount) => (
                      <button key={amount} type="button" aria-pressed={form.priceDkk === amount} onClick={() => set('priceDkk', amount)} className={`rounded-lg border px-3 py-3 text-sm font-black transition-colors ${form.priceDkk === amount ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-950'}`}>
                        DKK {amount.toLocaleString('da-DK')}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">DKK 1.800 kræver særskilt godkendelse som del af profilgennemgangen.</p>
                </fieldset>
                <div>
                  <label htmlFor="professional-bio" className="mb-1 block text-sm font-semibold text-gray-700">Bio (valgfri)</label>
                  <textarea id="professional-bio" value={form.bio} maxLength={500} onChange={e => set('bio', e.target.value)} rows={4} className="field-control resize-none text-sm" placeholder="Fortæl konkret, hvad du kan hjælpe med i en 60-minutters session..." />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">Trin 03</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950">Fast fordeling pr. session</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">Momsen skilles først ud. Derefter fordeles hele sessionsprisen ekskl. moms efter samme model for alle professionelle.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-[#f7f7f4] p-5">
                  <p className="text-sm font-semibold text-gray-700">Fordelingsgrundlag: {formatDkk(economics.netPrice)} ekskl. moms</p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">Kandidatens pris er {formatDkk(economics.candidatePrice)} inkl. moms. De tre andele nedenfor summerer altid til hele nettoprisen.</p>
                </div>
                <RevenueSplit price={form.priceDkk} />
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
                    ['Kategori', form.category],
                    ['Fagområder', form.areas.join(', ')],
                    ['Pris', `${formatDkk(form.priceDkk)} inkl. moms / 60 min`],
                    ['Naetwork', `${PLATFORM_SHARE_PERCENT}% / ${formatDkk(economics.platformShare)}`],
                    ['Kræftens Bekæmpelse', `${CONTRIBUTION_PERCENT}% / ${formatDkk(economics.contribution)}`],
                    ['Din andel', `${PROFESSIONAL_SHARE_PERCENT}% / ${formatDkk(economics.professionalPayout)} før skat`],
                    ['Sessionstyper', `${form.sessionTypes.length} valgt`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-5 border-b border-gray-100 px-4 py-3 text-sm last:border-b-0">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-right font-semibold text-gray-950">{value}</span>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-600">
                  <input type="checkbox" required checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-gray-950" />
                  <span>Jeg accepterer Naetworks <Link href="/terms" className="font-semibold text-gray-950 underline underline-offset-2">vilkår</Link> og bekræfter, at jeg har læst <Link href="/privacy" className="font-semibold text-gray-950 underline underline-offset-2">privatlivspolitikken</Link>.</span>
                </label>
              </div>
            )}

            {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="mt-8 flex gap-3">
              {step > 1 && <button type="button" onClick={() => { setError(''); setStep(s => s - 1); }} className="button-secondary flex-1">Tilbage</button>}
              {step < 4
                ? <button type="button" disabled={!isInteractive} onClick={() => { if (validateStep(step)) setStep(s => s + 1); }} className="button-primary flex-1 disabled:cursor-wait disabled:opacity-70">Næste</button>
                : <button type="button" onClick={handleSubmit} disabled={loading} className="button-primary flex-1 disabled:opacity-50">{loading ? 'Opretter...' : 'Opret profil'}</button>
              }
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">Har du allerede en profil? <Link href="/login" className="font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4">Log ind</Link></p>
        </section>
      </div>
    </main>
  );
}
