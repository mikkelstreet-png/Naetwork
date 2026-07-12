import type { Metadata } from 'next'
import { AccessPathContent } from '@/components/AccessPathContent'

export const metadata: Metadata = {
  title: 'Apply med bedre indsigt | Naetwork',
  description: 'Vurdér dit match med en konkret stilling og prioritér de ændringer, der betyder mest før ansøgning.',
  alternates: { canonical: '/apply' },
}

export default function ApplyPage() {
  return <AccessPathContent pathId="apply" />
}
