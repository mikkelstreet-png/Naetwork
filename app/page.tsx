import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Naetwork - Karrieresparring med mening',
  description:
    'Book en fokuseret 60-minutters karrieresession med professionelle fra AI, Banking, Management Consulting og Private Equity. Hver betalt session bidrager med minimum 40% og op til 90% til Kræftens Bekæmpelse.',
}

export default function Home() {
  return <HomeContent />
}
