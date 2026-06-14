'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
    });
  }, [router]);

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

    const { error: err } = await supabase.from('projects').insert({
      ...form,
      user_id: session.user.id,
      status: 'open',
    });

    if (err) {
      setError('Der opstod en fejl. Prøv igen.');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-[13px] font-medium text-[#374151] mb-1.5">{label}</label>
      {children}
    </div>
  );

  const inputClass = "w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-[14px] text-[#0a0a0a] outline-none focus:border-[#1a1a1a] transition-colors";
  const textareaClass = `${inputClass} min-h-[100px] resize-y`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f9f9f9]">
        <div className="wrap py-10 max-w-2xl">
          <h1 className="text-[22px] font-semibold text-[#0a0a0a] mb-2">Opret AI-projekt</h1>
          <p className="text-[14px] text-[#6b7280] mb-8">
            Beskriv dit behov. Relevante AI-specialister kan melde interesse.
          </p>

          <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5e5] rounded-xl p-6 sm:p-8 flex flex-col gap-5">
            <Field label="AI-kategori">
              <select
                value={form.project_category}
                onChange={(e) => update('project_category', e.target.value)}
                className={inputClass}
              >
                {AI_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Hvad har du brug for hjælp til?">
              <textarea
                required
                value={form.help_needed}
                onChange={(e) => update('help_needed', e.target.value)}
                className={textareaClass}
                placeholder="Beskriv din udfordring eller ønskede løsning…"
              />
            </Field>

            <Field label="Hvad bruger I i dag?">
              <textarea
                required
                value={form.current_tools}
                onChange={(e) => update('current_tools', e.target.value)}
                className={textareaClass}
                placeholder="Eksisterende systemer, processer,værktøjer…"
              />
            </Field>

            <Field label="Hvilket resultat ønsker du?">
              <textarea
                required
                value={form.desired_result}
                onChange={(e) => update('desired_result', e.target.value)}
                className={textareaClass}
                placeholder="Hvad vil succes se ud for dig?"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Budgetramme">
                <select
                  value={form.budget_range}
                  onChange={(e) => update('budget_range', e.target.value)}
                  className={inputClass}
                >
                  {BUDGET_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Ønsket tidslinje">
                <select
                  value={form.timeline}
                  onChange={(e) => update('timeline', e.target.value)}
                  className={inputClass}
                >
                  {TIMELINE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>

            <div className="border-t border-[#e5e5e5] pt-5">
              <p className="text-[13px] font-medium text-[#374151] mb-4">Dine kontaktoplysninger</p>
              <div className="flex flex-col gap-4">
                <Field label="Virksomhedsnavn">
                  <input
                    required
                    type="text"
                    value={form.company_name}
                    onChange={(e) => update('company_name', e.target.value)}
                    className={inputClass}
                    placeholder="Eksempel ApS"
                  />
                </Field>
                <Field label="Navn">
                  <input
                    required
                    type="text"
                    value={form.contact_name}
                    onChange={(e) => update('contact_name', e.target.value)}
                    className={inputClass}
                    placeholder="Dit fulde navn"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => update('contact_email', e.target.value)}
                    className={inputClass}
                    placeholder="din@virksomhed.dk"
                  />
                </Field>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <p className="text-[12px] text-[#6b7280]">
              Din email er kun synlig for dig og relevante specialister, der melder interesse. Naetwork er ikke part i nogen aftale.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#1a1a1a] py-2.5 text-[14px] font-medium text-white hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {loading ? 'Opretter projekt…' : 'Opret projekt'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
