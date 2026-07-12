import type { Metadata } from 'next';
import { MissionContent } from '@/components/MissionContent';

export const metadata: Metadata = {
  title: 'Mission - Naetwork',
  description: 'Hvorfor Naetwork gør relevant karriereviden mindre afhængig af personlige netværk.',
  alternates: { canonical: '/mission' },
};

export default function MissionPage() {
  return <MissionContent />;
}
