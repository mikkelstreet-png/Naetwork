'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

type ProfileRow = { name: string };

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  budget: string;
  duration: string;
  created_at: string;
  profiles: ProfileRow | ProfileRow[] | null;
};

function getProfileName(profiles: ProfileRow | ProfileRow[] | null): string {
  if (!profiles) return '';
  if (Array.isArray(profiles)) return profiles[0]?.name ?? '';
  return profiles.name ?? '';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
}

const AI_CATEGORIES_DISPLAY = [
  'AI kundeservice',
  'AI salgsassistent',
  'Indholdsmotor',
  'Rapportautomatisering',
  'Intern AI-assistent',
  'Hjemmeside/MVP med AI',
  'AI til tilbud og forslag',
  'AI workflows til administration',
  'Marked- og konkurrentanalyse',
  'AI-opsætning for teamet',
  'Machine Learning',
  'Data Analysis',
  'Automation',
  'NLP',
  'Computer Vision',
  'Generative AI',
  'Other',
];

export default function ProjekterPage() {
  const { tr } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id ?? null;
      setUid(userId);

      const { data: projs } = await supabase
        .from('projects')
        .select('id, title, description, category, status, budget, duration, created_at, profiles(name)')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      setProjects((projs as unknown as Project[]) ?? []);

      if (userId) {
        const { data: myInterests } = await supabase
          .from('project_interests')
          .select('project_id')
          .eq('specialist_id', userId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setInterests((myInterests ?? []).map((i: any) => i.project_id as string));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function showInterest(projectId: string) {
    if (!uid) { window.location.href = '/login'; return; }
    const supabase = createClient();
    await supabase.from('project_interests').upsert({ project_id: projectId, specialist_id: uid });
    setInterests(prev => [...prev, projectId]);
    fetch('/api/email/interest-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    }).catch(() => {});
  }

  const activeCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
            {tr('projects.title')}
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-xl">{tr('projects.sub')}</p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder={tr('projects.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-11 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-900 transition-colors bg-white"
          >
            <option value="">{tr('projects.all')}</option>
            {activeCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setCategory('')}
            className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${!category ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Alle
          </button>
          {activeCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === category ? '' : cat)}
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${category === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-2">{tr('projects.noResults')}</p>
            <p className="text-sm text-gray-400">Prøv en anden søgning eller kategori</p>
          </div>
        ) : (
          /* Project grid */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(project => {
              const isInterested = interests.includes(project.id);
              const companyName = getProfileName(project.profiles);
              return (
                <div key={project.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col gap-4">
                  {/* Top */}
                  <div className="flex items-center justify-between">
                    {project.category && (
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {project.category}
                      </span>
                    )}
                    <span className="bg-green-50 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-auto">
                      {tr('projects.open')}
                    </span>
                  </div>

                  {/* Title + description */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{project.title}</h2>
                    <p className="text-base text-gray-500 leading-relaxed line-clamp-2">{project.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3">
                    {project.budget && <span className="text-sm text-gray-400">{project.budget}</span>}
                    {project.duration && <span className="text-sm text-gray-400">{project.duration}</span>}
                  </div>

                  {/* Bottom */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div>
                      {companyName && <p className="text-xs text-gray-400">{companyName}</p>}
                      <p className="text-xs text-gray-300 mt-0.5">{formatDate(project.created_at)}</p>
                    </div>
                    {isInterested ? (
                      <span className="bg-green-50 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {tr('projects.interested')}
                      </span>
                    ) : (
                      <button
                        onClick={() => showInterest(project.id)}
                        className="bg-green-800 text-white hover:bg-green-900 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                      >
                        {tr('projects.showInterest')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
