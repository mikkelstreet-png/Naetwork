'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

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

const CATEGORIES = ['Machine Learning', 'Data Analysis', 'Automation', 'NLP', 'Computer Vision', 'Generative AI', 'Other'];

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    await fetch('/api/email/interest-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    });
  }

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </main>
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">{tr('projects.title')}</h1>
          <p className="text-gray-500">{tr('projects.sub')}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder={tr('projects.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="">{tr('projects.all')}</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">{tr('projects.noResults')}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(project => (
              <div key={project.id} className="border border-gray-100 rounded-2xl p-6 hover:border-gray-900 transition-all duration-150 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{project.category}</span>
                      {project.budget && <span className="text-xs text-gray-400">{project.budget}</span>}
                    </div>
                    <h2 className="text-lg font-semibold text-[#0A0A0A] mb-1">{project.title}</h2>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {getProfileName(project.profiles) && (
                        <span>{tr('projects.postedBy')} {getProfileName(project.profiles)}</span>
                      )}
                      {project.duration && <span>⏱ {project.duration}</span>}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {interests.includes(project.id) ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium">
                        ✓ {tr('projects.interested')}
                      </span>
                    ) : (
                      <button
                        onClick={() => showInterest(project.id)}
                        className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
                      >
                        {tr('projects.showInterest')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
