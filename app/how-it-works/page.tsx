import type { Metadata } from 'next'
import { HowItWorksContent } from '@/components/HowItWorksContent'

export const metadata: Metadata = {
  title: 'Sådan fungerer Naetwork | 60-minutters karrieresessioner',
  description: 'Definér ét konkret mål, find direkte relevant professionel erfaring, og gå videre med prioriterede forbedringer og en tydelig næste handling.',
  alternates: { canonical: '/how-it-works' },
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}
