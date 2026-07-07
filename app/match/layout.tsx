import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find dit fokus - Naetwork',
  description: 'Vælg fagområde og behov på under ét minut, og få relevante professionelle prioriteret til din 60-minutters session.',
  alternates: { canonical: '/match' },
}

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return children
}
