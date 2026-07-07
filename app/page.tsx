import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Naetwork - Karrieresparring med mening',
  description:
    'Book 60 minutters fokuseret karrieresparring med gennemgåede professionelle fra AI, Banking, Management Consulting og Private Equity. Fire priser fra DKK 600.',
}

export default function Home() {
  return <HomeContent />
}
