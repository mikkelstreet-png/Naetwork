import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Naetwork - 1:1 karrieresparring i AI, Banking, Consulting og PE',
  description:
    'Book 1:1 karrieresparring med professionelle fra AI, Banking, Management Consulting og Private Equity. Få konkret feedback på CV, interviews, cases og karrierevalg.',
}

export default function Home() {
  return <HomeContent />
}
