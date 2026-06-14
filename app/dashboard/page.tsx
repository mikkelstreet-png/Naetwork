'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StatusBadge } from '@/components/StatusBadge';

type Project = {
  id: string;
  project_category: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  company_name: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return; }
      const { data } = await supabase
        .from('projects')
        .select('id, project_category, status, created_at, company_name')
        .eq('user_id', session.user.id)
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[22px] font-semibold text-[#0a0a0a]">Mine projekter</h1>
              <p className="text-[14px] text-[#6b7280] mt-1">Projekter du har oprettet på Naetwork</p>
            </div>
            <Link
              href="/projekt/opret"
              className="inline-flex items-center justify-center rounded-md bg-[#1a1a1a] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#333] transition-colors"
            >
              Opret nyt projekt
            </Link>
          </div>

          {loading ? (
            <div className="text-[14px] text-[#6b7280]">Henter projekter…</div>
          ) : projects.length === 0 ? (
            <div className="bg-white border border-[#e5e5e5] rounded-xl p-10 text-center">
              <p className="text-[14px] text-[#6b7280] mb-4">Du har ingen projekter endnu.</p>
              <Link
                href="/projekt/opret"
                className="inline-flex items-center justify-center rounded-md bg-[#1a1a1a] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[#333] transition-colors"
              >
                Opret dit første projekt
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#f9f9f9]">
                    <th className="text-left px-5 py-3 text-[13px] font-medium text-[#6b7280]">Kategori</th>
                    <th className="text-left px-5 py-3 text-[13px] font-medium text-[#6b7280] hidden sm:table-cell">Oprettet</th>
                    <th className="text-left px-5 py-3 text-[13px] font-medium text-[#6b7280]">Status</th>
                    <th className="text-right px-5 py-3 text-[13px] font-medium text-[#6b7280]"></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, i) => (
                    <tr key={p.id} className={`${i < projects.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                      <td className="px-5 py-4">
                        <span className="font-medium text-[#0a0a0a]">{p.project_category}</span>
                        {p.company_name && (
                          <span className="block text-[12px] text-[#6b7280]">{p.company_name}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-[#6b7280] hidden sm:table-cell">
                        {new Date(p.created_at).toLocaleDateString('da-DK')}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/projekt/${p.id}/interesserede`}
                          className="text-[13px] font-medium text-[#0a0a0a] hover:underline"
                        >
                          Se interesserede →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
