'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

type Project = {
  id: string;
  project_category: string;
  help_needed: string;
  budget_range: string;
  timeline: string;
};

type Props = {
  project: Project;
  specialistId: string | null;
};

export function ProjectCard({ project, specialistId }: Props) {
  const [interested, setInterested] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleInterest() {
    if (!specialistId || interested) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from('project_interests').insert({
      project_id: project.id,
      specialist_id: specialistId,
    });
    setInterested(true);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white p-5 flex flex-col gap-4 hover:border-[#d1d1d1] transition-colors">
      <div>
        <span className="inline-block rounded-md bg-[#f3f4f6] px-2.5 py-1 text-[12px] font-medium text-[#374151]">
          {project.project_category}
        </span>
      </div>
      <p className="text-[14px] text-[#374151] leading-relaxed line-clamp-3">
        {project.help_needed}
      </p>
      <div className="flex flex-wrap gap-4 text-[13px] text-[#6b7280]">
        <span>Budget: <strong className="text-[#0a0a0a]">{project.budget_range}</strong></span>
        <span>Tidslinje: <strong className="text-[#0a0a0a]">{project.timeline}</strong></span>
      </div>
      <button
        onClick={handleInterest}
        disabled={!specialistId || interested || loading}
        className="mt-auto inline-flex items-center justify-center rounded-md border border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#f9f9f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {interested ? '✓ Interesse meldt' : loading ? 'Sender…' : 'Meld interesse'}
      </button>
    </div>
  );
}
