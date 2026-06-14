'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

type Project = {
  id: string;
  title?: string;
  description?: string;
  project_category?: string;
  category?: string;
  help_needed?: string;
  budget_range?: string;
  budget?: string;
  timeline?: string;
  duration?: string;
  status?: string;
  created_at?: string;
  profiles?: { name: string } | { name: string }[] | null;
};

type Props = {
  project: Project;
  specialistId?: string | null;
  alreadyInterested?: boolean;
  onInterest?: (id: string) => void;
};

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

function getProfileName(profiles: { name: string } | { name: string }[] | null | undefined): string {
  if (!profiles) return '';
  if (Array.isArray(profiles)) return profiles[0]?.name ?? '';
  return profiles.name ?? '';
}

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' });
}

export function ProjectCard({ project, specialistId, alreadyInterested = false, onInterest }: Props) {
  const [interested, setInterested] = useState(alreadyInterested);
  const [loading, setLoading] = useState(false);

  const category = project.project_category ?? project.category ?? '';
  const title = project.title ?? project.help_needed ?? '';
  const description = project.description ?? project.help_needed ?? '';
  const budget = project.budget_range ?? project.budget ?? '';
  const duration = project.timeline ?? project.duration ?? '';
  const companyName = getProfileName(project.profiles);

  async function handleInterest() {
    if (!specialistId) { window.location.href = '/login'; return; }
    if (interested || loading) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from('project_interests').insert({
      project_id: project.id,
      specialist_id: specialistId,
    });
    setInterested(true);
    setLoading(false);
    onInterest?.(project.id);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      {/* Top: category + status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-gray-400">
            <ChartIcon />
          </div>
          {category && (
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {category}
            </span>
          )}
        </div>
        <span className="bg-green-50 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Åben
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>

      {/* Description */}
      <p className="text-base text-gray-500 leading-relaxed line-clamp-2 mb-5">{description}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        {budget && (
          <span className="text-sm text-gray-400">{budget}</span>
        )}
        {duration && (
          <span className="text-sm text-gray-400">{duration}</span>
        )}
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div>
          {companyName && (
            <p className="text-xs text-gray-400">{companyName}</p>
          )}
          {project.created_at && (
            <p className="text-xs text-gray-300 mt-0.5">{formatDate(project.created_at)}</p>
          )}
        </div>
        {specialistId !== undefined ? (
          <button
            onClick={handleInterest}
            disabled={interested || loading}
            className={interested
              ? 'bg-green-50 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full cursor-default'
              : 'bg-green-800 text-white hover:bg-green-900 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60'
            }
          >
            {interested ? (
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Interesse vist
              </span>
            ) : loading ? '...' : 'Vis interesse'}
          </button>
        ) : (
          <Link
            href={`/projekter`}
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            Se projekt
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
