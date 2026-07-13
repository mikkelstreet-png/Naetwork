import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/LegalDocument'
import { LEGAL_UPDATED_DA, PUBLIC_SUPPORT_EMAIL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Afbestilling og refundering - Naetwork',
  description: 'Regler for aflysning, ombooking, udeblivelse og refundering af Naetwork-sessioner.',
  alternates: { canonical: '/afbestilling' },
}

const facts: Array<[string, string]> = [
  ['Format', '60 minutter'],
  ['Fuld refundering', 'Senest 24 timer før'],
  ['Rådgiverafbud', 'Altid fuld refundering'],
  ['Betalingsstatus', 'Ikke aktiveret'],
]

const sections: LegalSection[] = [
  {
    id: 'overblik',
    title: '1. Overblik',
    body: [
      'Denne politik beskriver den afbestillings- og refunderingsmodel, Naetwork vil anvende, når betaling aktiveres. Indtil da trækkes ingen betaling, og en aflysning udløser derfor ingen betalingsrefundering.',
      'Formålet er at give kandidaten rimelig fleksibilitet og samtidig beskytte den tid, den professionelle har reserveret. Ufravigelige forbrugerrettigheder gælder altid.',
    ],
  },
  {
    id: 'kandidat',
    title: '2. Når kandidaten aflyser',
    body: [
      'Aflysning senest 24 timer før sessionens start giver fuld refundering til det oprindelige betalingsmiddel. Aflysning mindre end 24 timer før giver som udgangspunkt ikke automatisk refundering, fordi tiden normalt ikke kan genbookes.',
      'Naetwork kan efter en konkret vurdering tilbyde hel eller delvis refundering ved dokumenterede ekstraordinære omstændigheder. Det er ikke en begrænsning af rettigheder, der følger direkte af lovgivningen.',
    ],
  },
  {
    id: 'professionel',
    title: '3. Når den professionelle aflyser',
    body: [
      'Hvis den professionelle aflyser, tilbydes kandidaten et nyt tidspunkt eller fuld refundering. Kandidaten vælger selv. Et bidrag registreres ikke for en aflyst eller refunderet session.',
    ],
  },
  {
    id: 'ombooking',
    title: '4. Ombooking',
    body: [
      'Ombooking senest 24 timer før behandles uden gebyr, hvis den professionelle accepterer det nye tidspunkt. Senere ombooking behandles efter samme princip som sen aflysning.',
      'Et nyt tidspunkt er først gældende, når det vises som bekræftet i bookingoversigten.',
    ],
  },
  {
    id: 'udeblivelse',
    title: '5. Udeblivelse og tekniske problemer',
    body: [
      'Udebliver kandidaten uden at aflyse, gives der som udgangspunkt ikke refundering. Udebliver den professionelle, tilbydes nyt tidspunkt eller fuld refundering.',
      'Ved dokumenterede platform- eller videofejl vurderer Naetwork, om sessionen kan fortsætte, ombookes eller refunderes. Parterne skal kontakte support så hurtigt som muligt.',
    ],
  },
  {
    id: 'fortrydelse',
    title: '6. Fortrydelsesret',
    body: [
      'Ved onlinekøb har forbrugere som udgangspunkt 14 dages fortrydelsesret. Hvis en session skal leveres inden fristens udløb, vil checkout indhente en udtrykkelig anmodning om tidlig levering og forklare konsekvenserne, før bestillingen bliver betalingspligtig.',
      'Den endelige checkout-tekst og denne politik skal gennemgås af en dansk jurist, før betaling aktiveres. Denne markering er en releaseblokker, ikke en ansvarsfraskrivelse over for brugeren.',
    ],
  },
  {
    id: 'kontakt',
    title: '7. Anmodning om refundering',
    body: [
      `Aflys gennem bookingoversigten. Hvis du ikke kan bruge den, kontakt ${PUBLIC_SUPPORT_EMAIL} med bookingreference og en kort beskrivelse. Del ikke kortoplysninger eller følsomme personoplysninger i beskeden.`,
    ],
    link: { href: '/contact', label: 'Kontakt support' },
  },
]

export default function CancellationPage() {
  return <LegalDocument title="Afbestilling og refundering" intro="Klare rammer for aflysning, ombooking, udeblivelse og tilbagebetaling." updated={LEGAL_UPDATED_DA} facts={facts} sections={sections} />
}
