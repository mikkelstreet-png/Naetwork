import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/LegalDocument'

export const metadata: Metadata = {
  title: 'Privatlivspolitik - Naetwork',
  description: 'Sådan indsamler, bruger, deler, opbevarer og sletter Naetwork personoplysninger.',
}

const updated = '7. juli 2026'
const legalName = process.env.NEXT_PUBLIC_LEGAL_NAME ?? 'Naetwork'
const legalAddress = process.env.NEXT_PUBLIC_LEGAL_ADDRESS
const legalRegistration = process.env.NEXT_PUBLIC_LEGAL_REGISTRATION
const supportEmail = process.env.SUPPORT_EMAIL ?? 'kontakt@naetwork.dk'
const controller = [legalName, legalRegistration, legalAddress].filter(Boolean).join(', ')

const facts: Array<[string, string]> = [
  ['Dataansvarlig', controller],
  ['Kontakt', supportEmail],
  ['Målgruppe', 'Personer over 18 år'],
  ['Tilsyn', 'Datatilsynet'],
]

const sections: LegalSection[] = [
  {
    id: 'dataansvarlig',
    title: '1. Dataansvarlig og kontakt',
    body: [
      `${controller} er dataansvarlig for den behandling, der beskrives her. Spørgsmål om personoplysninger og rettigheder kan sendes til ${supportEmail}.`,
      'Politikken gælder for besøgende, kandidater, professionelle, kontaktpersoner og andre, der bruger Naetworks hjemmeside og platform.',
    ],
  },
  {
    id: 'oplysninger',
    title: '2. Oplysninger vi behandler',
    body: ['Vi begrænser indsamlingen til oplysninger, der er relevante for platformens konkrete funktioner.'],
    bullets: [
      'Konto: navn, e-mail, bruger-ID, rolle, loginstatus og sikkerhedsrelaterede hændelser.',
      'Professionel profil: titel, virksomhed, bio, LinkedIn-link, brancher, fokusområder, pris, bidragsniveau, synlighed og gennemgangsstatus.',
      'Booking: valgte parter, ønsket dato og tid, fokus, mål, eventuelt materialelink, status, pris og forventet bidrag.',
      'Dokumentation: tidspunkt og version for accept af vilkår samt tidspunkt og version for den privatlivsinformation, der blev vist ved oprettelse.',
      'Kommunikation: kontaktformular, service-e-mails, supporthenvendelser og leveringsstatus for e-mails.',
      'Teknik: nødvendige cookies, lokal lagring, IP- og enhedsoplysninger i sikkerheds- og hostinglogs samt fejldata.',
    ],
  },
  {
    id: 'formaal-og-grundlag',
    title: '3. Formål og behandlingsgrundlag',
    body: ['Vi kobler hvert formål til et relevant behandlingsgrundlag efter databeskyttelsesforordningens artikel 6.'],
    bullets: [
      'Aftale eller skridt før aftale: konto, profil, bookinganmodninger, bookingstatus og nødvendig servicekommunikation.',
      'Legitim interesse: platformsikkerhed, misbrugsforebyggelse, support, kvalitetskontrol og forbedring af stabilitet. Interessen afvejes mod dine rettigheder.',
      'Retlig forpligtelse: dokumentation, myndighedskrav og senere regnskabsoplysninger, når betaling aktiveres.',
      'Samtykke: markedsføring og eventuelle ikke-nødvendige cookies. Samtykke kan trækkes tilbage uden at påvirke tidligere lovlig behandling.',
      'Privatlivspolitikken er information om behandlingen og er ikke i sig selv et samtykke. Når du opretter konto, accepterer du vilkårene og bekræfter, at du har fået privatlivsinformationen.',
    ],
  },
  {
    id: 'kilder',
    title: '4. Hvor oplysningerne kommer fra',
    body: [
      'De fleste oplysninger kommer direkte fra dig. Bookingdata opstår, når en kandidat og en professionel bruger platformen. Profiloplysninger kan desuden kontrolleres mod offentligt tilgængelige professionelle kilder, eksempelvis det LinkedIn-link, den professionelle selv har indsendt.',
      'Vi køber ikke lister med personoplysninger og bruger ikke platformdata til skjult annonceprofilering.',
    ],
  },
  {
    id: 'modtagere',
    title: '5. Modtagere og databehandlere',
    body: [
      'Bookingoplysninger deles mellem den kandidat og den professionelle, der er part i bookingen. Vi deler kun det, der er nødvendigt for at planlægge og levere sessionen.',
      'Tekniske leverandører kan behandle oplysninger efter instruks og databehandleraftale. De aktuelle kategorier omfatter database og login (Supabase), hosting og levering (Vercel) samt transaktionelle e-mails (Resend, når integrationen er aktiveret).',
      'Oplysninger kan også udleveres, hvis lovgivning eller en gyldig myndighedsanmodning kræver det, eller hvis det er nødvendigt for at beskytte rettigheder og sikkerhed.',
    ],
  },
  {
    id: 'tredjelande',
    title: '6. Overførsler uden for EU/EØS',
    body: [
      'Nogle leverandører kan behandle oplysninger i lande uden for EU/EØS. I de tilfælde anvendes et gyldigt overførselsgrundlag, eksempelvis EU-Kommissionens standardkontraktbestemmelser og relevante supplerende sikkerhedsforanstaltninger eller en gældende tilstrækkelighedsafgørelse.',
      `Du kan kontakte ${supportEmail} for at få mere information om det relevante overførselsgrundlag for en konkret leverandør.`,
    ],
  },
  {
    id: 'automatiske-afgoerelser',
    title: '7. Automatiske afgørelser og profilering',
    body: [
      'Naetwork træffer ikke afgørelser med retsvirkning eller tilsvarende væsentlig virkning alene ved automatisk behandling. Matchfunktionen bruger de valg, du selv foretager, til at prioritere relevante profiler; den vurderer ikke din egnethed til et job.',
    ],
  },
  {
    id: 'opbevaring',
    title: '8. Opbevaring og sletning',
    body: ['Vi sletter eller anonymiserer oplysninger, når de ikke længere er nødvendige. Følgende perioder er udgangspunkt og kan forkortes, hvis formålet ophører tidligere.'],
    bullets: [
      'Konto og profil: så længe kontoen er aktiv. Ved kontosletning fjernes eller anonymiseres data, medmindre en begrænset opbevaring er nødvendig.',
      'Bookingoplysninger uden betaling: op til 24 måneder efter den seneste aktivitet for support, tvister og dokumentation.',
      'Kontaktbeskeder: op til 12 måneder efter afsluttet henvendelse, medmindre længere opbevaring er nødvendig for en konkret sag.',
      'Sikkerheds- og driftslogs: normalt op til 90 dage, medmindre en hændelse kræver længere undersøgelse.',
      'Samtykkedokumentation og oplysninger om gennemførte betalinger opbevares efter de lovpligtige perioder, når disse funktioner aktiveres.',
    ],
  },
  {
    id: 'rettigheder',
    title: '9. Dine rettigheder',
    body: [
      'Du kan efter omstændighederne få indsigt, rettelse, sletning, begrænsning og dataportabilitet samt gøre indsigelse mod behandling baseret på legitim interesse. Du kan altid trække et samtykke tilbage.',
      `Send din anmodning til ${supportEmail}. Vi kan bede om oplysninger, der er nødvendige for at bekræfte din identitet. Du kan klage til Datatilsynet, hvis du mener, at behandlingen er i strid med reglerne.`,
    ],
    link: { href: 'https://www.datatilsynet.dk/borger/klage', label: 'Læs om klage til Datatilsynet', external: true },
  },
  {
    id: 'sikkerhed',
    title: '10. Sikkerhed og hændelser',
    body: [
      'Naetwork anvender adgangskontrol, rollebaserede databasepolitikker, krypteret transport, begrænsede servernøgler og løbende release-checks. Ingen tjeneste kan garantere absolut sikkerhed, men foranstaltningerne vurderes løbende i forhold til risikoen.',
      'Ved et brud på persondatasikkerheden undersøger vi hændelsen og underretter Datatilsynet og berørte personer, når reglerne kræver det.',
    ],
  },
  {
    id: 'cookies',
    title: '11. Cookies og lokal lagring',
    body: [
      'Naetwork bruger aktuelt kun teknologier, der er nødvendige for login, sikkerhed og det sprogvalg, brugeren aktivt foretager. Ikke-nødvendig statistik eller markedsføring må ikke aktiveres uden relevant information og samtykke.',
    ],
    link: { href: '/cookies', label: 'Læs cookiepolitikken' },
  },
  {
    id: 'aendringer',
    title: '12. Ændringer',
    body: [
      'Politikken opdateres, når funktioner, leverandører eller regler ændrer sig. Ved væsentlige ændringer informerer vi på en passende måde. Datoen øverst viser den gældende version.',
    ],
  },
]

export default function PrivacyPage() {
  return <LegalDocument title="Privatlivspolitik" intro="Et præcist overblik over hvilke oplysninger vi behandler, hvorfor vi gør det, og hvilke valg du har." updated={updated} facts={facts} sections={sections} />
}
