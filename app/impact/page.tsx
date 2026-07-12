import type { Metadata } from 'next';
import { ImpactContent } from '@/components/ImpactContent';

export const metadata: Metadata = {
  title: 'Bidragsmodel - Naetwork',
  description: 'Sådan afsætter hver betalt Naetwork-session 40-90% af sessionsprisen eksklusive moms til støtte for Kræftens Bekæmpelse.',
  alternates: { canonical: '/impact' },
};

export default function ImpactPage() {
  return <ImpactContent />;
}
