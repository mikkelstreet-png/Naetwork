import type { Metadata } from 'next'
import { SituationStartContent } from '@/components/SituationStartContent'

export const metadata: Metadata = {
  title: 'Start med din karrieresituation | Naetwork',
  description: 'Beskriv den karrierebeslutning, du står overfor, og find den arbejdserfaring, der er relevant for dit næste skridt.',
  alternates: { canonical: '/start' },
}

export default function StartPage() {
  return <SituationStartContent />
}
