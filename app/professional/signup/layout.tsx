import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bliv professionel - Naetwork',
  description: 'Ansøg om en gennemgået professionel profil og tilbyd 60 minutters karrieresparring inden for AI, Banking, Management Consulting eller Private Equity.',
  alternates: { canonical: '/professional/signup' },
}

export default function ProfessionalSignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
