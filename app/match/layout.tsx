import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start med din karrieresituation - Naetwork',
  description: 'Den tidligere matchside er flyttet til Naetworks situationsbaserede Career Access-indgang.',
  alternates: { canonical: '/start' },
  robots: { index: false, follow: true },
}

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return children
}
