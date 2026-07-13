import type { Metadata } from 'next';
import { ImpactContent } from '@/components/ImpactContent';

export const metadata: Metadata = {
  title: 'Pris og bidrag | Naetwork',
  description: 'Se den faste fordeling af nettoprisen: 20% til Naetwork, 30% til Kræftens Bekæmpelse og 50% til den professionelle.',
  alternates: { canonical: '/impact' },
};

export default function ImpactPage() {
  return <ImpactContent />;
}
