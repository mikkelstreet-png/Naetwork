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

const CATEGORY_ICONS: Record<string, string> = {
  'Machine Learning': '🤖',
  'Data Analysis': '📊',
  'Automation': '⚙️',
  'NLP': '💬',
  'Computer Vision': '👁️',
  'Generative AI': '✨',
  'Chatbots & NLP': '💬',
  'Data & Analytics': '📊',
  'Generativ AI': '✨',
  'AI-strategi': '🗺️',
  'Andet': '🔧',
  'Other': '🔧',
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

  const icon = CATEGORY_ICONS[project.project_category] ?? '💡';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 flex flex-col gap-4 hover:border-gray-900 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-medium text-gray-700">
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
        className="mt-auto inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {interested ? '✓ Interesse meldt' : loading ? 'Sender…' : 'Meld interesse'}
      </button>
    </div>
  );
}
