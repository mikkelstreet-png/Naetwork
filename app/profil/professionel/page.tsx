'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { MemberNav } from '@/components/MemberNav';
import { AvailabilityManager } from '@/components/AvailabilityManager';
import {
  CONTRIBUTION_OPTIONS,
  FOCUS_AREAS,
  INDUSTRIES,
  PRICE_OPTIONS,
  formatDkk,
  normalizeContributionPercent,
  normalizeLinkedInUrl,
  normalizePrice,
  sessionEconomics,
} from '@/lib/platform';

export default function ProfessionalProfilePage() {
  const [data, setData] = useState({
    title: '',
    company: '',
    bio: '',
    industries: [] as string[],
    focus_areas: [] as string[],
    languages: ['da', 'en'] as string[],
    seniority: 'manager',
    years_experience: 5,
    price_dkk: 1200,
    contribution_percent: 40,
    linkedin_url: '',
    visibility: 'hidden',
    review_status: 'pending',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setError('Kontosystemet svarer ikke. Prøv igen om et øjeblik.');
        setLoadFailed(true);
        setLoading(false);
        return;
      }
      if (!user) { router.push('/login'); return; }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('auth_user_id', user.id)
        .single();
      if (profileError) {
        setError('Din konto kunne ikke indlæses. Prøv igen om et øjeblik.');
        setLoadFailed(true);
        setLoading(false);
        return;
      }
      if (!profile || profile.role !== 'professional') {
        router.push('/profil');
        return;
      }
      const { data: prof, error: professionalError } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('profile_id', profile.id)
        .maybeSingle();
      if (professionalError) {
        setError('Din professionelle profil kunne ikke indlæses. Ingen ændringer er foretaget.');
        setLoadFailed(true);
        setLoading(false);
        return;
      }
      if (prof) {
        setData({
          title: prof.title || '',
          company: prof.company || '',
          bio: prof.bio || '',
          industries: prof.industries || [],
          focus_areas: prof.focus_areas || [],
          languages: prof.languages || ['da', 'en'],
          seniority: prof.seniority || 'manager',
          years_experience: prof.years_experience || 5,
          price_dkk: normalizePrice(prof.price_dkk),
          contribution_percent: normalizeContributionPercent(prof.contribution_percent),
          linkedin_url: prof.linkedin_url || '',
          visibility: prof.visibility || 'hidden',
          review_status: prof.review_status || 'pending',
        });
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleArr(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!data.title.trim() || !data.company.trim() || !data.bio.trim() || !data.linkedin_url.trim() || data.industries.length === 0 || data.focus_areas.length === 0 || data.languages.length === 0) {
      setError('Udfyld titel, virksomhed, bio, LinkedIn, mindst én branche, ét fokusområde og ét sessionssprog.');
      return;
    }
    const linkedinUrl = normalizeLinkedInUrl(data.linkedin_url);
    if (!linkedinUrl) {
      setError('Indtast et gyldigt LinkedIn-link, der starter med https://.');
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { data: { user: u } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', u?.id)
      .single();
    const { error: saveError } = await supabase.from('professional_profiles').upsert({
      profile_id: profile?.id,
      ...data,
      linkedin_url: linkedinUrl,
      price_dkk: normalizePrice(data.price_dkk),
      contribution_percent: normalizeContributionPercent(data.contribution_percent),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id' });
    setSaving(false);
    if (saveError) {
      setError('Profilen kunne ikke gemmes. Prøv igen.');
      return;
    }
    setData((current) => ({ ...current, review_status: 'pending' }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] pt-16"><div className="text-gray-400">Indlæser...</div></main>;
  }

  if (loadFailed) {
    return <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white px-5 py-12"><section className="w-full max-w-lg border-y border-gray-200 py-10 text-center"><h1 className="text-3xl font-black text-gray-950">Profilen kunne ikke indlæses</h1><p role="alert" className="mt-3 text-sm leading-relaxed text-gray-500">{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white">Prøv igen</button></section></main>;
  }

  const economics = sessionEconomics(data.price_dkk, data.contribution_percent);

  return (
    <main className="min-h-screen bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase text-gray-400">Professionel</p>
          <h1 className="mt-3 text-4xl font-black leading-none text-gray-950 md:text-6xl">Din profil.</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">Gør din erfaring, dit fokus og kandidatens konkrete udbytte let at forstå.</p>
        </div>
      </section>

      <MemberNav isProfessional />

      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-7 sm:px-8 md:gap-8 md:py-10 lg:grid-cols-[300px_1fr] lg:py-14">
        <aside className="h-fit border border-gray-900 bg-gray-950 p-5 text-white lg:sticky lg:top-24 lg:p-6">
          <p className="text-xs font-semibold uppercase text-cyan-200">Professionel profil</p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">Gør din erfaring bookbar.</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:mt-5">Alle professionelle tilbyder 60 minutter. Forskellen er din erfaring, dine fokusområder og din pris.</p>
          <div className="mt-8 hidden border-t border-white/15 lg:block">
            {[
              ['Prisvalg', '600 · 900 · 1.200 · 1.800'],
              ['Format', '60 min'],
              ['Gennemgang', data.review_status === 'approved' ? 'Godkendt' : data.review_status === 'rejected' ? 'Afvist' : 'Afventer'],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-white/15 py-4">
                <p className="text-xs text-white/45">{label}</p>
                <p className="mt-1 text-base font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="bg-white p-5 sm:p-7 md:p-9">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase text-gray-400">Rediger profil</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950 sm:text-3xl">Profiloplysninger</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">Denne profil er synlig for kandidater, når du publicerer den og Naetwork har godkendt den.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-7">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="profile-title" className="form-label">Stillingsbetegnelse</label>
                <input id="profile-title" type="text" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} className="field-control" placeholder="Associate Director" />
              </div>
              <div>
                <label htmlFor="profile-company" className="form-label">Virksomhed / erfaring</label>
                <input id="profile-company" type="text" value={data.company} onChange={e => setData(d => ({ ...d, company: e.target.value }))} className="field-control" placeholder="Goldman Sachs, McKinsey, OpenAI" />
              </div>
            </div>

            <div>
              <label htmlFor="profile-bio" className="form-label">Bio <span className="font-normal text-gray-500">({data.bio.length}/500)</span></label>
              <textarea id="profile-bio" value={data.bio} onChange={e => setData(d => ({ ...d, bio: e.target.value.slice(0, 500) }))} rows={5} className="field-control resize-none" placeholder="Beskriv din baggrund og hvad du kan hjælpe kandidater med i en 60-minutters session..." />
            </div>

            <div>
              <label htmlFor="profile-linkedin" className="form-label">LinkedIn</label>
              <input id="profile-linkedin" type="url" value={data.linkedin_url} onChange={e => setData(d => ({ ...d, linkedin_url: e.target.value }))} className="field-control" placeholder="https://linkedin.com/in/..." />
              <p className="form-help">Bruges af Naetwork ved gennemgang og vises ikke offentligt.</p>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">Brancher</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((industry) => (
                  <button key={industry.id} type="button" aria-pressed={data.industries.includes(industry.id)} onClick={() => setData(d => ({ ...d, industries: toggleArr(d.industries, industry.id) }))} className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${data.industries.includes(industry.id) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-950 hover:text-gray-950'}`}>{industry.id}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">Fokusområder</label>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {FOCUS_AREAS.map((focus) => (
                  <button key={focus.id} type="button" aria-pressed={data.focus_areas.includes(focus.id)} onClick={() => setData(d => ({ ...d, focus_areas: toggleArr(d.focus_areas, focus.id) }))} className={`rounded-lg border px-3 py-3 text-left text-sm font-semibold transition-colors ${data.focus_areas.includes(focus.id) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-950'}`}>{focus.da}</button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 border-y border-gray-200 py-6 md:grid-cols-2">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-gray-700">Sessionssprog</legend>
                <div className="flex gap-2">
                  {[['da', 'Dansk'], ['en', 'English']].map(([value, label]) => (
                    <button key={value} type="button" aria-pressed={data.languages.includes(value)} onClick={() => setData((current) => ({ ...current, languages: toggleArr(current.languages, value) }))} className={`rounded-[4px] border px-3 py-2 text-sm font-semibold ${data.languages.includes(value) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-700'}`}>{label}</button>
                  ))}
                </div>
              </fieldset>
              <div className="grid grid-cols-2 gap-3">
                <label><span className="form-label">Senioritet</span><select value={data.seniority} onChange={(event) => setData((current) => ({ ...current, seniority: event.target.value }))} className="field-control"><option value="specialist">Specialist</option><option value="manager">Manager</option><option value="director">Director</option><option value="executive">Executive</option></select></label>
                <label><span className="form-label">Års erfaring</span><input type="number" min={1} max={50} value={data.years_experience} onChange={(event) => setData((current) => ({ ...current, years_experience: Number(event.target.value) }))} className="field-control" /></label>
              </div>
            </div>

            <fieldset className="border-b border-gray-200 pb-6">
              <legend className="pr-3 text-sm font-semibold text-gray-800">Pris pr. 60 minutter, inkl. moms</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PRICE_OPTIONS.map((amount) => (
                  <button key={amount} type="button" aria-pressed={data.price_dkk === amount} onClick={() => setData(d => ({ ...d, price_dkk: amount }))} className={`rounded-[4px] border px-3 py-3 text-sm font-bold transition-colors ${data.price_dkk === amount ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-950'}`}>
                    DKK {amount.toLocaleString('da-DK')}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">DKK 1.800 kræver særskilt godkendelse, før profilen kan publiceres.</p>
            </fieldset>

            <fieldset className="border-b border-gray-200 pb-6">
              <legend className="pr-3 text-sm font-semibold text-gray-800">Bidrag ved en betalt session</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CONTRIBUTION_OPTIONS.map((percentage) => (
                  <button key={percentage} type="button" aria-pressed={data.contribution_percent === percentage} onClick={() => setData(d => ({ ...d, contribution_percent: percentage }))} className={`rounded-[4px] border px-3 py-3 text-sm font-bold transition-colors ${data.contribution_percent === percentage ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-950'}`}>
                    {percentage}%
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">{formatDkk(economics.contribution)} afsættes til støtte. Procenten beregnes af sessionsprisen ekskl. moms.</p>
              <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-gray-200 bg-gray-200 sm:grid-cols-3">
                {[
                  ['Pris ekskl. moms', formatDkk(economics.netPrice)],
                  ['Platform og betaling', formatDkk(economics.platformFee)],
                  ['Forventet udbetaling', `${formatDkk(economics.professionalPayout)} før skat`],
                ].map(([label, value]) => <div key={label} className="bg-white p-4"><dt className="text-[10px] font-black uppercase text-gray-400">{label}</dt><dd className="mt-2 text-sm font-black text-gray-950">{value}</dd></div>)}
              </dl>
            </fieldset>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">Publiceringsvalg</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" aria-pressed={data.visibility === 'hidden'} onClick={() => setData(d => ({ ...d, visibility: 'hidden' }))} className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${data.visibility === 'hidden' ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}>Gem som kladde</button>
                <button type="button" aria-pressed={data.visibility === 'published'} onClick={() => setData(d => ({ ...d, visibility: 'published' }))} className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${data.visibility === 'published' ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}>Send til gennemgang</button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">Profilen bliver først synlig, når den både er sendt til gennemgang og godkendt af Naetwork. Ændringer kræver en ny gennemgang.</p>
            </div>

            {error && <p role="alert" className="notice-error">{error}</p>}

            <button type="submit" disabled={saving} className="button-primary w-full disabled:opacity-50" aria-live="polite">
              {saved ? 'Gemt' : saving ? 'Gemmer...' : 'Gem profil'}
            </button>
          </form>
          <AvailabilityManager />
        </section>
      </div>
    </main>
  );
}
