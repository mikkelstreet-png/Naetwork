import type { Metadata } from 'next';
import { ImpactContent } from '@/components/ImpactContent';

export const metadata: Metadata = {
  title: 'Bidragsmodel - Naetwork',
  description: 'How every paid Naetwork career session contributes to Kræftens Bekæmpelse through the platform impact model.',
};

export default function ImpactPage() {
  return <ImpactContent />;
}
