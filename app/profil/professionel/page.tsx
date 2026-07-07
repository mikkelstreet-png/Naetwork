'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { MemberNav } from '@/components/MemberNav';
import { CONTRIBUTION_MAX, CONTRIBUTION_MIN, FOCUS_AREAS, INDUSTRIES, PRICE_OPTIONS, normalizePrice } from '@/lib/platform';

export default function ProfessionalProfilePage() {
  const [data, setData] = useState({
    title: '',
    company: '',
    bio: '',
    industries: [] as string[],
    focus_areas: [] as string[],
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
          price_dkk: normalizePrice(prof.price_dkk),
          contribution_percent: prof.contribution_percent || 40,
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
    if (!data.title.trim() || !data.company.trim() || !data.bio.trim() || !data.linkedin_url.trim() || data.industries.length === 0 || data.focus_areas.length === 0) {
      setError('Udfyld titel, virksomhed, bio, LinkedIn, mindst én branche og mindst ét fokusområde.');
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
      price_dkk: normalizePrice(data.price_dkk),
      contribution_percent: Math.min(CONTRIBUTION_MAX, Math.max(CONTRIBUTION_MIN, data.contribution_percent)),
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

      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-7 sm:px-8 md:gap-8 md:py-10 lg:grid-cols-[330px_1fr] lg:py-14">
        <aside className="h-fit border border-gray-900 bg-gray-950 p-5 text-white lg:sticky lg:top-24 lg:p-6">
          <p className="text-xs font-semibold uppercase text-cyan-200">Professionel profil</p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">Gør din erfaring bookbar.</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:mt-5">Alle professionelle tilbyder 60 minutter. Forskellen er din erfaring, dine fokusområder og din pris.</p>
          <div className="mt-8 hidden space-y-3 lg:block">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-gray-500">Prisvalg</p><p className="mt-1 text-lg font-black">600 · 900 · 1.200 · 1.800</p></div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-gray-500">Format</p><p className="mt-1 text-lg font-black">60 min</p></div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-gray-500">Gennemgang</p><p className="mt-1 text-lg font-black">{data.review_status === 'approved' ? 'Godkendt' : data.review_status === 'rejected' ? 'Afvist' : 'Afventer'}</p></div>
          </div>
        </aside>

        <section className="border border-gray-200 bg-white p-5 sm:p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase text-gray-400">Rediger profil</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950 sm:text-3xl">Profiloplysninger</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">Denne profil er synlig for kandidater, når du publicerer den og Naetwork har godkendt den.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-7">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="profile-title" className="mb-1 block text-sm font-semibold text-gray-700">Stillingsbetegnelse</label>
                <input id="profile-title" type="text" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Associate Director" />
              </div>
              <div>
                <label htmlFor="profile-company" className="mb-1 block text-sm font-semibold text-gray-700">Virksomhed / erfaring</label>
                <input id="profile-company" type="text" value={data.company} onChange={e => setData(d => ({ ...d, company: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Goldman Sachs, McKinsey, OpenAI" />
              </div>
            </div>

            <div>
              <label htmlFor="profile-bio" className="mb-1 block text-sm font-semibold text-gray-700">Bio <span className="font-normal text-gray-400">({data.bio.length}/500)</span></label>
              <textarea id="profile-bio" value={data.bio} onChange={e => setData(d => ({ ...d, bio: e.target.value.slice(0, 500) }))} rows={5} className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Beskriv din baggrund og hvad du kan hjælpe kandidater med i en 60-minutters session..." />
            </div>

            <div>
              <label htmlFor="profile-linkedin" className="mb-1 block text-sm font-semibold text-gray-700">LinkedIn</label>
              <input id="profile-linkedin" type="url" value={data.linkedin_url} onChange={e => setData(d => ({ ...d, linkedin_url: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="https://linkedin.com/in/..." />
              <p className="mt-1 text-xs text-gray-400">Bruges af Naetwork ved gennemgang og vises ikke offentligt.</p>
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

            <fieldset className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <legend className="px-1 text-sm font-semibold text-gray-700">Pris pr. 60 minutter</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PRICE_OPTIONS.map((amount) => (
                  <button key={amount} type="button" aria-pressed={data.price_dkk === amount} onClick={() => setData(d => ({ ...d, price_dkk: amount }))} className={`rounded-lg border px-3 py-3 text-sm font-black transition-colors ${data.price_dkk === amount ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-950'}`}>
                    DKK {amount.toLocaleString('da-DK')}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <label htmlFor="profile-contribution" className="mb-4 block text-sm font-semibold text-gray-700">Bidrag ved en betalt session: <span className="font-black text-gray-950">{data.contribution_percent}% / DKK {Math.round(data.price_dkk * data.contribution_percent / 100).toLocaleString('da-DK')}</span></label>
              <input id="profile-contribution" type="range" min={CONTRIBUTION_MIN} max={CONTRIBUTION_MAX} step={5} value={data.contribution_percent} onChange={e => setData(d => ({ ...d, contribution_percent: Number(e.target.value) }))} className="w-full accent-gray-950" />
              <div className="mt-2 flex justify-between text-xs font-medium text-gray-400"><span>40%</span><span>90%</span></div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">Publiceringsvalg</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" aria-pressed={data.visibility === 'hidden'} onClick={() => setData(d => ({ ...d, visibility: 'hidden' }))} className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${data.visibility === 'hidden' ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}>Gem som kladde</button>
                <button type="button" aria-pressed={data.visibility === 'published'} onClick={() => setData(d => ({ ...d, visibility: 'published' }))} className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${data.visibility === 'published' ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}>Send til gennemgang</button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">Profilen bliver først synlig, når den både er sendt til gennemgang og godkendt af Naetwork. Ændringer kræver en ny gennemgang.</p>
            </div>

            {error && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={saving} className="w-full rounded-lg bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
              {saved ? 'Gemt' : saving ? 'Gemmer...' : 'Gem profil'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
