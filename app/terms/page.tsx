import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Vilkår - Naetwork',
  description: 'Vilkår for brug af Naetwork, booking af 60-minutters sessioner og professionelle profiler.',
}

const updated = '18. juni 2026'

const keyPoints = [
  ['Format', '60 min 1:1 career session'],
  ['Pris', 'DKK 500-1.800, sat af den professionelle'],
  ['Platform', 'Naetwork forbinder kandidater og professionelle'],
  ['Impact', 'Donationer vises kun, hvor de er valgt og beskrevet'],
]

const sections = [
  {
    title: '1. Om Naetwork',
    body: [
      'Naetwork er en platform, der forbinder ambitiøse kandidater med professionelle fra AI, Banking, Management Consulting og Private Equity.',
      'Kerneproduktet er en 60-minutters 1:1 session, hvor kandidaten vælger fokus før booking. Det kan eksempelvis være CV, interview, case prep, technicals, AI career strategy eller karrierevalg.',
    ],
  },
  {
    title: '2. Platformens rolle',
    body: [
      'Naetwork stiller platformen til rådighed, så kandidater kan finde professionelle, sende bookinganmodninger og modtage relevant kommunikation.',
      'De professionelle er ansvarlige for den sparring, de leverer. Naetwork garanterer ikke jobtilbud, interviews, optagelse i bestemte virksomheder eller konkrete karriereresultater.',
    ],
  },
  {
    title: '3. Konto og adgang',
    body: [
      'Du skal give korrekte oplysninger, når du opretter konto. Du er ansvarlig for at holde dine loginoplysninger fortrolige.',
      'Naetwork kan begrænse eller lukke adgang, hvis en bruger misbruger platformen, giver urigtige oplysninger, overtræder lovgivning eller handler i strid med disse vilkår.',
    ],
  },
  {
    title: '4. Booking af sessioner',
    body: [
      'En bookinganmodning er først endelig, når den er bekræftet i platformen eller via relevant kommunikation.',
      'Kandidaten er ansvarlig for at møde forberedt og give den professionelle tilstrækkelig kontekst. Den professionelle er ansvarlig for at levere sessionen med rimelig omhu, professionalisme og fortrolighed.',
      'Hvis en session skal flyttes eller aflyses, skal det ske så tidligt som muligt og i overensstemmelse med de processer, Naetwork stiller til rådighed.',
    ],
  },
  {
    title: '5. Priser og betaling',
    body: [
      'Professionelle sætter selv prisen for en 60-minutters session inden for den ramme, Naetwork viser på platformen. Aktuelt er rammen DKK 500-1.800.',
      'Den konkrete pris vises før booking. Eventuelle platformgebyrer, udbetalinger og donationer håndteres efter de modeller, der er beskrevet i platformen på booking- eller profilniveau.',
      'Naetwork kan ændre prisrammer, gebyrer og betalingsmodeller fremadrettet. Ændringer påvirker ikke allerede bekræftede sessioner, medmindre andet er nødvendigt af tekniske eller juridiske årsager.',
    ],
  },
  {
    title: '6. Professionelle profiler',
    body: [
      'Professionelle skal give korrekte oplysninger om rolle, erfaring, virksomhed, fokusområder og pris.',
      'Naetwork kan skjule, afvise eller justere synlighed for profiler, hvis kvaliteten, dokumentationen eller indholdet ikke matcher platformens standarder.',
      'Professionelle må ikke love ansættelse, intern adgang, fortrolige oplysninger fra arbejdsgivere eller resultater, som de ikke kan kontrollere.',
    ],
  },
  {
    title: '7. Fortrolighed og adfærd',
    body: [
      'Brugere skal behandle hinanden respektfuldt og professionelt. Chikane, diskrimination, spam, vildledning eller forsøg på at omgå platformens sikkerhed accepteres ikke.',
      'Kandidater må ikke dele fortrolige materialer uden ret til det. Professionelle må ikke dele fortrolige oplysninger fra nuværende eller tidligere arbejdsgivere.',
    ],
  },
  {
    title: '8. Impact og donationer',
    body: [
      'Naetwork kan tilbyde modeller, hvor professionelle vælger at lade en del af honoraret gå til velgørende formål, herunder Kræftens Bekæmpelse.',
      'Naetwork er et uafhængigt initiativ og er ikke officielt tilknyttet Kræftens Bekæmpelse, medmindre det fremgår eksplicit. Donationer og platformgebyrer skal beskrives transparent der, hvor modellen anvendes.',
    ],
  },
  {
    title: '9. Ansvar og forbehold',
    body: [
      'Naetwork leveres som en platform under udvikling. Vi forsøger at holde information, profiler og funktioner korrekte, men kan ikke garantere uafbrudt drift eller fejlfrie oplysninger.',
      'Naetwork er ikke ansvarlig for indirekte tab, tabte muligheder, tabt indtjening eller beslutninger truffet på baggrund af en session, medmindre andet følger af ufravigelig lovgivning.',
    ],
  },
  {
    title: '10. Privatliv',
    body: [
      'Når du bruger Naetwork, behandler vi personoplysninger som beskrevet i privatlivspolitikken.',
    ],
    link: { href: '/privacy', label: 'Læs privatlivspolitik' },
  },
  {
    title: '11. Ændringer og kontakt',
    body: [
      'Vi kan opdatere disse vilkår, når produktet, forretningsmodellen eller lovgivningen ændrer sig. Den nyeste version fremgår altid på denne side.',
      'Spørgsmål kan sendes til kontakt@naetwork.dk.',
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="bg-[#f7f7f4] pt-16">
      <section className="border-b border-gray-200 bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="mb-8 inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:text-gray-950">&larr; Naetwork</Link>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Legal</p>
          <h1 className="max-w-4xl text-4xl font-black leading-none tracking-tight text-gray-950 md:text-6xl">Vilkår for brug</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">De klare spilleregler for kandidater, professionelle, booking, betaling og impact på Naetwork.</p>
          <p className="mt-6 text-sm font-medium text-gray-400">Senest opdateret: {updated}</p>
        </div>
      </section>

      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="mb-4 text-xs font-semibold uppercase text-gray-400">Overblik</p>
            <div className="space-y-4">
              {keyPoints.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-950">{value}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            {sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-black text-gray-950">{section.title}</h2>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-gray-600">{paragraph}</p>
                  ))}
                </div>
                {section.link && (
                  <Link href={section.link.href} className="mt-5 inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-950 hover:border-gray-950 hover:bg-gray-50">
                    {section.link.label}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
