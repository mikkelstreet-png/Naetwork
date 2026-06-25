import type { Metadata } from 'next';
import { MissionContent } from '@/components/MissionContent';

export const metadata: Metadata = {
  title: 'Mission - Naetwork',
  description: 'Hvorfor Naetwork findes, og hvordan platformen gør konkret karrieresparring mere tilgængelig og meningsfuld.',
};

export default function MissionPage() {
  return <MissionContent />;
}
