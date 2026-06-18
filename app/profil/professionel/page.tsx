'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function ProfessionalProfilePage() {
  const [data, setData] = useState({
    title: '',
    company: '',
    bio: '',
    industries: [] as string[],
    focus_areas: [] as string[],
    price_dkk: 1200,
    visibility: 'hidden',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('auth_user_id', user.id)
        .single();
      if (!profile || profile.role !== 'professional') {
        router.push('/profil');
        return;
      }
      const { data: prof } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('profile_id', profile.id)
        .maybeSingle();
      if (prof) {
        setData({
          title: prof.title || '',
          company: prof.company || '',
          bio: prof.bio || '',
          industries: prof.industries || [],
          focus_areas: prof.focus_areas || [],
          price_dkk: prof.price_dkk || 1200,
          visibility: prof.visibility || 'hidden',
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
    setSaving(true);
    const { data: { user: u } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', u?.id)
      .single();
    await supabase.from('professional_profiles').upsert({
      profile_id: profile?.id,
      ...data,
      price_dkk: Math.min(1800, Math.max(500, data.price_dkk)),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'profile_id' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] pt-16"><div className="text-gray-400">Indlæser...</div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] pt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[330px_1fr] lg:py-14">
        <aside className="h-fit rounded-2xl border border-gray-900 bg-gray-950 p-6 text-white shadow-2xl shadow-gray-950/10 lg:sticky lg:top-24">
          <Link href="/profil" className="mb-8 inline-flex rounded-full border border-white/10 px-3 py-1.5 text-sm font-semibold text-gray-300 hover:text-white">&larr; Min profil</Link>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">Professional profile</p>
          <h1 className="mt-3 text-3xl font-black leading-none tracking-tight text-white">Gør din erfaring bookbar.</h1>
          <p className="mt-5 text-sm leading-relaxed text-gray-400">Alle professionals tilbyder 60 minutter. Forskellen er din erfaring, dine fokusområder og din pris.</p>
          <div className="mt-8 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-gray-500">Prisramme</p><p className="mt-1 text-lg font-black">DKK 500-1.800</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-gray-500">Format</p><p className="mt-1 text-lg font-black">60 min</p></div>
          </div>
        </aside>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase text-gray-400">Edit profile</p>
            <h1 className="mt-2 text-3xl font-black text-gray-950">Professionel profil</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">Denne profil er synlig for kandidater, når du publicerer den og Naetwork har godkendt den.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-7">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Stillingsbetegnelse</label>
                <input type="text" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Associate Director" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Virksomhed / erfaring</label>
                <input type="text" value={data.company} onChange={e => setData(d => ({ ...d, company: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Goldman Sachs, McKinsey, OpenAI" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Bio <span className="font-normal text-gray-400">({data.bio.length}/500)</span></label>
              <textarea value={data.bio} onChange={e => setData(d => ({ ...d, bio: e.target.value.slice(0, 500) }))} rows={5} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-gray-950" placeholder="Beskriv din baggrund og hvad du kan hjælpe kandidater med i en 60-minutters session..." />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">Brancher</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(ind => (
                  <button key={ind} type="button" onClick={() => setData(d => ({ ...d, industries: toggleArr(d.industries, ind) }))} className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${data.industries.includes(ind) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-950 hover:text-gray-950'}`}>{ind}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">Fokusområder</label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {FOCUS_AREAS.map(st => (
                  <button key={st.type} type="button" onClick={() => setData(d => ({ ...d, focus_areas: toggleArr(d.focus_areas, st.type) }))} className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors ${data.focus_areas.includes(st.type) ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-950'}`}>{st.label}</button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <label className="mb-4 block text-sm font-semibold text-gray-700">Pris pr. 60 min: <span className="font-black text-gray-950">DKK {data.price_dkk.toLocaleString('da-DK')}</span></label>
              <input type="range" min={500} max={1800} step={100} value={data.price_dkk} onChange={e => setData(d => ({ ...d, price_dkk: Number(e.target.value) }))} className="w-full accent-gray-950" />
              <div className="mt-2 flex justify-between text-xs font-medium text-gray-400"><span>DKK 500</span><span>DKK 1.800</span></div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">Synlighed</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setData(d => ({ ...d, visibility: 'hidden' }))} className={`rounded-xl border py-3 text-sm font-semibold transition-colors ${data.visibility === 'hidden' ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}>Skjult</button>
                <button type="button" onClick={() => setData(d => ({ ...d, visibility: 'published' }))} className={`rounded-xl border py-3 text-sm font-semibold transition-colors ${data.visibility === 'published' ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}>Offentliggjort</button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">Din profil skal godkendes af Naetwork, før den er synlig for kandidater.</p>
            </div>

            <button type="submit" disabled={saving} className="w-full rounded-xl bg-gray-950 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
              {saved ? 'Gemt' : saving ? 'Gemmer...' : 'Gem profil'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
