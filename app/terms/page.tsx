import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/LegalDocument'
import { LEGAL_OPERATOR, LEGAL_UPDATED_DA, PUBLIC_SUPPORT_EMAIL } from '@/lib/legal'
import { CONTRIBUTION_PERCENT, PLATFORM_SHARE_PERCENT, PROFESSIONAL_SHARE_PERCENT } from '@/lib/platform'

export const metadata: Metadata = {
  title: 'Vilkår for brug - Naetwork',
  description: 'Vilkår for konti, fagpersonprofiler og booking af 60-minutters karrieresessioner på Naetwork.',
  alternates: { canonical: '/terms' },
}

const supportEmail = PUBLIC_SUPPORT_EMAIL
const operator = LEGAL_OPERATOR

const facts: Array<[string, string]> = [
  ['Operatør', operator],
  ['Kontakt', supportEmail],
  ['Format', '60 minutter'],
  ['Prisvalg inkl. moms', 'DKK 600 · 900 · 1.200 · 1.800'],
  ['Grundfordeling', `${CONTRIBUTION_PERCENT}% Kræftens Bekæmpelse · ${PLATFORM_SHARE_PERCENT}% Naetwork · ${PROFESSIONAL_SHARE_PERCENT}% fagperson eller ekstra bidrag`],
]

