'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTranslation } from '@/context/LanguageContext';

const CATEGORIES = ['Chatbots & NLP', 'Computer Vision', 'Data & Analytics', 'Automation', 'Generativ AI', 'AI-strategi', 'Machine Learning', 'Andet'];

export default function SpecialistProfilPage() {
  const { tr } = useTranslation();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { window.location.href = '/login'; return; }
      const uid = data.session.user.id;
      const email = data.session.user.email ?? '';
      setContactEmail(email);

      const { data: existing } = await supabase
        .from('specialists')
        .select('*')
        .eq('user_id', uid)
        .single();

      if (existing) {
        setIsEdit(true);
        setName(existing.name ?? '');
        setTitle(existing.title ?? '');
        setBio(existing.bio ?? '');
        setContactEmail(existing.contact_email ?? email);
        setLinkedin(existing.linkedin ?? '');
        setSelectedCategories(existing.categories ?? []);
      } else {
        const { data: profile } = await supabase.from('profiles').select('name').eq('id', uid).single();
        setName(profile?.name ?? '');
      }
    });
  }, []);

  function toggleCategory(cat: string) {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) { window.location.href = '/login'; return; }
    const uid = session.session.user.id;

    const payload = { user_id: uid, name, title, bio, contact_email: contactEmail, linkedin, categories: selectedCategories };
    const { error: err } = await supabase.from('specialists').upsert(payload, { onConflict: 'user_id' });

    if (err) { setError(err.message); setLoading(false); return; }

    if (!isEdit) {
      fetch('/api/email/specialist-confirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactEmail, name }),
      }).catch(() => {});
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => { window.location.href = '/projekter'; }, 1500);
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <div className="w-5 h-5 rounded-full bg-[#4F46E5]"></div>
        </div>
        <p className="font-semibold text-[#0A0A0A]">{tr('profil.success')}</p>
      </div>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">{tr('profil.title')}</h1>
        <p className="text-base text-gray-500">{tr('profil.sub')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('profil.nameLabel')}</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('profil.titleLabel')}</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors"
            placeholder={tr('profil.titlePlaceholder')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('profil.bioLabel')}</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} required rows={4}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors resize-none"
            placeholder={tr('profil.bioPlaceholder')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">{tr('profil.categoriesLabel')}</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedCategories.includes(cat)
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#4F46E5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('profil.contactLabel')}</label>
          <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-1.5">{tr('profil.linkedinLabel')}</label>
          <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#4F46E5] transition-colors"
            placeholder="https://linkedin.com/in/..." />
        </div>

        {error && <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">{error}</div>}

        <button type="submit" disabled={loading}
          className="w-full rounded-md bg-[#4F46E5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors disabled:opacity-50">
          {loading ? '...' : tr('profil.btn')}
        </button>
      </form>
    </main>
  );
}
