'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

const CATEGORIES = ['Chatbots & NLP', 'Computer Vision', 'Data & Analytics', 'Automation', 'Generativ AI', 'AI-strategi', 'Machine Learning', 'Andet'];

export default function OpretProjektPage() {
  const { tr } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) { window.location.href = '/login'; return; }

    const userId = session.session.user.id;
    const { data: proj, error: err } = await supabase.from('projects').insert({
      user_id: userId,
      title,
      description,
      category,
      budget,
      duration,
      status: 'open',
    }).select().single();

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // Send confirmation email
    const { data: profile } = await supabase.from('profiles').select('email, name').eq('id', userId).single();
    if (profile?.email) {
      fetch('/api/email/project-confirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          projectTitle: title,
          projectCategory: category,
          projectId: proj?.id,
        }),
      }).catch(() => {});
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <div className="w-5 h-5 rounded-full bg-[#4F46E5]"></div>
        </div>
        <p className="font-semibold text-[#0A0A0A]">{tr('create.success')}</p>
      </div>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">{tr('create.title')}</h1>
        <p className="text-base text-gray-500">{tr('create.sub')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('create.titleLabel')}</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors"
            placeholder={tr('create.titlePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('create.categoryLabel')}</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors bg-white"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('create.descLabel')}</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors resize-none"
            placeholder={tr('create.descPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('create.budgetLabel')}</label>
            <input
              type="text"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors"
              placeholder={tr('create.budgetPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('create.durationLabel')}</label>
            <input
              type="text"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors"
              placeholder={tr('create.durationPlaceholder')}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#4F46E5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors disabled:opacity-50"
        >
          {loading ? '...' : tr('create.btn')}
        </button>
      </form>
    </main>
  );
}
