'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AI_CATEGORIES, PROJECT_SIZE_OPTIONS, AVAILABILITY_OPTIONS } from '@/lib/constants';

export default function SpecialistProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    role_title: '',
    ai_specialty: '',
    categories: [] as string[],
    typical_project_size: PROJECT_SIZE_OPTIONS[0],
    availability: AVAILABILITY_OPTIONS[0],
    short_bio: '',
    email: '',
    linkedin_or_website: '',
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      const { data } = await supabase.from('specialists').select('*').eq('user_id', session.user.id).maybeSingle();
      if (data) {
        setForm({
          name: data.name ?? '',
          role_title: data.role_title ?? '',
          ai_specialty: data.ai_specialty ?? '',
          categories: data.categories ?? [],
          typical_project_size: data.typical_project_size ?? PROJECT_SIZE_OPTIONS[0],
          availability: data.availability ?? AVAILABILITY_OPTIONS[0],
          short_bio: data.short_bio ?? '',
          email: data.email ?? '',
          linkedin_or_website: data.linkedin_or_website ?? '',
        });
      } else {
        setForm((f) => ({ ...f, email: session.user.email ?? '' }));
      }
    });
  }, [router]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleCategory(cat: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/login'); return; }
    const { error: err } = await supabase.from('specialists').upsert({ ...form, user_id: session.user.id }, { onConflict: 'user_id' });
    if (err) { setError('Der opstod en fejl. Prøv igen.'); }
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setLoading(false);
  }

  const inp = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-[14px] text-[#0a0a0a] outline-none focus:border-[#1a1a1a] transition-colors";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f9f9f9]">
        <div className="wrap py-10 max-w-2xl">
          <h1 className="text-[22px] font-semibold text-[#0a0a0a] mb-2">Specialistprofil</h1>
          <p className="text-[14px] text-[#6b7280] mb-8">Din profil er synlig for virksomheder, hvis du melder interesse i et projekt.</p>
          <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5e5] rounded-xl p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Navn</label>
              <input required type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className={inp} placeholder="Dit fulde navn" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Rolle / titel</label>
              <input required type="text" value={form.role_title} onChange={(e) => update('role_title', e.target.value)} className={inp} placeholder="AI Consultant, Automation Engineer..." />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">AI-speciale</label>
              <input required type="text" value={form.ai_specialty} onChange={(e) => update('ai_specialty', e.target.value)} className={inp} placeholder="LLM-integration, n8n workflows, GPT-4 apps..." />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-2">Relevante kategorier</label>
              <div className="flex flex-wrap gap-2">
                {AI_CATEGORIES.map((cat) => (
                  <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                    className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors border ${form.categories.includes(cat) ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-white text-[#374151] border-[#e5e5e5] hover:border-[#d1d1d1]'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Typisk projektstørrelse</label>
                <select value={form.typical_project_size} onChange={(e) => update('typical_project_size', e.target.value)} className={inp}>
                  {PROJECT_SIZE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Tilgængelighed</label>
                <select value={form.availability} onChange={(e) => update('availability', e.target.value)} className={inp}>
                  {AVAILABILITY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Kort bio</label>
              <textarea value={form.short_bio} onChange={(e) => update('short_bio', e.target.value)} className={`${inp} min-h-[90px] resize-y`} placeholder="Beskriv kort din baggrund og hvad du hjælper virksomheder med..." />
            </div>
            <div className="border-t border-[#e5e5e5] pt-5 flex flex-col gap-4">
              <p className="text-[13px] font-medium text-[#374151]">Kontakt (synlig for virksomheder)</p>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">Email</label>
                <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inp} placeholder="din@email.dk" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1.5">LinkedIn eller hjemmeside</label>
                <input type="url" value={form.linkedin_or_website} onChange={(e) => update('linkedin_or_website', e.target.value)} className={inp} placeholder="https://..." />
              </div>
            </div>
            {error && <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}
            {saved && <p className="text-[13px] text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">Profil gemt.</p>}
            <button type="submit" disabled={loading} className="w-full rounded-md bg-[#1a1a1a] py-2.5 text-[14px] font-medium text-white hover:bg-[#333] transition-colors disabled:opacity-50">
              {loading ? 'Gemmer...' : 'Gem profil'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
