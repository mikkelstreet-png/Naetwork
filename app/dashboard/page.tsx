'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

type Project = {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  interest_count?: number;
};

export default function DashboardPage() {
  const { tr } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { window.location.href = '/login'; return; }
      const userId = data.session.user.id;

      const { data: profile } = await supabase.from('profiles').select('name').eq('id', userId).single();
      setUserName(profile?.name ?? data.session.user.email ?? '');

      const { data: projs } = await supabase
        .from('projects')
        .select('id, title, category, status, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (projs) {
        const withCounts = await Promise.all(
          projs.map(async (p) => {
            const { count } = await supabase
              .from('project_interests')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', p.id);
            return { ...p, interest_count: count ?? 0 };
          })
        );
        setProjects(withCounts);
      }
      setLoading(false);
    });
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      open: 'bg-indigo-50 text-indigo-700',
      in_progress: 'bg-amber-50 text-amber-700',
      closed: 'bg-gray-100 text-gray-600',
    };
    const label: Record<string, string> = {
      open: tr('projects.open'),
      in_progress: tr('projects.inProgress'),
      closed: tr('projects.closed'),
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
        {label[status] ?? status}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-sm text-gray-500 mb-1">{tr('dash.welcome')} {userName}</p>
          <h1 className="text-3xl font-bold text-[#0A0A0A]">{tr('dash.myProjects')}</h1>
        </div>
        <Link
          href="/projekt/opret"
          className="inline-flex items-center justify-center rounded-md bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors"
        >
          + {tr('dash.newProject')}
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-16 text-center">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <div className="w-4 h-4 rounded-full bg-[#4F46E5]"></div>
          </div>
          <h2 className="text-lg font-semibold text-[#0A0A0A] mb-2">{tr('dash.noProjects')}</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{tr('dash.noProjectsSub')}</p>
          <Link
            href="/projekt/opret"
            className="inline-flex items-center justify-center rounded-md bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors"
          >
            {tr('dash.createFirst')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-xl p-5 hover:border-[#4F46E5] transition-all duration-150 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {statusBadge(project.status)}
                    <span className="text-xs text-gray-400">{project.category}</span>
                  </div>
                  <h3 className="font-semibold text-[#0A0A0A] truncate">{project.title}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-gray-500">
                    {project.interest_count} {tr('dash.interested')}
                  </span>
                  <Link
                    href={`/projekt/${project.id}/interesserede`}
                    className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                  >
                    {tr('dash.viewInterested')} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
