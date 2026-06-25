import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Naetwork - Karrieresparring med mening',
  description:
    'Book en fokuseret 60-minutters karrieresession med professionals fra AI, Banking, Management Consulting og Private Equity. Hver betalt session fordeles transparent mellem Kræftens Bekæmpelse, eksperten og platformen.',
}

export default function Home() {
  return <HomeContent />
}
