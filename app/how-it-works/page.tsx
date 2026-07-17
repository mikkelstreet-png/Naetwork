import type { Metadata } from 'next'
import { HowItWorksContent } from '@/components/HowItWorksContent'

export const metadata: Metadata = {
  title: 'Sådan fungerer Naetwork | 60-minutters karrieresessioner',
  description: 'Start med din situation, find en fagperson med indsigt indefra, og afslut en fokuseret session med prioriterede forbedringer og en konkret plan.',
  alternates: { canonical: '/how-it-works' },
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}
