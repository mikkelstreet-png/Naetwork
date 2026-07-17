import type { Metadata } from 'next'
import { AccessPathContent } from '@/components/AccessPathContent'

export const metadata: Metadata = {
  title: 'Udforsk roller og virksomheder | Naetwork',
  description: 'Forstå en rolle, virksomhed eller branche gennem fagpersoner, der kender forventningerne indefra.',
  alternates: { canonical: '/explore' },
}

export default function ExplorePage() {
  return <AccessPathContent pathId="explore" />
}
