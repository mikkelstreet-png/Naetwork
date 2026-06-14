'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectCard } from '@/components/ProjectCard';

type Project = {
  id: string;
  project_category: string;
  help_needed: string;
  budget_range: string;
  timeline: string;
};

export default function ProjekterPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [specialistId, setSpecialistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return; }

      const { data: specialist } = await supabase
        .from('specialists')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!specialist) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setSpecialistId(specialist.id);

      const { data } = await supabase
        .from('projects')
        .select('id, project_category, help_needed, budget_range, timeline')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      setProjects(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f9f9f9]">
        <div className="wrap py-10">
          <div className="mb-8">
            <h1 className="text-[22px] font-semibold text-[#0a0a0a]">Åbne projekter</h1>
            <p className="text-[14px] text-[#6b7280] mt-1">Virksomheder der søger AI-specialister. Meld interesse — de kontakter dig direkte.</p>
          </div>

          {loading ? (<p className="text-[14px] text-[#6b7280]">Henter projekter…</p>) : accessDenied ? (
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-10 text-center max-w-md mx-auto">
              <h2 className="text-[16px] font-semibold text-[#0a0a0a] mb-2">Opret specialistprofil</h2>
              <p className="text-[14px] text-[#6b7280] mb-5">Du skal have en specialistprofil for at se åbne projekter.</p>
              <a href="/specialist/profil" className="inline-flex items-center justify-center rounded-md bg-[#1a1a1a] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#333] transition-colors">Opret specialistprofil</a>
            </div>
          ) : projects.length === 0 ? (<p className="text-[14px] text-[#6b7280]">Ingen åbne projekter pt.</p>) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => <ProjectCard key={p.id} project={p} specialistId={specialistId} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
