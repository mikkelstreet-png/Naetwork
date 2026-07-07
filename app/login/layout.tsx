import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log ind - Naetwork',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
