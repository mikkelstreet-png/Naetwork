import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'Naetwork - Book 60 min with AI, Banking, Consulting and PE professionals',
  description:
    'Book one 60-minute 1:1 career session with professionals from AI, Banking, Management Consulting and Private Equity. Use it for CVs, interviews, cases, technicals or career direction.',
}

export default function Home() {
  return <HomeContent />
}
