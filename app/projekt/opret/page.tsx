'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AI_CATEGORIES, BUDGET_OPTIONS, TIMELINE_OPTIONS } from '@/lib/constants';

export default function OpretProjektPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    project_category: AI_CATEGORIES[0],
    help_needed: '',
    current_tools: '',
    desired_result: '',
    budget_range: BUDGET_OPTIONS[0],
    timeline: TIMELINE_OPTIONS[0],
    company_name: '',
    contact_name: '',
    contact_email: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/login'); return; }
    const { error: err } = await supabase.from('projects').insert({ ...form, user_id: session.user.id });
    if (err) { setError('Der opstod en fejl. Prøv igen.'); setLoading(false); return; }
    router.push('/dashboard');
  }

  const inp = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-[14px] text-[#0a0a0a] outline-none focus:border-[#1a1a1a] transition-colors";
  const label = "block text-[13px] font-medium text-[#374151] mb-1.5";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f9f9f9]">
        <div className="wrap py-10 max-w-2xl">
          <h1 className="text-[22px] font-semibold text-[#0a0a0a] mb-2">Opret AI-projekt</h1>
          <p className="text-[14px] text-[#6b7280] mb-8">Beskriv jeres AI-behov. AI-specialister kan herefter melde interesse, og I kontakter dem direkte.</p>

          <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5e5] rounded-xl p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <label className={label}>Kategori</label>
              <select value={form.project_category} onChange={(e) => update('project_category', e.target.value)} className={inp}>
                {AI_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className={label}>Hvad har I brug for hjælp til?</label>
              <textarea required value={form.help_needed} onChange={(e) => update('help_needed', e.target.value)}
                className={`${inp} min-h-[100px] resize-y`}
                placeholder="Beskriv konkret hvad I ønsker hjælp til..." />
            </div>

            <div>
              <label className={label}>Nuværende værktøjer / systemer</label>
              <input type="text" value={form.current_tools} onChange={(e) => update('current_tools', e.target.value)}
                className={inp} placeholder="Eks. Excel, Salesforce, SAP..." />
            </div>

            <div>
              <label className={label}>Ønsket resultat</label>
              <textarea value={form.desired_result} onChange={(e) => update('desired_result', e.target.value)}
                className={`${inp} min-h-[80px] resize-y`}
                placeholder="Hvad skal løsningen gøre for jer?" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={label}>Budget (estimat)</label>
                <select value={form.budget_range} onChange={(e) => update('budget_range', e.target.value)} className={inp}>
                  {BUDGET_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Tidshorisont</label>
                <select value={form.timeline} onChange={(e) => update('timeline', e.target.value)} className={inp}>
                  {TIMELINE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-[#e5e5e5] pt-5 flex flex-col gap-4">
              <p className="text-[13px] font-medium text-[#374151]">Kontaktoplysninger</p>
              <div>
                <label className={label}>Virksomhedsnavn</label>
                <input required type="text" value={form.company_name} onChange={(e) => update('company_name', e.target.value)} className={inp} placeholder="Jeres virksomhedsnavn" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={label}>Kontaktperson</label>
                  <input required type="text" value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} className={inp} placeholder="Fulde navn" />
                </div>
                <div>
                  <label className={label}>Email</label>
                  <input required type="email" value={form.contact_email} onChange={(e) => update('contact_email', e.target.value)} className={inp} placeholder="kontakt@firma.dk" />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#f9f9f9] border border-[#e5e5e5] p-4">
              <p className="text-[12px] text-[#6b7280] leading-relaxed">
                <strong className="text-[#0a0a0a]">Bemærk:</strong> Naetwork er en gratis opslagstavle. Vi er ikke part i nogen aftale mellem jer og en specialist. Kontaktoplysninger er synlige for specialister der melder interesse.
              </p>
            </div>

            {error && <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-md bg-[#1a1a1a] py-2.5 text-[14px] font-medium text-white hover:bg-[#333] transition-colors disabled:opacity-50">
              {loading ? 'Opretter...' : 'Opret projekt'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
