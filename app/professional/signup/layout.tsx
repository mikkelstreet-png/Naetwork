import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bliv professionel - Naetwork',
  description: 'Ansøg om en gennemgået fagpersonprofil og gør relevant arbejdserfaring tilgængelig gennem konkrete 60-minutters karrieresessioner.',
  alternates: { canonical: '/professional/signup' },
}

export default function ProfessionalSignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
