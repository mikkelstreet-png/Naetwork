import type { Metadata } from 'next'
import { AccessPathContent } from '@/components/AccessPathContent'

export const metadata: Metadata = {
  title: 'Prepare dit næste karrieretræk | Naetwork',
  description: 'Få et ærligt syn på dit CV, dit udgangspunkt eller et planlagt karriereskift.',
  alternates: { canonical: '/prepare' },
}

export default function PreparePage() {
  return <AccessPathContent pathId="prepare" />
}
