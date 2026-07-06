import type { Metadata } from 'next';
import { ImpactContent } from '@/components/ImpactContent';

export const metadata: Metadata = {
  title: 'Bidragsmodel - Naetwork',
  description: 'Sådan afsætter hver betalt Naetwork-session 40-90% af sessionsprisen til støtte for Kræftens Bekæmpelse.',
};

export default function ImpactPage() {
  return <ImpactContent />;
}
