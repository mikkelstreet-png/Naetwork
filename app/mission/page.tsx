import type { Metadata } from 'next';
import { MissionContent } from '@/components/MissionContent';

export const metadata: Metadata = {
  title: 'Mission - Naetwork',
  description: 'Why Naetwork exists and how the platform makes insider career guidance more accessible and meaningful.',
};

export default function MissionPage() {
  return <MissionContent />;
}
