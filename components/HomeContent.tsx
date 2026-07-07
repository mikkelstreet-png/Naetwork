'use client';

import Image from 'next/image';
import Link from 'next/link';
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
import { useLanguage } from '@/context/LanguageContext';
import { HERO_SPECTRUM } from '@/lib/heroSpectrum';
import {
  CONTRIBUTION_MAX,
  CONTRIBUTION_MIN,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_OPTIONS,
  SESSION_MINUTES,
  contributionAmount,
  formatDkk,
} from '@/lib/platform';

export function HomeContent() {
  const { lang } = useLanguage();
  const isDa = lang === 'da';

  const fields = [
    {
      name: 'AI',
      href: '/fields/ai',
      color: 'bg-[#bcecf0]',
      body: isDa ? 'Rollevalg · positionering · produkt' : 'Role choice · positioning · product',
    },
    {
      name: 'Banking',
      href: '/fields/banking',
      color: 'bg-[#ccead8]',
      body: isDa ? 'Technicals · motivation · interview' : 'Technicals · motivation · interviews',
    },
    {
      name: 'Management Consulting',
      href: '/fields/consulting',
      color: 'bg-[#cdddf2]',
      body: isDa ? 'Cases · struktur · personlig fit' : 'Cases · structure · personal fit',
    },
    {
      name: 'Private Equity',
      href: '/fields/private-equity',
      color: 'bg-[#dce8ad]',
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
    [Search, isDa ? 'Sammenlign' : 'Compare', isDa ? 'Rolle, virksomhed, fokus, pris og bidrag.' : 'Role, company, focus, price and contribution.'],
    [Target, isDa ? 'Definér målet' : 'Define the goal', isDa ? 'Beskriv den beslutning eller færdighed, du vil skærpe.' : 'Describe the decision or skill you want to sharpen.'],
    [CalendarDays, isDa ? 'Anmod om tid' : 'Request a time', isDa ? 'Vælg et ønsket tidspunkt og del dit korte brief.' : 'Choose a preferred time and share your short brief.'],
    [CheckCircle2, isDa ? 'Få bekræftet' : 'Get confirmed', isDa ? 'Den professionelle accepterer eller foreslår en ændring.' : 'The professional accepts or proposes a change.'],
  ] as const;

  const profileFacts = [
    [isDa ? 'Baggrund' : 'Background', isDa ? 'Rolle, virksomhed og LinkedIn gennemgås' : 'Role, company and LinkedIn are reviewed'],
    [isDa ? 'Fokus' : 'Focus', isDa ? 'Konkrete emner og forventet output' : 'Concrete topics and expected output'],
    [isDa ? 'Pris' : 'Price', `${formatDkk(PRICE_MIN)}-${PRICE_MAX.toLocaleString('da-DK')} / ${SESSION_MINUTES} min`],
    [isDa ? 'Bidrag' : 'Impact', `${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}% ${isDa ? 'ved gennemført betaling' : 'once completed and paid'}`],
  ] as const;

  return (
    <main>
      <section id="home" className="relative isolate min-h-[calc(100svh-7.5rem)] overflow-hidden bg-[#09090b] text-white md:min-h-[calc(100svh-8rem)]">
        <Image src={HERO_SPECTRUM} alt="" fill priority unoptimized sizes="100vw" className="-z-20 object-cover object-center opacity-65" />
        <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true" />

        <div className="mx-auto flex min-h-[calc(100svh-7.5rem)] max-w-[82rem] flex-col px-5 pb-0 pt-5 sm:px-8 sm:pt-6 md:min-h-[calc(100svh-8rem)] lg:px-12">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <p className="editorial-label text-white/60">Naetwork / Career access</p>
            <p className="editorial-label hidden text-right text-white/45 sm:block">AI · Banking · Consulting · Private Equity</p>
          </div>

          <div className="flex flex-1 items-center py-7 sm:py-8 md:py-7">
            <div className="max-w-[970px]">
              <p className="kicker mb-6 text-white/65">{isDa ? 'Karrieresparring med mening' : 'Career guidance with purpose'}</p>
              <h1 className="max-w-[1000px] text-[2.75rem] font-medium leading-[0.92] text-white text-balance sm:text-6xl md:text-[4.6rem] lg:text-[4.8rem]">
                {isDa ? 'Karrieresparring med den rette erfaring.' : 'Career guidance with the right experience.'}
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-white/72 sm:mt-8 sm:text-lg md:text-xl md:leading-8">
                {isDa
                  ? '60 fokuserede minutter med en gennemgået professionel fra den verden, du vil forstå, søge ind i eller avancere i.'
                  : '60 focused minutes with a reviewed professional from the world you want to understand, enter or advance in.'}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
                <Link href="/professionals" className="button-inverse w-full sm:w-auto">
                  {isDa ? 'Sammenlign professionelle' : 'Compare professionals'}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/match" className="button-ghost-light w-full sm:w-auto">
                  {isDa ? 'Find mit fokus' : 'Find my focus'}
                </Link>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-3 border-x border-t border-white/20 bg-black/18 backdrop-blur-md">
            {[
              [`${SESSION_MINUTES} min`, isDa ? 'Fokuseret 1:1' : 'Focused 1:1'],
              [<><span className="sm:hidden">DKK 600+</span><span className="hidden sm:inline">{formatDkk(PRICE_MIN)}-{PRICE_MAX.toLocaleString('da-DK')}</span></>, isDa ? 'Fast pris' : 'Fixed price'],
              [`${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}%`, isDa ? 'Afsættes' : 'Allocated'],
            ].map(([value, label], index) => (
              <div key={index} className="border-r border-white/20 px-3 py-4 last:border-r-0 sm:px-5 sm:py-5 md:flex md:items-end md:justify-between md:gap-4">
                <dd className="font-['Space_Grotesk'] text-base font-semibold text-white sm:text-xl md:text-2xl">{value}</dd>
                <dt className="mt-1 text-[10px] font-semibold leading-tight text-white/48 sm:text-xs md:mt-0 md:max-w-24 md:text-right">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[#cacac2] bg-white px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-6 border-t border-[#cacac2] pt-6 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <p className="kicker">{isDa ? 'Fire erfaringsspor' : 'Four experience tracks'}</p>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-3xl text-3xl font-medium leading-[1.02] text-gray-950 text-balance sm:text-5xl md:text-6xl">
                {isDa ? 'Vælg den verden, du vil tættere på.' : 'Choose the world you want to get closer to.'}
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">{isDa ? 'Fire felter. Samme præcise 60-minutters format.' : 'Four fields. The same precise 60-minute format.'}</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 overflow-hidden border border-black/15 lg:grid-cols-4">
            {fields.map((field, index) => (
              <Link key={field.name} href={field.href} className={`field-slab group relative flex min-h-[200px] flex-col justify-between border-b border-r border-black/15 p-4 text-gray-950 even:border-r-0 sm:min-h-[250px] sm:p-5 lg:border-b-0 lg:even:border-r lg:last:border-r-0 ${field.color}`}>
                <div className="flex items-center justify-between">
                  <span className="editorial-label text-gray-700">N/{String(index + 1).padStart(2, '0')}</span>
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={19} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-[1.05] sm:text-3xl">{field.name}</h3>
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-gray-700">{field.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#09090b] px-5 py-16 text-white sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <p className="kicker mb-6 text-white/45">{isDa ? 'Én session. Dit fokus.' : 'One session. Your focus.'}</p>
              <h2 className="max-w-xl text-4xl font-medium leading-[1] text-white text-balance sm:text-5xl md:text-6xl">
                {isDa ? 'Kom med et konkret spørgsmål. Gå med et skarpere næste træk.' : 'Bring a concrete question. Leave with a sharper next move.'}
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/55 md:text-base">
                {isDa ? 'Dit brief sætter retningen. Den professionelle bringer erfaringen, konteksten og det ærlige modspil.' : 'Your brief sets the direction. The professional brings experience, context and honest challenge.'}
              </p>
            </div>

            <div className="grid border-l border-t border-white/16 sm:grid-cols-2">
              {outcomes.map(({ icon: Icon, title, body }, index) => (
                <article key={title} className="group min-h-[230px] border-b border-r border-white/16 p-6 transition-colors duration-300 hover:bg-white/[0.045] sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/75"><Icon size={17} strokeWidth={1.7} aria-hidden="true" /></span>
                    <span className="editorial-label text-white/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-10 text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-[#cacac2] bg-[#f1f1ec] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <div>
              <p className="kicker mb-5">{isDa ? 'Fra valg til session' : 'From choice to session'}</p>
              <h2 className="text-4xl font-medium leading-none text-gray-950 sm:text-5xl">{isDa ? 'Fire klare trin.' : 'Four clear steps.'}</h2>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:justify-self-end md:text-right">{isDa ? 'Ingen pakker eller komplicerede valg. Find erfaringen, definer målet og send en anmodning.' : 'No packages or complicated choices. Find the experience, define the goal and send a request.'}</p>
          </div>

          <ol className="process-grid mt-10 grid border-l border-t border-[#bfbfb7] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([Icon, title, body], index) => (
              <li key={title} className="relative min-h-[245px] border-b border-r border-[#bfbfb7] bg-white/45 p-6 sm:p-7">
                <div className={`absolute inset-x-0 top-0 h-1 ${fields[index].color}`} aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                  <span className="editorial-label">0{index + 1}</span>
                </div>
                <h3 className="mt-12 text-xl font-semibold text-gray-950">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="profile-universe" className="bg-white px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-8 border-t border-[#cacac2] pt-6 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <p className="kicker">{isDa ? 'Profilstandarden' : 'The profile standard'}</p>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-3xl text-4xl font-medium leading-[1] text-gray-950 text-balance sm:text-5xl md:text-6xl">
                {isDa ? 'Sammenlign signal. Fjern støj.' : 'Compare signal. Remove noise.'}
              </h2>
              <Link href="/professionals" className="button-secondary w-fit whitespace-nowrap">
                {isDa ? 'Se profiluniverset' : 'Explore profiles'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid overflow-hidden border border-black/15 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative flex min-h-[380px] flex-col justify-between bg-[#09090b] p-6 text-white sm:p-8">
              <div className="signal-rail absolute inset-x-0 top-0"><span /><span /><span /><span /></div>
              <div className="flex items-start justify-between">
                <p className="editorial-label text-white/45">Profile record / N-01</p>
                <span className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase text-white/65"><Check size={12} aria-hidden="true" /> {isDa ? 'Gennemgået' : 'Reviewed'}</span>
              </div>
              <div>
                <p className="max-w-md font-['Space_Grotesk'] text-3xl font-medium leading-tight sm:text-4xl">{isDa ? 'Den erfaring, der er relevant for dit konkrete næste skridt.' : 'The experience relevant to your concrete next step.'}</p>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">{isDa ? 'Ikke popularitet. Ikke generiske ratings. Dokumenteret baggrund, tydeligt fokus og kendte vilkår.' : 'Not popularity. Not generic ratings. Documented background, clear focus and known terms.'}</p>
              </div>
            </div>

            <dl className="divide-y divide-[#d8d8d1] bg-[#f4f4ef]">
              {profileFacts.map(([label, value], index) => (
                <div key={label} className="grid gap-3 p-5 sm:grid-cols-[120px_1fr] sm:items-center sm:p-6">
                  <dt className="editorial-label">0{index + 1} / {label}</dt>
                  <dd className="font-['Space_Grotesk'] text-base font-semibold leading-snug text-gray-950 sm:text-lg">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 grid border-y border-[#d4d4cd] sm:grid-cols-3">
            {[
              isDa ? 'Profilen viser konkret, hvad sessionen kan bruges til' : 'The profile shows what the session can be used for',
              isDa ? 'En anmodning er først en aftale, når tiden er bekræftet' : 'A request becomes an agreement once the time is confirmed',
              isDa ? 'Der trækkes ingen betaling, før checkout er aktiveret' : 'No payment is collected until checkout is enabled',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 border-b border-[#d4d4cd] py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
                <Check className="mt-0.5 shrink-0" size={15} strokeWidth={2.2} aria-hidden="true" />
                <p className="text-xs font-semibold leading-relaxed text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#09090b] px-5 py-16 text-white sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-8 border-t border-white/20 pt-6 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <p className="kicker text-white/45">{isDa ? 'Pris og bidrag' : 'Price and contribution'}</p>
            <div>
              <h2 className="max-w-4xl text-4xl font-medium leading-[1] text-white text-balance sm:text-5xl md:text-6xl">
                {isDa ? 'Fire priser. Ét transparent format.' : 'Four prices. One transparent format.'}
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/52 md:text-base">
                {isDa ? `Den professionelle vælger ét prisniveau. Minimum ${CONTRIBUTION_MIN}% og op til ${CONTRIBUTION_MAX}% af en gennemført, betalt session afsættes til støtte for Kræftens Bekæmpelse.` : `The professional selects one price point. At least ${CONTRIBUTION_MIN}% and up to ${CONTRIBUTION_MAX}% of a completed, paid session is allocated in support of Kræftens Bekæmpelse.`}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/20">
            <div className="hidden grid-cols-[90px_1fr_1fr_120px] gap-6 border-b border-white/20 py-3 md:grid">
              <p className="editorial-label text-white/30">Level</p>
              <p className="editorial-label text-white/30">{isDa ? 'Sessionspris' : 'Session price'}</p>
              <p className="editorial-label text-white/30">{isDa ? 'Minimum afsættes' : 'Minimum allocated'}</p>
              <p className="editorial-label text-right text-white/30">Format</p>
            </div>
            {PRICE_OPTIONS.map((amount, index) => (
              <div key={amount} className="price-row group grid grid-cols-[46px_1fr_auto] items-center gap-4 border-b border-white/20 py-5 transition-colors duration-300 hover:bg-white/[0.04] md:grid-cols-[90px_1fr_1fr_120px] md:gap-6 md:px-3 md:py-6">
                <p className="editorial-label text-white/35">0{index + 1}</p>
                <div>
                  <p className="font-['Space_Grotesk'] text-2xl font-medium text-white md:text-3xl">{formatDkk(amount)}</p>
                  <p className="mt-1 text-[10px] font-semibold leading-tight text-white/38 md:hidden">{isDa ? `Min. ${formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))} afsættes` : `Min. ${formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))} allocated`}</p>
                </div>
                <p className="hidden text-sm font-semibold text-white/60 md:block">{formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))}</p>
                <p className="text-right text-xs font-semibold text-white/45">{SESSION_MINUTES} min</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-['Space_Grotesk'] text-2xl font-medium text-white md:text-3xl">{isDa ? 'Find den rette sparringspartner.' : 'Find the right sparring partner.'}</p>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/40">{isDa ? 'Bookinganmodninger er aktive. Betaling er endnu ikke aktiveret.' : 'Booking requests are active. Payments are not yet enabled.'}</p>
            </div>
            <Link href="/professionals" className="button-inverse w-fit">
              {isDa ? 'Sammenlign profiler' : 'Compare profiles'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
