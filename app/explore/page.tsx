import type { Metadata } from 'next'
import { AccessPathContent } from '@/components/AccessPathContent'

export const metadata: Metadata = {
  title: 'Udforsk roller og virksomheder | Naetwork',
  description: 'Få adgang til professionel erfaring fra mennesker, der kender rollen, virksomheden eller branchen indefra.',
  alternates: { canonical: '/explore' },
}

export default function ExplorePage() {
  return <AccessPathContent pathId="explore" />
}
