import type { Metadata } from 'next'
import { HowItWorksContent } from '@/components/HowItWorksContent'

export const metadata: Metadata = {
  title: 'Sådan fungerer Naetwork | 60-minutters karrieresessioner',
  description: 'Start med din karrieresituation, find mennesker med relevant erfaring, og afslut en fokuseret session med klarhed og konkrete næste skridt.',
  alternates: { canonical: '/how-it-works' },
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}
