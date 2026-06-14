'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

export default function IndstillingerPage() {
  const { tr } = useTranslation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { window.location.href = '/login'; return; }
      const user = data.session.user;
      setEmail(user.email ?? '');
      setCreatedAt(new Date(user.created_at).toLocaleDateString('da-DK'));

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setRole(profile?.role ?? '');
      setLoading(false);
    });
  }, []);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;
    const uid = session.session.user.id;

    // Delete specialist data
    await supabase.from('specialists').delete().eq('user_id', uid);
    // Delete project interests
    await supabase.from('project_interests').delete().eq('specialist_id', uid);
    // Delete projects
    await supabase.from('projects').delete().eq('user_id', uid);
    // Delete profile
    await supabase.from('profiles').delete().eq('id', uid);

    // Call edge function to delete auth user, fall back to sign out
    try {
      await fetch('/api/auth/delete-user', { method: 'POST' });
    } catch {
      await supabase.auth.signOut();
    }

    window.location.href = '/?deleted=1';
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-[#0A0A0A] mb-10">{tr('settings.title')}</h1>

      {/* Account info */}
      <section className="border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-base font-semibold text-[#0A0A0A] mb-4">{tr('settings.account')}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{tr('settings.email')}</span>
            <span className="text-[#0A0A0A] font-medium">{email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{tr('settings.type')}</span>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
              {role === 'business' ? tr('settings.biz') : tr('settings.spec')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{tr('settings.created')}</span>
            <span className="text-[#0A0A0A] font-medium">{createdAt}</span>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="border border-red-100 rounded-xl p-6 bg-red-50/30">
        <h2 className="text-base font-semibold text-red-700 mb-2">{tr('settings.danger')}</h2>
        <p className="text-sm text-gray-500 mb-4">{tr('settings.deleteDesc')}</p>
        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          {tr('settings.delete')}
        </button>
      </section>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-bold text-[#0A0A0A] mb-2">{tr('settings.deleteConfirmTitle')}</h3>
            <p className="text-sm text-gray-500 mb-6">{tr('settings.deleteConfirmBody')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {tr('settings.deleteCancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? '...' : tr('settings.deleteConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
