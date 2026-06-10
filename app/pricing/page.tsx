import type { Metadata } from 'next'
import { PricingContent } from './PricingContent'

export const metadata: Metadata = {
  title: 'Priser · Naetwork',
  description:
    'Founding Member adgang — gratis de første 6 måneder. Se hvad der sker herefter.',
  alternates: { canonical: '/pricing' },
}

export default function PricingPage() {
  return <PricingContent />
}
