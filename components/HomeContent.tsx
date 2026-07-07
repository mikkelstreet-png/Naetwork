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
import { HERO_SPECTRUM } from '@/lib/heroSpectrum';

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
      <section id="home" className="relative isolate min-h-[calc(100svh-8.5rem)] overflow-hidden border-b border-black/10 bg-[#eef8f5] md:min-h-[calc(100svh-4.5rem)]">
        <Image src={HERO_SPECTRUM} alt="" fill priority unoptimized sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-white/36" aria-hidden="true" />
        <div className="mx-auto flex min-h-[calc(100svh-8.5rem)] max-w-[78rem] flex-col justify-between px-5 py-8 sm:px-8 sm:py-12 md:min-h-[calc(100svh-4.5rem)] md:py-14 lg:px-10">
          <div className="enter-up max-w-5xl">
            <p className="kicker mb-6 text-gray-700 sm:mb-8">
              {isDa ? '1:1 karrieresparring · 60 minutter' : '1:1 career guidance · 60 minutes'}
            </p>
            <h1 className="max-w-[960px] text-[2.7rem] font-semibold leading-[0.92] text-gray-950 text-balance sm:text-6xl md:text-[5.25rem] lg:text-[6.1rem]">
              {isDa ? 'Erfaring fra den verden, du vil ind i.' : 'Experience from the world you want to enter.'}
            </h1>
            <p className="enter-up enter-up-delay mt-6 max-w-2xl text-[16px] font-medium leading-7 text-gray-800 sm:mt-8 sm:text-lg md:text-xl md:leading-8">
              {isDa
                ? 'Book 60 minutters fokuseret sparring med gennemgåede professionelle fra AI, Banking, Management Consulting og Private Equity.'
                : 'Book 60 minutes of focused guidance with reviewed professionals from AI, Banking, Management Consulting and Private Equity.'}
            </p>
            <div className="enter-up enter-up-delay mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
              <Link href="/professionals" className="button-primary w-full px-6 sm:w-auto">
                {isDa ? 'Sammenlign professionelle' : 'Compare professionals'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/match" className="button-secondary w-full border-black/20 bg-white/65 backdrop-blur-md sm:w-auto">
                {isDa ? 'Find mit fokus' : 'Find my focus'}
              </Link>
            </div>
          </div>

          <dl className="mt-10 grid grid-cols-3 border-y border-black/20 bg-white/20 backdrop-blur-sm sm:mt-14">
            {[
              [`${SESSION_MINUTES} min`, isDa ? 'Session' : 'Session', isDa ? 'Ét mål. Én fokuseret session.' : 'One goal. One focused session.'],
              [<><span className="sm:hidden">DKK 600+</span><span className="hidden sm:inline">{formatDkk(PRICE_MIN)}-{PRICE_MAX.toLocaleString('da-DK')}</span></>, isDa ? 'Fast pris' : 'Fixed price', isDa ? 'Fast pris før du anmoder' : 'Fixed price before you request'],
              [`${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}%`, isDa ? 'Bidrag' : 'Impact', isDa ? 'Afsættes ved gennemført betaling' : 'Allocated once completed and paid'],
            ].map(([value, shortLabel, label], index) => (
              <div key={index} className="border-r border-black/20 px-2 py-4 last:border-r-0 sm:px-5 sm:py-5 sm:first:pl-0 lg:flex lg:items-center lg:justify-between lg:gap-5">
                <dd className="font-['Space_Grotesk'] text-sm font-bold leading-tight text-gray-950 sm:text-lg lg:text-xl">{value}</dd>
                <dt className="mt-1 text-[10px] font-semibold leading-tight text-gray-700 sm:mt-1 sm:text-xs lg:mt-0 lg:max-w-[150px] lg:text-right"><span className="sm:hidden">{shortLabel}</span><span className="hidden sm:inline">{label}</span></dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white px-5 py-12 sm:px-8 md:py-[4.5rem] lg:px-10">
        <div className="mx-auto max-w-[78rem]">
          <div className="mb-7 flex items-end justify-between gap-6">
            <div>
              <p className="kicker mb-4">{isDa ? 'Fire fagområder' : 'Four fields'}</p>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-gray-950 sm:text-4xl">{isDa ? 'Vælg den erfaring, der matcher dit næste træk.' : 'Choose the experience that matches your next move.'}</h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-relaxed text-gray-500 md:block">{isDa ? 'Samme format. Forskellig domæneerfaring.' : 'The same format. Different domain experience.'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {fields.map((field, index) => (
              <Link key={field.name} href={field.href} className={`group lift-hover flex min-h-[158px] flex-col justify-between rounded-md border border-black/5 p-4 text-gray-950 sm:min-h-[205px] sm:p-5 ${field.color}`}>
                <div className="flex items-center justify-between">
                  <span className="editorial-label text-gray-700">0{index + 1}</span>
                  <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-tight sm:text-2xl">{field.name}</h3>
                  <p className="mt-3 hidden text-xs font-semibold leading-relaxed text-gray-700 sm:block">{field.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="content-auto bg-white px-5 py-14 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto grid max-w-[78rem] gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <div>
            <p className="kicker mb-5">{isDa ? 'Dit fokus' : 'Your focus'}</p>
            <h2 className="text-3xl font-semibold leading-[1.04] text-gray-950 text-balance sm:text-4xl md:text-5xl">
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
              <div key={title} className="group grid grid-cols-[32px_1fr] gap-3 border-b border-gray-200 py-6 transition-colors hover:bg-[#fafaf7] sm:grid-cols-[36px_210px_1fr] sm:items-center sm:gap-5 sm:px-4">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                <h3 className="text-base font-semibold leading-tight text-gray-950">{title}</h3>
                <p className="col-start-2 text-sm leading-relaxed text-gray-600 sm:col-start-3">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="content-auto border-y border-gray-200 bg-[#f4f4f0] px-5 py-14 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-[78rem]">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="kicker mb-5">{isDa ? 'Sådan fungerer det' : 'How it works'}</p>
              <h2 className="text-3xl font-semibold leading-[1.04] text-gray-950 text-balance sm:text-4xl md:text-5xl">
                {isDa ? 'Fra mål til næste skridt.' : 'From goal to next step.'}
              </h2>
            </div>
            <ol className="grid border-t border-gray-300 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([Icon, title, body], index) => (
                <li key={title} className="border-b border-gray-300 py-7 sm:border-r sm:px-5 sm:even:border-r-0 lg:min-h-[250px] lg:border-b-0 lg:even:border-r lg:last:border-r-0">
                  <div className="flex items-center justify-between">
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                    <span className="editorial-label">0{index + 1}</span>
                  </div>
                  <h3 className="mt-10 text-xl font-semibold text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="profile-universe" className="content-auto bg-white px-5 py-14 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-[78rem]">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="kicker mb-5">{isDa ? 'Profiluniverset' : 'The profile universe'}</p>
              <h2 className="max-w-3xl text-3xl font-semibold leading-[1.04] text-gray-950 text-balance sm:text-4xl md:text-5xl">
                {isDa ? 'Vælg på dokumenteret baggrund, ikke på støj.' : 'Choose based on documented experience, not noise.'}
              </h2>
            </div>
            <Link href="/professionals" className="button-secondary w-fit">
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
                <Link key={profile.id} href={`/professionals/${profile.id}`} className="group grid grid-cols-[44px_1fr] gap-x-3 gap-y-3 border-b border-gray-200 py-5 transition-colors hover:bg-[#fafaf7] md:grid-cols-[52px_170px_1fr_1fr_130px] md:items-center md:gap-4 md:px-4 md:py-6">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-md font-['Space_Grotesk'] text-xs font-bold text-gray-950 transition-transform group-hover:-translate-y-0.5 ${accentForIndustry(profile.industries[0])}`}>{initials(profile.name)}</span>
                  <p className="self-center text-xs font-black uppercase text-gray-400 md:self-auto">{profile.industries[0] ?? (isDa ? 'Professionel' : 'Professional')}</p>
                  <div className="col-span-2 md:col-span-1">
                    <p className="font-['Space_Grotesk'] text-lg font-semibold text-gray-950">{profile.name}</p>
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
              <Link href="/professionals" className="button-primary w-fit">
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

      <section id="pricing" className="content-auto bg-[#09090b] px-5 py-14 text-white sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-[78rem]">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-14">
            <div>
              <p className="kicker mb-5 text-white/50">{isDa ? 'Pris og bidrag' : 'Price and contribution'}</p>
              <h2 className="text-3xl font-semibold leading-[1.04] text-white text-balance sm:text-4xl md:text-5xl">
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
                <div key={amount} className={`lift-hover min-h-[170px] rounded-md border border-white/10 p-4 text-gray-950 sm:p-5 ${priceColors[index]}`}>
                  <div className="flex items-center justify-between"><p className="editorial-label text-gray-700">{SESSION_MINUTES} min</p><p className="editorial-label text-gray-600">0{index + 1}</p></div>
                  <p className="mt-7 font-['Space_Grotesk'] text-2xl font-semibold sm:text-3xl">{formatDkk(amount)}</p>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-gray-700">
                    {isDa ? `Min. ${formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))} afsættes ved betaling` : `At least ${formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))} allocated when paid`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="max-w-2xl font-['Space_Grotesk'] text-2xl font-semibold leading-tight text-white md:text-3xl">
                {isDa ? 'Find den rette sparringspartner.' : 'Find the right sparring partner.'}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/45">
                {isDa ? 'Bookinganmodninger er aktive. Der trækkes ingen betaling, før checkout og bidragsmodellen er endeligt aktiveret.' : 'Booking requests are active. No payment is collected until checkout and the contribution model are fully enabled.'}
              </p>
            </div>
            <Link href="/professionals" className="button-secondary w-fit border-white bg-white">
              {isDa ? 'Se profiler' : 'Browse profiles'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
