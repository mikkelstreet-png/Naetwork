'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { HeartIcon } from '@/components/icons/HeartIcon';

const INDUSTRIES = ['Teknologi','Finans','Konsulentbranchen','Marketing','Jura','Sundhed','Uddannelse','Medier','Andet'];
const SESSION_TYPE_OPTIONS = [
  { value: 'mock_interview', label: 'Mock Interview' },
  { value: 'cv_review', label: 'CV & LinkedIn' },
  { value: 'informal_chat', label: 'Uformel 1:1' },
  { value: 'career_advice', label: 'Karriereraadgivning' },
];

const STEPS = ['Grundlaeggede oplysninger','Session-konfiguration','Donationsvalg','Bekraeft og opret'];

export default function ProfessionalSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Step 2
  const [sessionTypes, setSessionTypes] = useState<string[]>([]);
  const [priceDkk, setPriceDkk] = useState(700);

  // Step 3
  const [donatesToCharity, setDonatesToCharity] = useState(false);

  // Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleSessionType = (v: string) => {
    setSessionTypes(prev => prev.includes(v) ? prev.filter(s => s !== v) : [...prev, v]);
  };

  const handleNext = () => {
    if (step === 0 && (!name || !title || !industry || !bio)) {
      setError('Udfyld alle paakraevede felter.'); return;
    }
    if (step === 1 && sessionTypes.length === 0) {
      setError('Vaelg mindst en session-type.'); return;
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!email || !password) { setError('Udfyld email og adgangskode.'); return; }
    setSubmitting(true);
    setError('');

    const supabase = createClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError || !authData.user) {
      setError(authError?.message ?? 'Kunne ikke oprette konto.');
      setSubmitting(false);
      return;
    }

    const userId = authData.user.id;

    // Create profile
    await supabase.from('profiles').insert({
      user_id: userId,
      user_type: 'professional',
      name,
      email,
    });

    // Create professional record
    const { error: proError } = await supabase.from('professionals').insert({
      user_id: userId,
      name,
      title,
      company: company || null,
      industry,
      bio,
      linkedin_url: linkedinUrl || null,
      session_types: sessionTypes,
      price_dkk: priceDkk,
      donates_to_charity: donatesToCharity,
      available: true,
      languages: ['da'],
    });

    if (proError) {
      setError('Profil kunne ikke oprettes: ' + proError.message);
      setSubmitting(false);
      return;
    }

    router.push('/dashboard');
  };

  const commissionPct = donatesToCharity ? 7.5 : 15;
  const platformFee = Math.round(priceDkk * commissionPct / 100);
  const payout = priceDkk - platformFee;

  return (
    <main className="pt-16">
      <div className="max-w-xl mx-auto px-6 py-12">

        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-green-800' : 'bg-gray-100'}`} />
          ))}
        </div>

        <div className="text-xs text-gray-400 mb-2">Trin {step + 1} af {STEPS.length}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{STEPS[step]}</h1>

        {/* Step 1: Basic info */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Fulde navn *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Marie Jensen"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Titel / stilling *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Senior Manager, McKinsey"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Virksomhed</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="McKinsey & Company"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Branche *</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800">
                <option value="">Vaelg branche</option>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Kort bio *</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                placeholder="Fortael kandidater om din baggrund, erfaringer og hvad du kan hjaelpe med..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">LinkedIn URL</label>
              <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800" />
            </div>
          </div>
        )}

        {/* Step 2: Session config */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Hvilke sessions tilbyder du? *</div>
              <div className="space-y-2">
                {SESSION_TYPE_OPTIONS.map(o => (
                  <label key={o.value} className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${sessionTypes.includes(o.value) ? 'border-green-800 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="checkbox" checked={sessionTypes.includes(o.value)} onChange={() => toggleSessionType(o.value)} className="accent-green-800" />
                    <span className="text-sm font-medium text-gray-900">{o.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-3">
                Pris per session: DKK {priceDkk}
              </label>
              <input type="range" min={300} max={2000} step={50} value={priceDkk}
                onChange={e => setPriceDkk(Number(e.target.value))} className="w-full accent-green-800" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>DKK 300</span><span>DKK 2.000</span>
              </div>
            </div>

            {/* Fee preview */}
            <div className="border border-gray-100 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Sessionspris</span>
                <span className="font-medium">DKK {priceDkk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Platformsbidrag ({commissionPct}%)</span>
                <span className="font-medium">DKK {platformFee}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-100 pt-2">
                <span className="text-gray-900">Din udbetaling</span>
                <span className="text-gray-900">DKK {payout}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Charity */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border border-rose-200 bg-rose-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <HeartIcon className="w-5 h-5 text-rose-600" />
                <span className="font-semibold text-rose-800">Stoet Kraeftens Bekaempelse</span>
              </div>
              <p className="text-sm text-rose-700 mb-5">
                Vaelg at donere dit honorar fra dine sessioner til Kraeftens Bekaempelse.
                Naar du donerer, reduceres dit platformsbidrag fra 15% til 7,5% — resten af bidraget gaer til sagen.
              </p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={donatesToCharity} onChange={e => setDonatesToCharity(e.target.checked)} className="mt-0.5 accent-rose-600 w-4 h-4" />
                <div>
                  <div className="font-medium text-rose-800 text-sm">Jeg oensker at donere mit honorar til Kraeftens Bekaempelse</div>
                  <div className="text-xs text-rose-600 mt-1">Dit valg vises paa din profil som et donationsbadge.</div>
                </div>
              </label>
            </div>

            {donatesToCharity ? (
              <div className="border border-gray-100 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">Sessionspris</span><span>DKK {priceDkk}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Platformsbidrag (7,5%)</span><span>DKK {Math.round(priceDkk * 0.075)}</span></div>
                <div className="flex justify-between text-rose-700"><span>Til Kraeftens Bekaempelse</span><span>DKK {Math.round(priceDkk * 0.075)}</span></div>
                <div className="flex justify-between font-semibold border-t pt-2"><span>Din udbetaling</span><span>DKK {priceDkk - Math.round(priceDkk * 0.075)}</span></div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Du kan altid aendre dette i dine indstillinger senere.</p>
            )}
          </div>
        )}

        {/* Step 4: Confirm + account */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border border-gray-100 rounded-2xl p-5 space-y-3 text-sm">
              <div className="font-semibold text-gray-900 mb-3">Opsummering</div>
              <div className="flex justify-between"><span className="text-gray-500">Navn</span><span>{name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Titel</span><span>{title}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Branche</span><span>{industry}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Pris</span><span>DKK {priceDkk} / session</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Platformsbidrag</span><span>{donatesToCharity ? '7,5%' : '15%'}</span></div>
              {donatesToCharity && <div className="flex justify-between text-rose-700"><span>Donation</span><span>Kraeftens Bekaempelse</span></div>}
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="font-semibold text-gray-900 text-sm mb-3">Opret konto</div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Adgangskode</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-800" />
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => { setError(''); setStep(s => s - 1); }}
              className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:border-gray-400 transition-colors text-sm">
              Tilbage
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={handleNext}
              className="flex-1 bg-green-800 text-white font-medium py-3 rounded-xl hover:bg-green-900 transition-colors text-sm">
              Naeste
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 bg-green-800 text-white font-medium py-3 rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50 text-sm">
              {submitting ? 'Opretter profil...' : 'Opret profil'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
