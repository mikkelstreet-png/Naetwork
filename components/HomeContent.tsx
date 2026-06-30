'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, Search, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

interface FeaturedProfessional {
  id: string;
  name: string;
  title: string;
  company: string;
  industries: string[];
  focusAreas: string[];
  price: number;
}

function accentForIndustry(industry?: string) {
  if (industry === 'AI') return 'bg-cyan-300';
  if (industry === 'Banking') return 'bg-emerald-300';
  if (industry === 'Management Consulting') return 'bg-blue-300';
  if (industry === 'Private Equity') return 'bg-lime-300';
  return 'bg-gray-300';
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'N';
}

function primaryFocus(focusAreas: string[], isDa: boolean) {
  if (focusAreas.includes('pe_investment_case')) return isDa ? 'Investment case og deal thinking' : 'Investment cases and deal thinking';
  if (focusAreas.includes('banking_technicals')) return isDa ? 'Technicals og interview' : 'Technicals and interviews';
  if (focusAreas.includes('consulting_cases') || focusAreas.includes('case_prep')) return isDa ? 'Casestruktur og fit' : 'Case structure and fit';
  if (focusAreas.includes('ai_career_strategy') || focusAreas.includes('industry_insight')) return isDa ? 'AI-positionering og rollevalg' : 'AI positioning and role choice';
  return isDa ? 'Karriereretning og materiale' : 'Career direction and materials';
}

