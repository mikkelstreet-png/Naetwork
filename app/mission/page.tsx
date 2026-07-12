import type { Metadata } from 'next';
import { MissionContent } from '@/components/MissionContent';

export const metadata: Metadata = {
  title: 'Mission - Naetwork',
  description: 'Hvorfor Naetwork gør erfaringsbaseret karrieresparring mere tilgængelig, konkret og meningsfuld.',
  alternates: { canonical: '/mission' },
};

export default function MissionPage() {
  return <MissionContent />;
}
