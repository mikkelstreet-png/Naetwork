import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privatlivspolitik - Naetwork',
  description: 'Læs hvordan Naetwork behandler personoplysninger, cookies, bookingdata og e-mails.',
}

const updated = '30. juni 2026'
const legalName = process.env.NEXT_PUBLIC_LEGAL_NAME ?? 'Naetwork'
const legalAddress = process.env.NEXT_PUBLIC_LEGAL_ADDRESS
const legalRegistration = process.env.NEXT_PUBLIC_LEGAL_REGISTRATION

const quickFacts = [
  ['Dataansvarlig', legalName],
  ...(legalRegistration ? [['Registrering', legalRegistration]] : []),
  ...(legalAddress ? [['Adresse', legalAddress]] : []),
  ['Kontakt', 'kontakt@naetwork.dk'],
  ['Formål', 'Konto, booking, profiler, kommunikation og sikker drift'],
  ['Rettigheder', 'Indsigt, rettelse, sletning, begrænsning, dataportabilitet og indsigelse'],
]

const sections = [
  {
    title: '1. Kort fortalt',
    body: [
      `${legalName} er dataansvarlig og behandler kun de oplysninger, der er nødvendige for at drive platformen, oprette profiler, håndtere 60-minutters sessioner, sende relevante e-mails og sikre en tryg brugeroplevelse.`,
      'Vi sælger ikke personoplysninger. Vi bruger ikke oplysninger til skjult profilering, og vi forsøger at holde databehandlingen enkel, gennemsigtig og proportionel.',
    ],
  },
  {
    title: '2. Hvilke oplysninger vi behandler',
    body: [
      'Kontooplysninger: navn, e-mail, adgangskodehåndtering, rolle og loginstatus.',
      'Profiloplysninger: titel, virksomhed, branche, bio, fokusområder, pris, valgt bidragsniveau, synlighed og professionelle præferencer.',
      'Bookingoplysninger: valgt professionel, dato, tidspunkt, oplyst pris, forventet bidrag, besked til den professionelle, status og påmindelser. Betaling er ikke aktiveret endnu, og Naetwork behandler derfor ikke betalingskort eller gennemførte betalinger på nuværende tidspunkt.',
      'Kommunikation: service-e-mails, bekræftelser, velkomstmails, kontaktformularbeskeder og eventuelle supporthenvendelser.',
      'Tekniske oplysninger: nødvendige cookies, lokal lagring, sikkerhedslogs og basale oplysninger, der hjælper os med at holde platformen stabil.',
    ],
  },
  {
    title: '3. Hvorfor vi behandler oplysninger',
    body: [
      'Vi behandler oplysninger for at kunne oprette og administrere brugerkonti, vise professionelle profiler, modtage bookinganmodninger, beregne impact-information, sende servicebeskeder og levere platformens kernefunktioner.',
      'Vi kan også behandle oplysninger for at overholde juridiske forpligtelser, forebygge misbrug, dokumentere aftaler og forbedre sikkerheden.',
    ],
  },
  {
    title: '4. Behandlingsgrundlag',
    body: [
      'Kontrakt: når behandlingen er nødvendig for at oprette konto, administrere profiler og gennemføre bookingrelaterede handlinger.',
      'Retlig forpligtelse: når oplysninger skal opbevares af regnskabs-, skatte- eller dokumentationshensyn.',
      'Legitim interesse: når vi beskytter platformen, håndterer support, beregner og dokumenterer impact på aggregeret niveau og forbedrer drift uden at tilsidesætte dine rettigheder.',
      'Samtykke: når vi sender marketing, bruger ikke-nødvendige cookies eller behandler oplysninger på en måde, hvor samtykke er det rigtige grundlag.',
    ],
  },
  {
    title: '5. Deling med leverandører',
    body: [
      'Naetwork bruger leverandører til hosting, database, login, e-mail og teknisk drift. Det kan omfatte Supabase, Vercel og Resend eller tilsvarende databehandlere.',
      'Leverandører må kun behandle oplysninger på vores vegne og efter instruks. Hvis oplysninger behandles uden for EU/EØS, skal der være et relevant overførselsgrundlag.',
    ],
  },
  {
    title: '6. Opbevaring og sletning',
    body: [
      'Vi opbevarer oplysninger, så længe de er nødvendige for formålet. Konto- og profiloplysninger opbevares normalt, så længe kontoen er aktiv.',
      'Booking- og impactrelaterede oplysninger kan opbevares længere, hvis det er nødvendigt af juridiske eller dokumentationsmæssige årsager. Når betaling senere aktiveres, opdateres politikken med de relevante betalings- og regnskabsoplysninger.',
      'Når du anmoder om sletning, fjerner eller anonymiserer vi oplysninger, hvor det er muligt, medmindre vi er forpligtet til at gemme dem i en begrænset periode.',
    ],
  },
  {
    title: '7. Dine rettigheder',
    body: [
      'Du kan anmode om indsigt i de oplysninger, vi behandler om dig. Du kan også bede om rettelse af urigtige oplysninger, sletning, begrænsning af behandling eller dataportabilitet, når betingelserne er opfyldt.',
      'Du kan gøre indsigelse mod behandling baseret på legitim interesse, og du kan til enhver tid trække samtykke tilbage, når behandlingen er baseret på samtykke.',
      'Du kan kontakte os på kontakt@naetwork.dk. Du har også mulighed for at klage til Datatilsynet, hvis du mener, at dine oplysninger ikke behandles korrekt.',
    ],
  },
  {
    title: '8. Cookies og lokal lagring',
    body: [
      'Vi bruger nødvendige cookies og lokal lagring til login, sikkerhed og sprogvalg. Ikke-nødvendige cookies bruges kun, hvis de senere aktiveres med et gyldigt samtykke.',
      'Læs mere på vores cookiepolitik.',
    ],
    link: { href: '/cookies', label: 'Læs cookiepolitik' },
  },
  {
    title: '9. Ændringer',
    body: [
      'Vi kan opdatere denne privatlivspolitik, når platformen, leverandører eller juridiske krav ændrer sig. Den nyeste version vil altid fremgå på denne side.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="mb-8 inline-flex rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:text-gray-950">&larr; Naetwork</Link>
          <p className="mb-4 text-xs font-semibold uppercase text-gray-500">Juridisk</p>
          <h1 className="max-w-4xl text-4xl font-black leading-none tracking-tight text-gray-950 md:text-6xl">Privatlivspolitik</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">Hvordan vi behandler oplysninger, når du opretter konto, booker en session, bliver professionel eller kontakter Naetwork.</p>
          <p className="mt-6 text-sm font-medium text-gray-400">Senest opdateret: {updated}</p>
        </div>
      </section>

      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="mb-4 text-xs font-semibold uppercase text-gray-400">Overblik</p>
            <div className="space-y-4">
              {quickFacts.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-950">{value}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            {sections.map((section) => (
              <article key={section.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-black text-gray-950">{section.title}</h2>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-gray-600">{paragraph}</p>
                  ))}
                </div>
                {section.link && (
                  <Link href={section.link.href} className="mt-5 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-950 hover:border-gray-950 hover:bg-gray-50">
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
