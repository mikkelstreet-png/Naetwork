import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bliv professionel - Naetwork',
  description: 'Ansøg om en gennemgået profil og gør relevant arbejdserfaring tilgængelig gennem fokuserede Career Access-sessioner.',
  alternates: { canonical: '/professional/signup' },
}

export default function ProfessionalSignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
