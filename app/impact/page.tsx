import type { Metadata } from 'next';
import { ImpactContent } from '@/components/ImpactContent';

export const metadata: Metadata = {
  title: 'Impact model - Naetwork',
  description: 'Hvordan hver betalt Naetwork karrieresession fordeles transparent mellem Kræftens Bekæmpelse, eksperten og platformen.',
};

export default function ImpactPage() {
  return <ImpactContent />;
}
