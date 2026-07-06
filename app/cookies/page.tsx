import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/LegalDocument'

export const metadata: Metadata = {
  title: 'Cookiepolitik - Naetwork',
  description: 'Præcis information om nødvendige cookies og lokal lagring på Naetwork.',
}

const updated = '6. juli 2026'

const facts: Array<[string, string]> = [
  ['Status', 'Kun nødvendige teknologier'],
  ['Statistik', 'Ikke aktiveret'],
  ['Marketing', 'Ikke aktiveret'],
  ['Kontakt', 'kontakt@naetwork.dk'],
]

const sections: LegalSection[] = [
  {
    id: 'kort-fortalt',
    title: '1. Kort fortalt',
    body: [
      'Naetwork bruger cookies og lignende teknologier til login, sikkerhed og det sprogvalg, du aktivt foretager. Vi bruger ikke reklamecookies eller analyseværktøjer på nuværende tidspunkt.',
      'Teknisk nødvendige teknologier kan anvendes uden samtykke, fordi platformen ellers ikke kan levere den funktion, brugeren udtrykkeligt har bedt om. Hvis Naetwork senere tilføjer ikke-nødvendig statistik eller markedsføring, aktiveres en samtykkeløsning først.',
    ],
  },
  {
    id: 'teknologier',
    title: '2. Aktuelle teknologier',
    body: ['Navne og levetider for autentificeringscookies kan variere efter browser og Supabase-projekt, men formålet er det samme.'],
    bullets: [
      'naetwork_lang: lokal lagring, som husker dit aktive sprogvalg. Opbevares, indtil du rydder browserdata eller ændrer valget.',
      'Supabase auth/session: nødvendige cookies eller lokal lagring, som etablerer og fornyer en sikker login-session. Udløber eller fornyes efter autentificeringssystemets sikkerhedsindstillinger.',
      'Tekniske hostinglogs: serveroplysninger, som ikke lagres i din browser, men kan indeholde IP- og enhedsdata til sikkerhed og drift. De er beskrevet i privatlivspolitikken.',
    ],
  },
  {
    id: 'samtykke',
    title: '3. Samtykke og fremtidige ændringer',
    body: [
      'Der vises ikke et cookiebanner, når kun teknisk nødvendige teknologier anvendes. Det er et bevidst valg for ikke at bede om et overflødigt samtykke.',
      'Før en ikke-nødvendig teknologi aktiveres, opdaterer vi denne oversigt og indhenter et frivilligt, specifikt, informeret og utvetydigt samtykke. Det skal være lige så let at trække samtykket tilbage som at give det.',
    ],
  },
  {
    id: 'browservalg',
    title: '4. Sletning i browseren',
    body: [
      'Du kan slette cookies og lokal lagring i browserens indstillinger. Det kan logge dig ud og nulstille sprogvalget. Blokering af nødvendige cookies kan betyde, at konto- og bookingfunktioner ikke virker.',
    ],
  },
  {
    id: 'privatliv',
    title: '5. Personoplysninger',
    body: ['Privatlivspolitikken beskriver behandlingsgrundlag, leverandører, opbevaring, overførsler og dine rettigheder.'],
    link: { href: '/privacy', label: 'Læs privatlivspolitikken' },
  },
]

export default function CookiesPage() {
  return <LegalDocument title="Cookiepolitik" intro="Hvilke teknologier Naetwork gemmer i din browser, hvorfor de er nødvendige, og hvordan du rydder dem." updated={updated} facts={facts} sections={sections} />
}
