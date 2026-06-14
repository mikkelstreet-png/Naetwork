'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';
import { useParams } from 'next/navigation';

type Specialist = {
  id: string;
  name: string;
  title: string;
  bio: string;
  contact_email: string;
  linkedin?: string;
  categories?: string[];
};

export default function IntereresseretPage() {
  const { tr } = useTranslation();
  const params = useParams();
  const projectId = params.id as string;
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { window.location.href = '/login'; return; }

      const { data: proj } = await supabase
        .from('projects')
        .select('title')
        .eq('id', projectId)
        .single();
      setProjectTitle(proj?.title ?? '');

      const { data: interests } = await supabase
        .from('project_interests')
        .select('specialist_id')
        .eq('project_id', projectId);

      if (interests && interests.length > 0) {
        const ids = interests.map((i: {specialist_id: string}) => i.specialist_id);
        const { data: specs } = await supabase
          .from('specialists')
          .select('id, name, title, bio, contact_email, linkedin, categories')
          .in('user_id', ids);
        setSpecialists(specs ?? []);
      }
      setLoading(false);
    });
  }, [projectId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-2">
        <Link href="/dashboard" className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors">
          ← {tr('interested.back')}
        </Link>
      </div>
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">{tr('interested.title')}</h1>
        {projectTitle && <p className="text-sm text-gray-500">{projectTitle}</p>}
      </div>

      {specialists.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-16 text-center">
          <h2 className="text-base font-semibold text-[#0A0A0A] mb-2">{tr('interested.none')}</h2>
          <p className="text-sm text-gray-500">{tr('interested.noneSub')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {specialists.map(spec => (
            <div key={spec.id} className="border border-gray-200 rounded-xl p-6 hover:border-[#4F46E5] transition-all duration-150 hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {spec.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0A0A0A]">{spec.name}</div>
                      <div className="text-sm text-gray-500">{spec.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{spec.bio}</p>
                  {spec.categories && spec.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {spec.categories.map(cat => (
                        <span key={cat} className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={`mailto:${spec.contact_email}`}
                    className="inline-flex items-center justify-center rounded-md bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors"
                  >
                    {tr('interested.contact')}
                  </a>
                  {spec.linkedin && (
                    <a
                      href={spec.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-[#0A0A0A] hover:border-[#4F46E5] transition-colors"
                    >
                      {tr('interested.linkedin')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
