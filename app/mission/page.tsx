import type { Metadata } from 'next';
import { MissionContent } from '@/components/MissionContent';

export const metadata: Metadata = {
  title: 'Mission - Naetwork',
  description: 'Hvorfor Naetwork åbner relevant professionel erfaring, der tidligere var afhængig af personlige netværk.',
  alternates: { canonical: '/mission' },
};

export default function MissionPage() {
  return <MissionContent />;
}
