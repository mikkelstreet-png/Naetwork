import type { Metadata } from 'next';
import { ImpactContent } from '@/components/ImpactContent';
import { CONTRIBUTION_PERCENT, PLATFORM_SHARE_PERCENT, PROFESSIONAL_SHARE_PERCENT } from '@/lib/platform';

export const metadata: Metadata = {
  title: 'Pris og bidrag | Naetwork',
  description: `Se den faste fordeling af nettoprisen: ${CONTRIBUTION_PERCENT}% til Kræftens Bekæmpelse, ${PLATFORM_SHARE_PERCENT}% til Naetwork og ${PROFESSIONAL_SHARE_PERCENT}% til den professionelle.`,
  alternates: { canonical: '/impact' },
};

export default function ImpactPage() {
  return <ImpactContent />;
}
