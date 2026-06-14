'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

const CATEGORIES = ['Chatbots & NLP', 'Computer Vision', 'Data & Analytics', 'Automation', 'Generativ AI', 'AI-strategi', 'Machine Learning', 'Andet'];

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  budget?: string;
  duration?: string;
  created_at: string;
  profiles?: { name: string };
};

export default function ProjekterPage() {
  const { tr } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);

      const { data: projs } = await supabase
        .from('projects')
        .select('id, title, description, category, status, budget, duration, created_at, profiles(name)')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      setProjects(projs ?? []);

      if (uid) {
        const { data: myInterests } = await supabase
          .from('project_interests')
          .select('project_id')
          .eq('specialist_id', uid);
        setInterests(new Set((myInterests ?? []).map((i: {project_id: string}) => i.project_id)));
      }
      setLoading(false);
    });
  }, []);

  async function showInterest(projectId: string) {
    if (!userId) { window.location.href = '/login'; return; }
    const supabase = createClient();

    const { data: profile } = await supabase
      .from('specialists')
      .select('name, title, bio')
      .eq('user_id', userId)
      .single();

    await supabase.from('project_interests').upsert({ project_id: projectId, specialist_id: userId });
    setInterests(prev => new Set([...prev, projectId]));

    // Get business email for notification
    const { data: proj } = await supabase
      .from('projects')
      .select('user_id, title')
      .eq('id', projectId)
      .single();

    if (proj) {
      const { data: bizProfile } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', proj.user_id)
        .single();

      if (bizProfile?.email) {
        fetch('/api/email/interest-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bizEmail: bizProfile.email,
            bizName: bizProfile.name,
            projectId,
            projectTitle: proj.title,
            specialistName: profile?.name ?? '',
            specialistTitle: profile?.title ?? '',
            specialistBio: profile?.bio ?? '',
          }),
        }).catch(() => {});
      }
    }
  }

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">{tr('projects.title')}</h1>
        <p className="text-base text-gray-500">{tr('projects.sub')}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder={tr('projects.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors bg-white"
        >
          <option value="">{tr('projects.all')}</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">{tr('projects.noResults')}</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(project => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-xl p-6 hover:border-[#4F46E5] transition-all duration-150 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#0A0A0A] mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    {project.budget && <span>Budget: {project.budget}</span>}
                    {project.duration && <span>Varighed: {project.duration}</span>}
                    <span>{tr('projects.postedBy')}: {(project.profiles as {name:string})?.name ?? '—'}</span>
                  </div>
                </div>
                <button
                  onClick={() => showInterest(project.id)}
                  disabled={interests.has(project.id)}
                  className={`shrink-0 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    interests.has(project.id)
                      ? 'bg-gray-100 text-gray-400 cursor-default'
                      : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                  }`}
                >
                  {interests.has(project.id) ? '✓ ' + tr('projects.interested') : tr('projects.showInterest')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
