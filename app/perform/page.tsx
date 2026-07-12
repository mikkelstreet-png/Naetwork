import type { Metadata } from 'next'
import { AccessPathContent } from '@/components/AccessPathContent'

export const metadata: Metadata = {
  title: 'Perform i interview, case og forhandling | Naetwork',
  description: 'Forbered et konkret interview, en case, en forhandling eller vurderingen af et jobtilbud.',
  alternates: { canonical: '/perform' },
}

export default function PerformPage() {
  return <AccessPathContent pathId="perform" />
}
