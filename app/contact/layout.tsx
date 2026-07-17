import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt - Naetwork',
  description: 'Få hjælp til booking, konto, professionelle eller behandling af personoplysninger på Naetwork.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
