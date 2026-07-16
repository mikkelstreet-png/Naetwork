import type { Metadata } from 'next'
import { SessionsContent } from '@/components/SessionsContent'

export const metadata: Metadata = {
  title: '7 konkrete karrieresessioner | Naetwork',
  description: 'Vælg CV-gennemgang, ansøgningsfeedback, jobsamtaletræning, caseforberedelse, karriereafklaring, graduate-rådgivning eller brancheindsigt.',
  alternates: { canonical: '/sessions' },
}

export default function SessionsPage() {
  return <SessionsContent />
}
