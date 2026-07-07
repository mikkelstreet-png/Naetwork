import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/LegalDocument'

export const metadata: Metadata = {
  title: 'Vilkår for brug - Naetwork',
  description: 'Vilkår for konti, professionelle profiler og booking af 60 minutters karrieresparring på Naetwork.',
}

const updated = '7. juli 2026'
const legalName = process.env.NEXT_PUBLIC_LEGAL_NAME ?? 'Naetwork'
const legalAddress = process.env.NEXT_PUBLIC_LEGAL_ADDRESS
const legalRegistration = process.env.NEXT_PUBLIC_LEGAL_REGISTRATION
const supportEmail = process.env.SUPPORT_EMAIL ?? 'kontakt@naetwork.dk'
const operator = [legalName, legalRegistration, legalAddress].filter(Boolean).join(', ')

const facts: Array<[string, string]> = [
  ['Operatør', operator],
  ['Kontakt', supportEmail],
  ['Format', '60 minutter'],
  ['Prisvalg', 'DKK 600 · 900 · 1.200 · 1.800'],
]

const sections: LegalSection[] = [
  {
    id: 'om-naetwork',
    title: '1. Om Naetwork og vilkårenes omfang',
    body: [
      `Naetwork drives af ${operator} og forbinder kandidater med professionelle fra AI, Banking, Management Consulting og Private Equity.`,
      'Vilkårene gælder, når du besøger platformen, opretter en konto, publicerer en professionel profil eller sender og behandler bookinganmodninger.',
      'Du skal være fyldt 18 år for at oprette konto eller tilbyde sessioner. Ved at oprette konto accepterer du den version af vilkårene, der gælder på det tidspunkt.',
    ],
  },
  {
    id: 'platformens-rolle',
    title: '2. Platformens rolle',
    body: [
      'Naetwork stiller søgning, profiler, bookinganmodninger og relateret kommunikation til rådighed. Den professionelle leverer selve sparringen og er ansvarlig for at møde forberedt og levere sessionen med rimelig omhu og professionalisme.',
      'Karrieresparring er vejledende og er ikke en garanti for ansættelse, interview, optagelse, afkast eller andre bestemte resultater. Sessioner er ikke juridisk, skattemæssig, investeringsmæssig eller lægefaglig rådgivning.',
    ],
  },
  {
    id: 'konto',
    title: '3. Konto og sikkerhed',
    body: [
      'Du skal give korrekte og aktuelle oplysninger og beskytte dine loginoplysninger. Du må ikke dele konto, udgive dig for en anden eller bruge platformen til ulovlige eller vildledende formål.',
      'Kontakt os straks, hvis du mener, at din konto er kompromitteret. Naetwork kan midlertidigt begrænse adgang for at beskytte brugere, data eller platformen.',
    ],
  },
  {
    id: 'booking',
    title: '4. Booking og gennemførelse',
    body: [
      'En bookinganmodning angiver kandidatens ønskede tidspunkt og fokus. Aftalen om tidspunktet er først bekræftet, når den professionelle accepterer anmodningen i platformen eller gennem den kommunikation, Naetwork stiller til rådighed.',
      'Kandidaten skal give relevant kontekst uden at dele fortrolige eller ulovligt indhentede oplysninger. Begge parter skal møde til tiden og kommunikere ændringer så tidligt som muligt.',
      'Aktuelle funktioner til ombooking, aflysning og status fremgår af bookingoversigten. Naetwork kan kontakte parterne for at afklare udeblivelse, tvister eller tekniske fejl.',
    ],
  },
  {
    id: 'pris-og-betaling',
    title: '5. Pris og betaling',
    body: [
      'Den professionelle vælger én af fire sessionspriser: DKK 600, DKK 900, DKK 1.200 eller DKK 1.800 for 60 minutter. Den konkrete pris og det forventede minimumsbidrag vises, før bookinganmodningen sendes.',
      'Betaling er ikke aktiveret endnu. En bookinganmodning eller bekræftelse medfører derfor ikke betaling og dokumenterer ikke et gennemført bidrag.',
      'Før betaling aktiveres, opdaterer Naetwork checkout, afbestillingsvilkår, gebyrer, kvitteringer og disse vilkår, så alle økonomiske konsekvenser fremgår før en bindende bestilling.',
    ],
  },
  {
    id: 'fortrydelse',
    title: '6. Fortrydelse og aflysning',
    body: [
      'Ved et fremtidigt onlinekøb har forbrugere som udgangspunkt 14 dages fortrydelsesret efter dansk forbrugerret. Hvis en session ønskes gennemført inden fristens udløb, vil checkout indhente den nødvendige udtrykkelige anmodning og oplyse om konsekvenserne.',
      'Ufravigelige forbrugerrettigheder gælder altid. De konkrete afbestillings- og refusionsregler offentliggøres og accepteres, før betaling aktiveres.',
    ],
  },
  {
    id: 'professionelle',
    title: '7. Professionelle profiler',
    body: [
      'Professionelle skal beskrive rolle, erfaring, virksomhed, fokusområder, pris og bidragsniveau sandfærdigt. LinkedIn-oplysninger bruges til gennemgang og vises ikke offentligt, medmindre det oplyses særskilt.',
      'Naetwork kan afvise, skjule eller kræve ændringer til en profil, hvis erfaring ikke kan verificeres, teksten er vildledende, eller profilen ikke lever op til platformens kvalitets- og adfærdsstandarder.',
      'Professionelle må ikke love intern adgang, dele arbejdsgiveres fortrolige oplysninger eller give indtryk af at repræsentere en virksomhed uden bemyndigelse.',
      'En professionel deltager i eget navn. En arbejdsgiver, tidligere arbejdsgiver eller nævnt virksomhed er ikke part i sessionen og har ikke godkendt profilen, medmindre det fremgår udtrykkeligt.',
    ],
  },
  {
    id: 'adfaerd',
    title: '8. Adfærd og fortrolighed',
    body: [
      'Chikane, diskrimination, spam, manipulation, omgåelse af sikkerhed og misbrug af personoplysninger accepteres ikke.',
      'Parterne skal respektere tredjemands rettigheder og må ikke dele fortrolige cases, kundedata, personoplysninger eller materiale, de ikke har ret til at bruge. Naetwork kan undersøge dokumenterede klager og begrænse konti, mens en sag afklares.',
      'Materialelinks bør kun indeholde oplysninger, som den anden part må se. Følsomme personoplysninger, interne arbejdsdokumenter og ikke-offentlige kundedata må ikke deles gennem bookingbriefet.',
    ],
  },
  {
    id: 'bidrag',
    title: '9. Bidrag til Kræftens Bekæmpelse',
    body: [
      'For hver betalt session afsættes minimum 40% og op til 90% af den viste sessionspris til støtte for Kræftens Bekæmpelse. Den konkrete procent vælges på den professionelle profil og vises før booking.',
      'Kun gennemførte og betalte sessioner tæller. Anmodede, aflyste, tilbageførte eller refunderede sessioner tæller ikke som gennemførte bidrag.',
      'Naetwork er et uafhængigt initiativ og er ikke officielt tilknyttet eller godkendt af Kræftens Bekæmpelse, medmindre det fremgår udtrykkeligt. Bidragsoplysninger er ikke personlig skatte- eller fradragsrådgivning.',
      'Før betaling aktiveres, skal Naetwork have afklaret de nødvendige aftaler, tilladelser, regnskabsprocesser og dokumentationskrav for støtte knyttet til salg. Den aktive checkout og de gældende vilkår vil beskrive den endelige model.',
    ],
  },
  {
    id: 'rettigheder',
    title: '10. Indhold og immaterielle rettigheder',
    body: [
      'Naetwork ejer platformens design, kode, struktur og eget indhold. Du bevarer rettighederne til oplysninger og materiale, du selv indsender, og giver kun Naetwork den begrænsede ret, der er nødvendig for at drive, sikre og vise tjenesten.',
      'Du må ikke kopiere, scrape, videresælge eller systematisk genbruge profiler eller platformdata uden tilladelse.',
    ],
  },
  {
    id: 'ansvar',
    title: '11. Drift og ansvar',
    body: [
      'Naetwork arbejder for stabil og sikker drift, men kan ikke garantere uafbrudt adgang. Ved vedligeholdelse, sikkerhedshændelser eller fejl kan funktioner midlertidigt begrænses.',
      'Naetwork er ikke ansvarlig for indirekte tab, tabte muligheder eller beslutninger truffet på baggrund af en session, medmindre andet følger af ufravigelig lovgivning. Intet i vilkårene begrænser ansvar, som ikke lovligt kan begrænses.',
    ],
  },
  {
    id: 'aendringer-og-lovvalg',
    title: '12. Ændringer, lovvalg og kontakt',
    body: [
      'Væsentlige ændringer varsles på en rimelig måde, før de får virkning for eksisterende brugere. Den gældende version og dato vises altid her.',
      `Spørgsmål og klager sendes først til ${supportEmail}. Dansk ret gælder, men uden at begrænse ufravigelige rettigheder, som en forbruger har efter loven i sit bopælsland.`,
    ],
    link: { href: '/privacy', label: 'Læs privatlivspolitikken' },
  },
]

export default function TermsPage() {
  return <LegalDocument title="Vilkår for brug" intro="Klare rammer for konti, profiler, booking, bidrag og ansvar på Naetwork." updated={updated} facts={facts} sections={sections} />
}
