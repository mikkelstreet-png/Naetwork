import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Naetwork – Din næste karrierebeslutning starter her',
  description:
    'Book en 1:1 session med erfarne professionelle inden for Banking, Private Equity, AI og Consulting.',
}

export default function Home() {
  return <HomeContent />
}