const sections: LegalSection[] = [
  {
    id: 'om-naetwork',
    title: '1. Om Naetwork og vilkårenes omfang',
    body: [
      `Naetwork drives af ${operator} og forbinder studerende og jobsøgende med erfarne fagpersoner til konkrete 60-minutters karrieresessioner.`,
      'Vilkårene gælder, når du besøger platformen, opretter en konto, publicerer en professionel profil eller sender og behandler bookinganmodninger.',
      'Du skal være fyldt 18 år for at oprette konto eller tilbyde sessioner. Ved at oprette konto accepterer du den version af vilkårene, der gælder på det tidspunkt.',
    ],
  },
  {
    id: 'platformens-rolle',
    title: '2. Platformens rolle',
    body: [
      'Naetwork stiller situationsbaseret navigation, profiler, bookinganmodninger og relateret kommunikation til rådighed. Den professionelle leverer selve sessionen og er ansvarlig for at møde forberedt og levere den med rimelig omhu og professionalisme.',
      'Så længe betaling ikke er aktiveret, er en bookinganmodning ikke et køb gennem Naetwork. Før checkout åbnes, vil det fremgå klart, hvem der er aftalepart og sælger, hvem der fakturerer, og hvordan Naetwork handler på parternes vegne.',
      'Karrieresessioner er vejledende og er ikke en garanti for ansættelse, interview, optagelse, afkast eller andre bestemte resultater. Sessioner er ikke juridisk, skattemæssig, investeringsmæssig eller lægefaglig rådgivning.',
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
      'Den professionelle vælger én af fire sessionspriser: DKK 600, DKK 900, DKK 1.200 eller DKK 1.800 inklusive moms for 60 minutter. DKK 1.800 kræver særskilt godkendelse som del af profilgennemgangen. Kandidatens samlede pris, momsgrundlaget og de konkrete fordelingsbeløb vises, før en betalingspligtig bestilling gennemføres.',
      'Betaling er ikke aktiveret endnu. En bookinganmodning eller bekræftelse medfører derfor ikke betaling og dokumenterer ikke et gennemført bidrag.',
      `Når betaling aktiveres, skilles momsen først ud af kandidatens totalpris. Sessionsprisen eksklusive moms fordeles derefter fast: ${CONTRIBUTION_PERCENT}% afsættes til støtte for Kræftens Bekæmpelse, ${PLATFORM_SHARE_PERCENT}% går til Naetwork som platformsgebyr, og ${PROFESSIONAL_SHARE_PERCENT}% udgør fagpersonens forventede udbetaling før egne skatter og afgifter.`,
      `Den professionelle kan for nye bookinger vælge, at egen andel på ${PROFESSIONAL_SHARE_PERCENT}% også afsættes til Kræftens Bekæmpelse. I så fald går samlet ${CONTRIBUTION_PERCENT + PROFESSIONAL_SHARE_PERCENT}% af nettoprisen til formålet, mens Naetworks andel fortsat er ${PLATFORM_SHARE_PERCENT}%. Valget ændrer ikke kandidatens pris.`,
      'Fordelingen medfører ikke et ekstra gebyr oven i kandidatens viste totalpris. Eventuelle betalingsomkostninger afholdes inden for Naetworks andel, medmindre andet fremgår klart før bestillingen.',
      'Før betaling aktiveres, opdaterer Naetwork checkout, afbestillingsvilkår, kvitteringer og disse vilkår, så alle økonomiske konsekvenser fremgår før en bindende bestilling.',
      'Ved et fremtidigt køb vil den samlede pris, moms, bidrag og eventuelle øvrige omkostninger fremgå umiddelbart før den betalingspligtige bestilling. Bestillingsknappen vil tydeligt angive, at handlingen medfører betalingspligt.',
    ],
  },
  {
    id: 'fortrydelse',
    title: '6. Fortrydelse og aflysning',
    body: [
      'Ved et fremtidigt onlinekøb har forbrugere som udgangspunkt 14 dages fortrydelsesret efter dansk forbrugerret. Hvis en session ønskes gennemført inden fristens udløb, vil checkout indhente den nødvendige udtrykkelige anmodning og oplyse om konsekvenserne.',
      'Aflysning senest 24 timer før giver fuld refundering, når betaling er aktiveret. Ved senere aflysning eller udeblivelse gives der som udgangspunkt ikke automatisk refundering. Hvis den professionelle aflyser, tilbydes nyt tidspunkt eller fuld refundering.',
      'Ufravigelige forbrugerrettigheder gælder altid. Den endelige checkout-tekst og afbestillingsmodel skal godkendes som releaseblokker efter dansk juridisk gennemgang, før betaling aktiveres.',
    ],
    link: { href: '/afbestilling', label: 'Læs afbestillings- og refunderingspolitikken' },
  },
  {
    id: 'professionelle',
    title: '7. Professionelle profiler',
    body: [
      `Fagpersoner skal beskrive rolle, erfaring, virksomhed, sessionstyper og pris sandfærdigt. Grundfordelingen er ${CONTRIBUTION_PERCENT}/${PLATFORM_SHARE_PERCENT}/${PROFESSIONAL_SHARE_PERCENT}. Fagpersonen kan alene vælge, om egen ${PROFESSIONAL_SHARE_PERCENT}%-andel skal udbetales eller også afsættes til Kræftens Bekæmpelse. LinkedIn-oplysninger bruges til gennemgang og vises ikke offentligt, medmindre det oplyses særskilt.`,
      'Naetwork gennemgår de indsendte profiloplysninger og kan sammenholde dem med det LinkedIn-link, den professionelle har angivet. Gennemgangen er en rimelig kvalitetskontrol, men er ikke en baggrundsundersøgelse, autorisation eller garanti for den professionelles udsagn eller resultater.',
      'Naetwork kan afvise, skjule eller kræve ændringer til en profil, hvis erfaring ikke kan sandsynliggøres, teksten er vildledende, eller profilen ikke lever op til platformens kvalitets- og adfærdsstandarder.',
      'Professionelle må ikke love intern adgang, dele arbejdsgiveres fortrolige oplysninger eller give indtryk af at repræsentere en virksomhed uden bemyndigelse.',
      'En professionel deltager i eget navn. En arbejdsgiver, tidligere arbejdsgiver eller nævnt virksomhed er ikke part i sessionen og har ikke godkendt profilen, medmindre det fremgår udtrykkeligt.',
      `Den forventede udbetaling vises før publicering og udgør normalt ${PROFESSIONAL_SHARE_PERCENT}% af sessionsprisen eksklusive moms. Hvis fagpersonen vælger ekstra bidrag, er den forventede udbetaling nul for nye bookinger, der oprettes under dette valg. Fagpersonen er selv ansvarlig for egne skattemæssige forhold, medmindre ufravigelig lovgivning eller den endelige betalingsstruktur medfører andet.`,
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
      `For hver gennemført og betalt session afsættes ${CONTRIBUTION_PERCENT}% af sessionsprisen eksklusive moms til støtte for Kræftens Bekæmpelse. Det konkrete beløb i kroner vises på fagpersonens profil og før en betalingspligtig bestilling.`,
      `En fagperson kan vælge også at afsætte sin egen ${PROFESSIONAL_SHARE_PERCENT}%-andel. Når dette valg gælder for bookingen, er det samlede bidrag ${CONTRIBUTION_PERCENT + PROFESSIONAL_SHARE_PERCENT}% af nettoprisen. Valget gemmes på den enkelte booking, så en senere profilændring ikke ændrer en eksisterende bookings fordeling.`,
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
  return <LegalDocument title="Vilkår for brug" intro="Klare rammer for konti, profiler, booking, bidrag og ansvar på Naetwork." updated={LEGAL_UPDATED_DA} facts={facts} sections={sections} />
}
