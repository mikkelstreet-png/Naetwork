'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SpecialistCard } from '@/components/SpecialistCard';

type Specialist = {
  id: string;
  name: string;
  role_title: string;
  ai_specialty: string;
  categories: string[];
  typical_project_size: string;
  availability: string;
  short_bio: string;
  email: string;
  linkedin_or_website: string | null;
};

export default function InteresseretPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectCategory, setProjectCategory] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return; }

      const { data: project } = await supabase
        .from('projects')
        .select('project_category, user_id')
        .eq('id', projectId)
        .maybeSingle();

      if (!project || project.user_id !== session.user.id) {
        window.location.href = '/dashboard';
        return;
      }

      setProjectCategory(project.project_category);

      const { data: interests } = await supabase
        .from('project_interests')
        .select('specialist_id')
        .eq('project_id', projectId);

      if (!interests?.length) { setLoading(false); return; }

      const ids = interests.map((i) => i.specialist_id);
      const { data: specs } = await supabase
        .from('specialists')
        .select('id, name, role_title, ai_specialty, categories, typical_project_size, availability, short_bio, email, linkedin_or_website')
        .in('id', ids);

      setSpecialists(specs ?? []);
      setLoading(false);
    });
  }, [projectId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f9f9f9]">
        <div className="wrap py-10">
          <Link href="/dashboard" className="text-[13px] text-[#6b7280] hover:text-[#0a0a0a] mb-2 block">← Mine projekter</Link>
          <h1 className="text-[22px] font-semibold text-[#0a0a0a] mt-3 mb-1">Interesserede specialister</h1>
          {projectCategory && <p className="text-[14px] text-[#6b7280] mb-8">Projekt: {projectCategory}</p>}
          {loading ? (<p className="text-[14px] text-[#6b7280]">Henter specialister筌&</p>) : specialists.length === 0 ? (
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-10 text-center max-w-md"><p>Ingen specialister har meldt interesse endnu.</p></div>
          ) : (
            <>
              <p className="text-[14px] text-[#6b7280] mb-6">{loading ? '' : `${specialists.length} specialist${specialists.length !== 1 ? 'er' : ''} har meldt interesse.`}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialists.map((s) => <SpecialistCard key={s.id} specialist={s} />)}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
