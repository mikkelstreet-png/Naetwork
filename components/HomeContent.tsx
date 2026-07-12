'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
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
import { ACCESS_PATHS, BRAND_COPY, localized } from '@/lib/brand';
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

  const brand = BRAND_COPY[lang];
  const accessColors = ['bg-[#bcecf0]', 'bg-[#ccead8]', 'bg-[#cdddf2]', 'bg-[#dce8ad]'] as const;
  const fields = ACCESS_PATHS.map((path, index) => ({
    name: localized(path.label, lang),
    href: path.href,
    color: accessColors[index],
    body: localized(path.description, lang),
  }));

  const outcomes = [
    {
      icon: Compass,
      title: isDa ? 'Forstå arbejdet' : 'Understand the work',
      body: isDa ? 'Få den kontekst om rolle, virksomhed og forventninger, som jobopslaget ikke giver.' : 'Get the context on the role, company and expectations that the job description leaves out.',
    },
    {
      icon: MessageSquare,
      title: isDa ? 'Se hvor du står' : 'See where you stand',
      body: isDa ? 'Få et ærligt syn på dit udgangspunkt, dine stærkeste argumenter og de reelle huller.' : 'Get an honest view of your position, strongest arguments and real gaps.',
    },
    {
      icon: Target,
      title: isDa ? 'Forbered processen' : 'Prepare for the process',
      body: isDa ? 'Arbejd konkret med CV, ansøgning, interview, case eller forhandling.' : 'Work concretely on your CV, application, interview, case or negotiation.',
    },
    {
      icon: FileText,
      title: isDa ? 'Vælg næste skridt' : 'Choose the next step',
      body: isDa ? 'Afslut med klarhed om, hvad du bør gøre, ændre eller undersøge nu.' : 'Finish with clarity on what to do, change or investigate next.',
    },
  ] as const;

  const steps = [
    [Target, isDa ? 'Fortæl, hvad du overvejer' : 'Tell us what you are considering', isDa ? 'Start med rollen, virksomheden, ansøgningen eller beslutningen foran dig.' : 'Start with the role, company, application or decision in front of you.'],
    [Search, isDa ? 'Mød relevant erfaring' : 'Meet relevant experience', isDa ? 'Find mennesker, der kender situationen fra den anden side.' : 'Find people who know the situation from the other side.'],
    [CheckCircle2, isDa ? 'Gå videre med klarhed' : 'Leave with clarity', isDa ? 'Brug sessionen på ét konkret spørgsmål og prioritér næste skridt.' : 'Use the session for one concrete question and prioritize the next step.'],
  ] as const;

  const profileFacts = [
    [isDa ? 'Baggrund' : 'Background', isDa ? 'Rolle, virksomhed og LinkedIn gennemgås' : 'Role, company and LinkedIn are reviewed'],
    [isDa ? 'Fokus' : 'Focus', isDa ? 'Konkrete emner og forventet output' : 'Concrete topics and expected output'],
    [isDa ? 'Pris' : 'Price', `${formatDkk(PRICE_MIN)}-${PRICE_MAX.toLocaleString('da-DK')} ${isDa ? 'inkl. moms' : 'incl. VAT'} / ${SESSION_MINUTES} min`],
    [isDa ? 'Bidrag' : 'Impact', `${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}% ${isDa ? 'af pris ekskl. moms' : 'of the price excl. VAT'}`],
  ] as const;

  const faqs = [
    [
      isDa ? 'Hvad kan de 60 minutter bruges til?' : 'What can the 60 minutes be used for?',
      isDa ? 'Du vælger ét konkret fokus i dit brief, eksempelvis karriereretning, interview, case eller CV. Sessionen giver kvalificeret modspil og et skarpere næste træk, men lover ikke et bestemt karriereresultat.' : 'Choose one concrete focus in your brief, such as career direction, an interview, a case or your CV. The session provides informed challenge and a sharper next move, not a guaranteed career outcome.',
    ],
    [
      isDa ? 'Hvordan gennemgås de professionelle?' : 'How are professionals reviewed?',
      isDa ? 'Naetwork gennemgår den indsendte rolle, virksomhedserfaring og LinkedIn, før en profil kan publiceres. Det er en kvalitetskontrol, ikke en baggrundsundersøgelse eller garanti for et bestemt resultat.' : 'Naetwork reviews the submitted role, company experience and LinkedIn before a profile can be published. It is a quality check, not a background investigation or guarantee of a particular outcome.',
    ],
    [
      isDa ? 'Hvorfor varierer prisen?' : 'Why does the price vary?',
      isDa ? 'Den professionelle vælger mellem fire faste priser ud fra erfaring og fokus. Den samlede pris inklusive moms vises altid, før du sender en bookinganmodning.' : 'The professional selects one of four fixed prices based on experience and focus. The total price including VAT is always shown before you send a booking request.',
    ],
    [
      isDa ? 'Hvordan beregnes bidraget?' : 'How is the contribution calculated?',
      isDa ? 'Den professionelle vælger 40%, 60%, 80% eller 90% af sessionsprisen eksklusive moms. Det konkrete beløb vises før booking. Naetwork er et uafhængigt initiativ og ikke officielt tilknyttet Kræftens Bekæmpelse.' : 'The professional selects 40%, 60%, 80% or 90% of the session price excluding VAT. The exact amount is shown before booking. Naetwork is independent and is not officially affiliated with Kræftens Bekæmpelse.',
    ],
    [
      isDa ? 'Hvornår er bookingen bindende?' : 'When is the booking binding?',
      isDa ? 'Din anmodning bliver først til en aftale, når den professionelle bekræfter tidspunktet. Betaling er endnu ikke aktiveret, så der trækkes ikke et beløb nu.' : 'Your request becomes an appointment when the professional confirms the time. Payments are not enabled yet, so no amount is charged now.',
    ],
  ] as const;

  const priceTiers = isDa
    ? ['Specialist', 'Erfaren specialist / manager', 'Senior profil', 'Særligt erfaren profil']
    : ['Specialist', 'Experienced specialist / manager', 'Senior profile', 'Distinct senior expertise'];

  return (
    <main>
      <section id="home" className="relative isolate min-h-[calc(100svh-7.5rem)] overflow-hidden bg-[#09090b] text-white md:min-h-[calc(100svh-8rem)]">
        <Image src={HERO_SPECTRUM} alt="" fill priority quality={85} sizes="100vw" className="-z-20 object-cover object-center opacity-85 saturate-[1.12]" />
        <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden="true" />

        <div className="mx-auto flex min-h-[calc(100svh-7.5rem)] max-w-[82rem] flex-col px-5 pb-0 pt-5 sm:px-8 sm:pt-6 md:min-h-[calc(100svh-8rem)] lg:px-12">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <p className="editorial-label text-white/60">Naetwork / {brand.category}</p>
            <p className="editorial-label hidden text-right text-white/45 sm:block">{brand.positioning}</p>
          </div>

          <div className="flex flex-1 items-center py-7 sm:py-8 md:py-7">
            <div className="max-w-[970px]">
              <p className="kicker mb-6 text-white/65">{isDa ? 'Erfaringen bag jobbet' : 'The insight behind the job'}</p>
              <h1 className="max-w-[1000px] text-[2.75rem] font-medium leading-[0.92] text-white text-balance sm:text-6xl md:text-[4.6rem] lg:text-[4.8rem]">
                {brand.primaryLine}
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-white/72 sm:mt-8 sm:text-lg md:text-xl md:leading-8">
                {brand.oneSentence}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
                <Link href="/start" className="button-inverse w-full sm:w-auto">
                  {isDa ? 'Start med din situation' : 'Start with your situation'}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/how-it-works" className="button-ghost-light w-full sm:w-auto">
                  {isDa ? 'Se hvordan det fungerer' : 'See how it works'}
                </Link>
              </div>
            </div>
          </div>

          <div className="signal-rail" aria-hidden="true"><span /><span /><span /><span /></div>
          <dl className="grid grid-cols-3 border-x border-white/20 bg-black/25 backdrop-blur-md">
            {[
              [isDa ? 'Situation først' : 'Situation first', isDa ? 'Ikke et katalog' : 'Not a directory'],
              [isDa ? 'Relevant erfaring' : 'Relevant experience', isDa ? 'Ikke popularitet' : 'Not popularity'],
              [isDa ? 'Næste skridt' : 'Next step', isDa ? 'Konkret resultat' : 'Concrete outcome'],
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
            <p className="kicker">{isDa ? 'Fire indgange' : 'Four starting points'}</p>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-3xl text-3xl font-medium leading-[1.02] text-gray-950 text-balance sm:text-5xl md:text-6xl">
                {isDa ? 'Start der, hvor du står.' : 'Start where you are.'}
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">{isDa ? 'Explore, Prepare, Apply eller Perform hjælper dig med at vælge den relevante vej ind.' : 'Explore, Prepare, Apply or Perform helps you choose the relevant way in.'}</p>
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
              <p className="kicker mb-6 text-white/45">{isDa ? 'Hvorfor Naetwork findes' : 'Why Naetwork exists'}</p>
              <h2 className="max-w-xl text-4xl font-medium leading-[1] text-white text-balance sm:text-5xl md:text-6xl">
                {brand.problem}
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/55 md:text-base">
                {isDa ? 'Naetwork gør den viden mindre tilfældig og strukturerer den omkring beslutningen foran dig.' : 'Naetwork makes that knowledge less random and structures it around the decision in front of you.'}
              </p>
            </div>

            <div className="grid grid-cols-2 border-l border-t border-white/16">
              {outcomes.map(({ icon: Icon, title, body }, index) => (
                <article key={title} className="group relative min-h-[220px] border-b border-r border-white/16 p-4 transition-colors duration-300 hover:bg-white/[0.045] sm:min-h-[230px] sm:p-7">
                  <div className={`absolute inset-x-0 top-0 h-[3px] ${fields[index].color}`} aria-hidden="true" />
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center border border-white/20 text-white/75 sm:h-9 sm:w-9"><Icon size={16} strokeWidth={1.7} aria-hidden="true" /></span>
                    <span className="editorial-label text-white/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-base font-semibold leading-tight text-white sm:mt-10 sm:text-xl">{title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-white/52 sm:text-sm">{body}</p>
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
              <p className="kicker mb-5">{isDa ? 'Fra situation til næste skridt' : 'From situation to next step'}</p>
              <h2 className="text-4xl font-medium leading-none text-gray-950 sm:text-5xl">{isDa ? 'Tre klare trin.' : 'Three clear steps.'}</h2>
            </div>
            <p className="max-w-lg text-sm leading-relaxed text-gray-600 md:justify-self-end md:text-right">{isDa ? 'Fortæl, hvad du overvejer. Mød relevant erfaring. Gå videre med klarhed.' : 'Tell us what you are considering. Meet relevant experience. Leave with clarity.'}</p>
          </div>

          <ol className="process-grid mt-10 grid grid-cols-1 border-l border-t border-[#bfbfb7] sm:grid-cols-3">
            {steps.map(([Icon, title, body], index) => (
              <li key={title} className="relative min-h-[220px] border-b border-r border-[#bfbfb7] bg-white/45 p-4 sm:min-h-[245px] sm:p-7">
                <div className={`absolute inset-x-0 top-0 h-1 ${fields[index].color}`} aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                  <span className="editorial-label">0{index + 1}</span>
                </div>
                <h3 className="mt-9 text-base font-semibold leading-tight text-gray-950 sm:mt-12 sm:text-xl">{title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-gray-600 sm:text-sm">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="profile-universe" className="bg-white px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-8 border-t border-[#cacac2] pt-6 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <p className="kicker">{isDa ? 'Relevant erfaring' : 'Relevant experience'}</p>
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-3xl text-4xl font-medium leading-[1] text-gray-950 text-balance sm:text-5xl md:text-6xl">
                {isDa ? 'Se præcis, hvorfor erfaringen er relevant.' : 'See exactly why the experience is relevant.'}
              </h2>
              <Link href="/start" className="button-secondary w-fit whitespace-nowrap">
                {isDa ? 'Start med din situation' : 'Start with your situation'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-10 grid overflow-hidden border border-black/15 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative flex min-h-[330px] flex-col justify-between bg-[#09090b] p-6 text-white sm:min-h-[380px] sm:p-8">
              <div className="signal-rail absolute inset-x-0 top-0"><span /><span /><span /><span /></div>
              <div className="flex items-start justify-between">
                <p className="editorial-label text-white/45">Profile record / N-01</p>
                <span className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-[10px] font-bold uppercase text-white/65"><Check size={12} aria-hidden="true" /> {isDa ? 'Gennemgået' : 'Reviewed'}</span>
              </div>
              <div>
                <p className="max-w-md font-['Space_Grotesk'] text-[1.7rem] font-medium leading-tight sm:text-4xl">{isDa ? 'Relevans før titel. Erfaring før popularitet.' : 'Relevance before title. Experience before popularity.'}</p>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">{isDa ? 'Profilen viser, hvilke situationer personen kan hjælpe med, og hvad du konkret kan forvente af sessionen.' : 'The profile shows which situations the person can help with and what you can concretely expect from the session.'}</p>
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
                {isDa ? `Den professionelle vælger mellem fire faste priser og fire bidragsniveauer. ${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}% af sessionsprisen ekskl. moms afsættes efter en gennemført, betalt session.` : `The professional selects from four fixed prices and four contribution levels. ${CONTRIBUTION_MIN}-${CONTRIBUTION_MAX}% of the session price excl. VAT is allocated after a completed, paid session.`}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/20">
            <div className="hidden grid-cols-[90px_1fr_1.2fr_1fr_120px] gap-6 border-b border-white/20 py-3 md:grid">
              <p className="editorial-label text-white/30">{isDa ? 'Valg' : 'Option'}</p>
              <p className="editorial-label text-white/30">{isDa ? 'Pris inkl. moms' : 'Price incl. VAT'}</p>
              <p className="editorial-label text-white/30">{isDa ? 'Profilniveau' : 'Profile level'}</p>
              <p className="editorial-label text-white/30">{isDa ? 'Minimum afsættes' : 'Minimum allocated'}</p>
              <p className="editorial-label text-right text-white/30">Format</p>
            </div>
            {PRICE_OPTIONS.map((amount, index) => (
              <div key={amount} className="price-row group grid grid-cols-[46px_1fr_auto] items-center gap-4 border-b border-white/20 py-5 transition-colors duration-300 hover:bg-white/[0.04] md:grid-cols-[90px_1fr_1.2fr_1fr_120px] md:gap-6 md:px-3 md:py-6">
                <p className="editorial-label text-white/35">0{index + 1}</p>
                <div>
                  <p className="font-['Space_Grotesk'] text-2xl font-medium text-white md:text-3xl">{formatDkk(amount)}</p>
                  <p className="mt-1 text-[10px] font-semibold leading-tight text-white/38 md:hidden">{isDa ? `Min. ${formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))} afsættes` : `Min. ${formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))} allocated`}</p>
                  <p className="mt-1 text-[10px] font-semibold leading-tight text-white/55 md:hidden">{priceTiers[index]}</p>
                </div>
                <p className="hidden text-sm font-semibold text-white/68 md:block">{priceTiers[index]}</p>
                <p className="hidden text-sm font-semibold text-white/60 md:block">{formatDkk(contributionAmount(amount, CONTRIBUTION_MIN))}</p>
                <p className="text-right text-xs font-semibold text-white/45">{SESSION_MINUTES} min</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-['Space_Grotesk'] text-2xl font-medium text-white md:text-3xl">{isDa ? 'Find erfaringen bag dit næste valg.' : 'Find the experience behind your next decision.'}</p>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/40">{isDa ? 'Bidrag beregnes af prisen ekskl. moms. Bookinganmodninger er aktive; betaling er endnu ikke aktiveret.' : 'Contributions are calculated from the price excl. VAT. Booking requests are active; payments are not yet enabled.'}</p>
            </div>
            <Link href="/start" className="button-inverse w-fit">
              {isDa ? 'Start med din situation' : 'Start with your situation'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#cacac2] bg-[#f4f4ef] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="kicker mb-5">{isDa ? 'Før du booker' : 'Before you book'}</p>
            <h2 className="max-w-lg text-4xl font-medium leading-[1] text-gray-950 text-balance sm:text-5xl">{isDa ? 'Klare svar. Ingen småt gemt væk.' : 'Clear answers. Nothing important hidden.'}</h2>
          </div>
          <div className="border-t border-[#cacac2]">
            {faqs.map(([question, answer], index) => (
              <details key={question} className="group border-b border-[#cacac2] py-5 open:pb-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left marker:content-none">
                  <span className="flex min-w-0 items-start gap-4">
                    <span className="editorial-label mt-1 text-gray-400">0{index + 1}</span>
                    <span className="font-['Space_Grotesk'] text-base font-semibold text-gray-950 sm:text-lg">{question}</span>
                  </span>
                  <span className="relative h-5 w-5 shrink-0" aria-hidden="true"><span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-gray-950" /><span className="absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 bg-gray-950 transition-transform group-open:scale-y-0" /></span>
                </summary>
                <p className="ml-10 mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:ml-12">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
