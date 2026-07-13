import type { Metadata } from 'next'
import { AccessPathContent } from '@/components/AccessPathContent'

export const metadata: Metadata = {
  title: 'Udforsk roller og virksomheder | Naetwork',
  description: 'Forstå en rolle, virksomhed, branche eller karrierevej gennem mennesker med relevant erfaring.',
  alternates: { canonical: '/explore' },
}

export default function ExplorePage() {
  return <AccessPathContent pathId="explore" />
}
