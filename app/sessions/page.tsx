import type { Metadata } from 'next'
import { SessionsContent } from '@/components/SessionsContent'

export const metadata: Metadata = {
  title: 'Career Access-sessioner | Naetwork',
  description: 'Se situationsbaserede sessioner til roller, virksomheder, CV, ansøgninger, interviews, karriereskift og jobtilbud.',
  alternates: { canonical: '/sessions' },
}

export default function SessionsPage() {
  return <SessionsContent />
}
