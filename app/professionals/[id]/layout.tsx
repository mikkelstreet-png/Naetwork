import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professionel profil - Naetwork',
  description: 'Se baggrund, fokusområder, sessionspris og minimumsbidrag, før du sender en bookinganmodning.',
  robots: { index: true, follow: true },
}

export default function ProfessionalProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
