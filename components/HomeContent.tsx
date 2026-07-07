'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Compass,
  FileText,
  MessageSquare,
  Search,
  Target,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  CONTRIBUTION_MAX,
  CONTRIBUTION_MIN,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_OPTIONS,
  SESSION_MINUTES,
  contributionAmount,
  formatDkk,
  industryAccent,
} from '@/lib/platform';
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
  return industryAccent(industry);
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
  const [profilesError, setProfilesError] = useState(false);

  const fetchFeatured = useCallback(async () => {
    setProfilesLoading(true);
    setProfilesError(false);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_public_professionals').limit(3);

      if (error) {
        setProfilesError(true);
        return;
      }

      if (data) {
        const rows = data as Array<{
          id: string;
          name: string | null;
          title: string | null;
          company: string | null;
          price_dkk: number | null;
          industries: string[] | null;
          focus_areas: string[] | null;
        }>;
        setFeatured(rows.map((profile) => ({
          id: profile.id,
          name: profile.name ?? '',
          title: profile.title ?? '',
          company: profile.company ?? '',
          industries: profile.industries ?? [],
          focusAreas: profile.focus_areas ?? [],
          price: profile.price_dkk ?? PRICE_MIN,
        })).filter((profile) => profile.name));
      }
    } catch {
      setProfilesError(true);
    } finally {
      setProfilesLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFeatured();
  }, [fetchFeatured]);

  const fields = [
    {
      name: 'AI',
      href: '/fields/ai',
      color: 'bg-[#d8f7fb]',
      body: isDa ? 'Rollevalg · positionering · produkt' : 'Role choice · positioning · product',
    },
    {
      name: 'Banking',
      href: '/fields/banking',
      color: 'bg-[#dff4e7]',
      body: isDa ? 'Technicals · motivation · interview' : 'Technicals · motivation · interviews',
    },
    {
      name: 'Management Consulting',
      href: '/fields/consulting',
      color: 'bg-[#dfeafb]',
      body: isDa ? 'Cases · struktur · personlig fit' : 'Cases · structure · personal fit',
    },
    {
      name: 'Private Equity',
      href: '/fields/private-equity',
      color: 'bg-[#edf4cf]',
      body: isDa ? 'Investment cases · deals · interview' : 'Investment cases · deals · interviews',
    },
  ] as const;

  const outcomes = [
    {
      icon: Compass,
      title: isDa ? 'Afklar din retning' : 'Clarify your direction',
      body: isDa ? 'Test rollevalg og positionering mod erfaring fra det felt, du overvejer.' : 'Test role choice and positioning against experience from the field you are considering.',
    },
    {
      icon: MessageSquare,
      title: isDa ? 'Forbered dit interview' : 'Prepare for your interview',
      body: isDa ? 'Træn motivation, svar og personlige eksempler mod den relevante interviewbarre.' : 'Practice motivation, answers and personal examples against the relevant interview bar.',
    },
    {
      icon: Target,
      title: isDa ? 'Skærp din case' : 'Sharpen your case',
      body: isDa ? 'Få modspil på struktur, antagelser og kommunikation, før det gælder.' : 'Pressure-test structure, assumptions and communication before it counts.',
    },
    {
      icon: FileText,
      title: isDa ? 'Forbedr dit materiale' : 'Improve your materials',
      body: isDa ? 'Prioritér konkrete ændringer til CV, ansøgning eller LinkedIn.' : 'Prioritize concrete changes to your CV, application or LinkedIn.',
    },
  ] as const;

  const steps = [
    [Search, isDa ? 'Sammenlign erfaring' : 'Compare experience', isDa ? 'Se rolle, virksomhed, fokus, pris og bidrag.' : 'See role, company, focus, price and contribution.'],
    [Target, isDa ? 'Definér dit mål' : 'Define your goal', isDa ? 'Skriv, hvad du vil have afklaret eller forbedret.' : 'Describe what you want to clarify or improve.'],
    [CalendarDays, isDa ? 'Send en anmodning' : 'Send a request', isDa ? 'Vælg et ønsket tidspunkt og del dit korte brief.' : 'Choose a preferred time and share your short brief.'],
    [CheckCircle2, isDa ? 'Få tiden bekræftet' : 'Get the time confirmed', isDa ? 'Den professionelle accepterer eller foreslår en ændring.' : 'The professional accepts or proposes a change.'],
  ] as const;

  const priceColors = ['bg-[#d8f7fb]', 'bg-[#dff4e7]', 'bg-[#dfeafb]', 'bg-[#edf4cf]'] as const;

  return (
    <main>
      <section id="home" className="overflow-hidden border-b border-gray-200 bg-white px-5 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-14 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-16">
            <div>
              <p className="mb-4 text-[10px] font-black uppercase text-gray-400 sm:mb-5 sm:text-xs">
                {isDa ? '1:1 karrieresparring · 60 minutter' : '1:1 career guidance · 60 minutes'}
              </p>
              <h1 className="max-w-4xl text-[2.15rem] font-black leading-[0.98] text-gray-950 text-balance sm:text-6xl md:text-7xl">
                {isDa ? '60 minutter med erfaring fra den verden, du vil ind i.' : '60 minutes with experience from the world you want to enter.'}
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-gray-600 sm:mt-6 sm:text-base md:text-xl">
                {isDa
                  ? 'Sammenlign gennemgåede professionelle fra AI, Banking, Management Consulting og Private Equity. Brug sessionen på interview, case, CV eller din næste karrierebeslutning.'
                  : 'Compare reviewed professionals from AI, Banking, Management Consulting and Private Equity. Use the session for interviews, cases, materials or your next career decision.'}
              </p>
              <div className="mt-7 flex flex-col items-center gap-4 sm:mt-8 sm:flex-row">
                <Link href="/professionals" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800 sm:w-auto">
                  {isDa ? 'Sammenlign professionelle' : 'Compare professionals'}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/match" className="inline-flex min-h-11 items-center justify-center text-sm font-black text-gray-700 transition-colors hover:text-gray-950">
                  {isDa ? 'Hjælp mig med at vælge' : 'Help me choose'}
                </Link>
              </div>
            </div>

            <dl className="grid grid-cols-3 border-y border-gray-200 lg:grid-cols-1 lg:border-b-0 lg:border-t">
              {[
                [`${SESSION_MINUTES} min`, isDa ? 'Én fokuseret 1:1-session' : 'One focused 1:1 session'],
                [<><span className="sm:hidden">{formatDkk(PRICE_MIN)}+</span><span className="hidden sm:inline">{formatDkk(PRICE_MIN)}-{PRICE_MAX.toLocaleString('da-DK')}</span></>, isDa ? 'Hele prisen vises på profilen' : 'Full price shown on the profile'],
                [`${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}%`, isDa ? 'Ved gennemført betaling' : 'Once completed and paid'],
              ].map(([value, label], index) => (
                <div key={index} className="border-r border-gray-200 py-4 pr-3 last:border-r-0 lg:flex lg:items-center lg:justify-between lg:border-b lg:border-r-0 lg:pr-0">
                  <dt className="text-[11px] font-bold leading-tight text-gray-500 sm:text-xs lg:order-1">{label}</dt>
                  <dd className="mb-1 text-base font-black text-gray-950 sm:text-lg lg:mb-0">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 sm:mt-14 md:mt-16">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase text-gray-400">{isDa ? 'Vælg dit felt' : 'Choose your field'}</p>
              <p className="hidden text-xs font-semibold text-gray-400 sm:block">{isDa ? 'Fire fagområder. Ét enkelt format.' : 'Four fields. One simple format.'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {fields.map((field) => (
                <Link key={field.name} href={field.href} className={`group flex min-h-[132px] flex-col justify-between rounded-lg p-4 text-gray-950 transition-transform hover:-translate-y-0.5 sm:min-h-[160px] sm:p-5 ${field.color}`}>
                  <ArrowRight className="ml-auto transition-transform group-hover:translate-x-1" size={18} aria-hidden="true" />
                  <div>
                    <h2 className="text-base font-black leading-tight sm:text-lg">{field.name}</h2>
                    <p className="mt-2 hidden text-xs font-semibold leading-relaxed text-gray-700 sm:block">{field.body}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mt-3 h-24 overflow-hidden rounded-lg sm:h-32 md:mt-4 md:h-40" aria-hidden="true">
            <Image src="/naetwork-spectrum.webp" alt="" fill sizes="(max-width: 768px) 100vw, 1152px" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="content-auto bg-white px-5 py-12 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Dit fokus' : 'Your focus'}</p>
            <h2 className="text-3xl font-black leading-tight text-gray-950 text-balance sm:text-4xl md:text-5xl">
              {isDa ? 'Kom med ét konkret spørgsmål. Gå med et skarpere næste skridt.' : 'Bring one concrete question. Leave with a sharper next step.'}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-gray-600 md:text-base">
              {isDa
                ? 'Du booker ikke en standardpakke. Dit brief sætter retningen, og profilen viser på forhånd, hvad den professionelle konkret kan hjælpe med.'
                : 'You are not booking a standard package. Your brief sets the direction, and the profile shows what the professional can specifically help with.'}
            </p>
          </div>
          <div className="border-t border-gray-200">
            {outcomes.map(({ icon: Icon, title, body }) => (
              <div key={title} className="grid grid-cols-[28px_1fr] gap-3 border-b border-gray-200 py-5 sm:grid-cols-[32px_210px_1fr] sm:items-center sm:gap-5">
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
                <h3 className="text-base font-black leading-tight text-gray-950">{title}</h3>
                <p className="col-start-2 text-sm leading-relaxed text-gray-600 sm:col-start-3">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="content-auto border-y border-gray-200 bg-[#f7f7f4] px-5 py-12 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Sådan fungerer det' : 'How it works'}</p>
              <h2 className="text-3xl font-black leading-tight text-gray-950 text-balance sm:text-4xl md:text-5xl">
                {isDa ? 'Fra mål til næste skridt.' : 'From goal to next step.'}
              </h2>
            </div>
            <ol className="grid border-t border-gray-300 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([Icon, title, body], index) => (
                <li key={title} className="border-b border-gray-300 py-6 sm:border-r sm:px-5 sm:even:border-r-0 lg:border-b-0 lg:even:border-r lg:last:border-r-0">
                  <div className="flex items-center justify-between">
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                    <span className="text-xs font-black text-gray-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-lg font-black text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="profile-universe" className="content-auto bg-white px-5 py-12 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{isDa ? 'Profiluniverset' : 'The profile universe'}</p>
              <h2 className="max-w-3xl text-3xl font-black leading-tight text-gray-950 text-balance sm:text-4xl md:text-5xl">
                {isDa ? 'Vælg på dokumenteret baggrund, ikke på støj.' : 'Choose based on documented experience, not noise.'}
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
          ) : !profilesError && featured.length > 0 ? (
            <div className="border-t border-gray-200">
              {featured.map((profile) => (
                <Link key={profile.id} href={`/professionals/${profile.id}`} className="grid grid-cols-[44px_1fr] gap-x-3 gap-y-3 border-b border-gray-200 py-5 transition-colors hover:bg-gray-50 md:grid-cols-[52px_170px_1fr_1fr_130px] md:items-center md:gap-4 md:px-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg text-xs font-black text-gray-950 ${accentForIndustry(profile.industries[0])}`}>{initials(profile.name)}</span>
                  <p className="self-center text-xs font-black uppercase text-gray-400 md:self-auto">{profile.industries[0] ?? (isDa ? 'Professionel' : 'Professional')}</p>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-lg font-black text-gray-950">{profile.name}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-500">{profile.title}{profile.company ? ` · ${profile.company}` : ''}</p>
                  </div>
                  <p className="col-span-2 text-sm leading-relaxed text-gray-600 md:col-span-1">{primaryFocus(profile.focusAreas, isDa)}</p>
                  <div className="col-span-2 flex items-center justify-between border-t border-gray-100 pt-3 md:col-span-1 md:block md:border-0 md:pt-0 md:text-right">
                    <p className="text-sm font-black text-gray-950">DKK {profile.price.toLocaleString('da-DK')}</p>
                    <p className="mt-1 text-xs text-gray-400">60 min</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 border-y border-gray-200 py-7 md:grid-cols-[1fr_auto] md:items-center md:py-9">
              <div>
                <p className="text-xl font-black text-gray-950">{isDa ? 'Søg efter den erfaring, du har brug for.' : 'Search for the experience you need.'}</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                  {isDa ? 'Profilservicen er midlertidigt utilgængelig. Du kan stadig se formatet og kontakte os, hvis du søger en bestemt baggrund.' : 'The profile service is temporarily unavailable. You can still review the format and contact us if you need a specific background.'}
                </p>
              </div>
              <Link href="/professionals" className="inline-flex min-h-12 w-fit items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">
                {isDa ? 'Kontrollér profilstatus' : 'Check profile status'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="mt-10 grid border-y border-gray-200 sm:grid-cols-3">
            {[
              isDa ? 'Rolle, virksomhed og LinkedIn gennemgås før publicering' : 'Role, company and LinkedIn are reviewed before publication',
              isDa ? 'Fokus, pris og minimumsbidrag vises før anmodningen' : 'Focus, price and minimum contribution are shown before the request',
              isDa ? 'En anmodning er først en aftale, når tiden er bekræftet' : 'A request becomes an agreement only when the time is confirmed',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 border-b border-gray-200 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0">
                <Check className="mt-0.5 shrink-0" size={16} strokeWidth={2.5} aria-hidden="true" />
                <p className="text-sm font-semibold leading-relaxed text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="content-auto bg-gray-950 px-5 py-12 text-white sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-14">
            <div>
              <p className="mb-4 text-xs font-black uppercase text-white/45">{isDa ? 'Pris og bidrag' : 'Price and contribution'}</p>
              <h2 className="text-3xl font-black leading-tight text-white text-balance sm:text-4xl md:text-5xl">
                {isDa ? 'Fire priser. Samme fokuserede format.' : 'Four prices. The same focused format.'}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
                {isDa
                  ? `Den professionelle vælger ét af fire prisniveauer. Minimum ${CONTRIBUTION_MIN}% og op til ${CONTRIBUTION_MAX}% af en gennemført, betalt session afsættes til støtte for Kræftens Bekæmpelse.`
                  : `The professional chooses one of four price points. At least ${CONTRIBUTION_MIN}% and up to ${CONTRIBUTION_MAX}% of a completed, paid session is allocated in support of Kræftens Bekæmpelse.`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {PRICE_OPTIONS.map((amount, index) => (
                <div key={amount} className={`min-h-[150px] rounded-lg p-4 text-gray-950 sm:p-5 ${priceColors[index]}`}>
                  <p className="text-[11px] font-black uppercase text-gray-600">{SESSION_MINUTES} min</p>
                  <p className="mt-5 text-lg font-black sm:text-xl">{formatDkk(amount)}</p>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-gray-700">
                    {isDa ? `Min. ${formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))} afsættes ved betaling` : `At least ${formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))} allocated when paid`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="max-w-2xl text-2xl font-black leading-tight text-white md:text-3xl">
                {isDa ? 'Find den rette sparringspartner.' : 'Find the right sparring partner.'}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/45">
                {isDa ? 'Bookinganmodninger er aktive. Der trækkes ingen betaling, før checkout og bidragsmodellen er endeligt aktiveret.' : 'Booking requests are active. No payment is collected until checkout and the contribution model are fully enabled.'}
              </p>
            </div>
            <Link href="/professionals" className="inline-flex min-h-12 w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100">
              {isDa ? 'Se profiler' : 'Browse profiles'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