export function HomeContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';
  const [featured, setFeatured] = useState<FeaturedProfessional[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchFeatured() {
      const { data } = await supabase
        .from('professional_profiles')
        .select('id, title, company, price_dkk, industries, focus_areas, profiles!inner(name)')
        .eq('visibility', 'published')
        .limit(3);

      if (data) {
        setFeatured((data as Array<{
          id: string;
          title: string | null;
          company: string | null;
          price_dkk: number | null;
          industries: string[] | null;
          focus_areas: string[] | null;
          profiles: { name?: string | null } | null;
        }>).map((profile) => ({
          id: profile.id,
          name: profile.profiles?.name ?? '',
          title: profile.title ?? '',
          company: profile.company ?? '',
          industries: profile.industries ?? [],
          focusAreas: profile.focus_areas ?? [],
          price: profile.price_dkk ?? 600,
        })).filter((profile) => profile.name));
      }

      setProfilesLoading(false);
    }

    fetchFeatured();
  }, []);

  const fields = [
    ['AI', '/fields/ai', 'bg-cyan-300', isDa ? 'Produkt, strategi, portfolio og rollevalg.' : 'Product, strategy, portfolio and role choice.'],
    ['Banking', '/fields/banking', 'bg-emerald-300', isDa ? 'Technicals, fit, CV og interview.' : 'Technicals, fit, CV and interviews.'],
    ['Management Consulting', '/fields/consulting', 'bg-blue-300', isDa ? 'Cases, hypoteser, kommunikation og fit.' : 'Cases, hypotheses, communication and fit.'],
    ['Private Equity', '/fields/private-equity', 'bg-lime-300', isDa ? 'Investment cases, deal thinking og interview.' : 'Investment cases, deal thinking and interviews.'],
  ] as const;

  const steps = [
    [Search, isDa ? 'Vælg dit fokus' : 'Choose your focus', isDa ? 'Fortæl kort, hvad du vil være skarpere på.' : 'Briefly describe what you want to sharpen.'],
    [Target, isDa ? 'Find den rette profil' : 'Find the right profile', isDa ? 'Sammenlign erfaring, speciale og pris.' : 'Compare experience, specialty and price.'],
    [CalendarDays, isDa ? 'Book 60 minutter' : 'Book 60 minutes', isDa ? 'Vælg et tidspunkt og send dit korte brief.' : 'Choose a time and send your short brief.'],
  ] as const;

  const priceAnchors = [
    ['DKK 600', isDa ? 'Fra' : 'From', 'DKK 240'],
    ['DKK 900', isDa ? 'Standard' : 'Standard', 'DKK 360'],
    ['DKK 1.200', isDa ? 'Erfaren' : 'Senior', 'DKK 480'],
    ['DKK 1.800', isDa ? 'Specialist' : 'Specialist', 'DKK 720'],
  ] as const;

  return (
    <>
      <section id="home" className="bg-white px-5 pb-16 pt-16 sm:px-8 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="mb-6 text-xs font-black uppercase text-gray-400">Naetwork</p>
              <h1 className="max-w-4xl text-4xl font-black leading-[0.96] text-gray-950 text-balance sm:text-6xl md:text-7xl">
                {isDa ? 'Karrieresparring med mening.' : 'Career guidance with meaning.'}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-xl">
                {isDa
                  ? 'Book en fokuseret session med en erfaren professional fra AI, Banking, Management Consulting eller Private Equity.'
                  : 'Book a focused session with an experienced professional from AI, Banking, Management Consulting or Private Equity.'}
              </p>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-gray-500 md:text-base">
                {isDa
                  ? '60 minutter fra DKK 600. Minimum 40% af betalingen går til Kræftens Bekæmpelse.'
                  : '60 minutes from DKK 600. At least 40% of the payment goes to Kræftens Bekæmpelse.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/professionals" className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800">
                  {isDa ? 'Se profiler' : 'Browse profiles'}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/match" className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:border-gray-950 hover:bg-gray-50">
                  {isDa ? 'Find dit fokus' : 'Find your focus'}
                </Link>
              </div>
            </div>

            <aside className="border border-gray-200 bg-[#f7f7f4] p-5">
              <div className="grid h-1.5 grid-cols-4 overflow-hidden rounded-full bg-gray-200">
                {fields.map(([field, , accent]) => <span key={field} className={accent} />)}
              </div>
              <p className="mt-6 text-xs font-black uppercase text-gray-400">{isDa ? 'Én fokuseret session' : 'One focused session'}</p>
              <p className="mt-3 text-2xl font-black leading-tight text-gray-950">
                {isDa ? 'Ét konkret problem. Ét klart næste skridt.' : 'One concrete problem. One clear next step.'}
              </p>
              <dl className="mt-6 border-t border-gray-200">
                {[
                  ['60 min', isDa ? 'Fast format' : 'Fixed format'],
                  ['DKK 600+', isDa ? 'Pris før booking' : 'Price before booking'],
                  ['40-90%', isDa ? 'Til kræftsagen' : 'To the cancer cause'],
                ].map(([value, label]) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b border-gray-200 py-3">
                    <dt className="text-sm text-gray-500">{label}</dt>
                    <dd className="text-sm font-black text-gray-950">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <div className="mt-16 grid border-y border-gray-200 md:grid-cols-4">
            {fields.map(([field, href, accent, body]) => (
              <Link key={field} href={href} className="group border-b border-gray-200 py-6 transition-colors hover:bg-gray-50 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0">
                <span className={`mb-6 block h-1.5 w-10 rounded-full ${accent}`} />
                <p className="text-lg font-black text-gray-950">{field}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-gray-200 bg-[#f7f7f4] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Sådan fungerer det' : 'How it works'}</p>
              <h2 className="text-4xl font-black leading-tight text-gray-950 text-balance md:text-5xl">
                {isDa ? 'Fra spørgsmål til klarhed.' : 'From question to clarity.'}
              </h2>
            </div>
            <div className="grid border-t border-gray-300 md:grid-cols-3">
              {steps.map(([Icon, title, body], index) => (
                <div key={title} className="border-b border-gray-300 py-6 md:border-b-0 md:border-r md:px-6 md:last:border-r-0">
                  <div className="flex items-center justify-between">
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                    <span className="text-xs font-black text-gray-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-black text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="profile-universe" className="bg-white px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Profiler' : 'Profiles'}</p>
              <h2 className="text-4xl font-black leading-tight text-gray-950 text-balance md:text-5xl">
                {isDa ? 'Find erfaring, der passer til dit mål.' : 'Find experience that fits your goal.'}
              </h2>
            </div>
            <Link href="/professionals" className="inline-flex w-fit items-center gap-2 text-sm font-black text-gray-950 hover:text-gray-600">
              {isDa ? 'Se alle profiler' : 'View all profiles'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {profilesLoading ? (
            <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-3" aria-label={isDa ? 'Indlæser profiler' : 'Loading profiles'}>
              {[0, 1, 2].map((item) => <div key={item} className="h-32 animate-pulse bg-[#f7f7f4]" />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="border-t border-gray-200">
              {featured.map((profile) => (
                <Link key={profile.id} href={`/professionals/${profile.id}`} className="grid gap-4 border-b border-gray-200 py-5 transition-colors hover:bg-gray-50 md:grid-cols-[52px_170px_1fr_1fr_130px] md:items-center md:px-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg text-xs font-black text-gray-950 ${accentForIndustry(profile.industries[0])}`}>{initials(profile.name)}</span>
                  <p className="text-xs font-black uppercase text-gray-400">{profile.industries[0] ?? (isDa ? 'Professional' : 'Professional')}</p>
                  <div>
                    <p className="text-lg font-black text-gray-950">{profile.name}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-500">{profile.title}{profile.company ? ` · ${profile.company}` : ''}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{primaryFocus(profile.focusAreas, isDa)}</p>
                  <div className="md:text-right">
                    <p className="text-sm font-black text-gray-950">DKK {profile.price.toLocaleString('da-DK')}</p>
                    <p className="mt-1 text-xs text-gray-400">60 min</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 border-y border-gray-200 bg-[#f7f7f4] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div>
                <p className="text-xl font-black text-gray-950">{isDa ? 'De første profiler er på vej.' : 'The first profiles are on their way.'}</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{isDa ? 'Vi publicerer kun profiler, når deres erfaring og fokus er gennemgået.' : 'We only publish profiles after reviewing their experience and focus.'}</p>
              </div>
              <Link href="/professional/signup" className="inline-flex w-fit items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">
                {isDa ? 'Bliv professional' : 'Become a professional'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="pricing" className="bg-gray-950 px-5 py-16 text-white sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-white/40">{isDa ? 'Priser' : 'Pricing'}</p>
              <h2 className="text-4xl font-black leading-tight text-white text-balance md:text-5xl">
                {isDa ? '60 minutter. En tydelig pris.' : '60 minutes. One clear price.'}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
                {isDa
                  ? 'Den enkelte professional fastsætter prisen mellem DKK 600 og DKK 1.800. Du ser altid pris og minimumsbidrag før booking.'
                  : 'Each professional sets a price between DKK 600 and DKK 1,800. You always see the price and minimum contribution before booking.'}
              </p>
            </div>
            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
              {priceAnchors.map(([price, label, impact]) => (
                <div key={price} className="bg-gray-950 p-5">
                  <p className="text-xs font-black uppercase text-white/40">{label}</p>
                  <p className="mt-4 text-xl font-black text-white">{price}</p>
                  <p className="mt-2 text-xs text-white/50">{isDa ? `Min. ${impact} til kræftsagen` : `Min. ${impact} to the cancer cause`}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-5 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-2xl font-black leading-tight text-white md:text-3xl">
              {isDa ? 'Klar til at finde den rette sparringspartner?' : 'Ready to find the right sparring partner?'}
            </p>
            <Link href="/professionals" className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100">
              {isDa ? 'Se profiler' : 'Browse profiles'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
