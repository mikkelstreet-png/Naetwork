'use client';

import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { HeartIcon } from './icons/HeartIcon';

export interface ProfessionalData {
  id: string;
  name: string;
  title: string;
  company?: string;
  industry: string;
  bio: string;
  session_types: string[];
  price_dkk: number;
  donates_to_charity: boolean;
  available: boolean;
  languages: string[];
}

const SESSION_LABELS: Record<string, string> = {
  mock_interview: 'Mock Interview',
  cv_review: 'CV & LinkedIn',
  informal_chat: 'Uformel 1:1',
  career_advice: 'Karriereraadgivning',
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0].slice(0, 2);
  return (
    <div className="w-14 h-14 rounded-full bg-green-800 text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
      {initials.toUpperCase()}
    </div>
  );
}

export function ProfessionalCard({ professional }: { professional: ProfessionalData }) {
  const { lang } = useLanguage();

  return (
    <div className="border border-gray-100 rounded-2xl p-6 hover:border-gray-300 transition-colors flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <Initials name={professional.name} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900">{professional.name}</div>
          <div className="text-sm text-gray-500">{professional.title}{professional.company ? ` · ${professional.company}` : ''}</div>
          <div className="mt-1">
            <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{professional.industry}</span>
          </div>
        </div>
      </div>

      {professional.donates_to_charity && (
        <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg px-3 py-1.5 text-xs font-medium">
          <HeartIcon className="w-3.5 h-3.5 flex-shrink-0" />
          {t(lang, 'charity.badge')}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {professional.session_types.map(st => (
          <span key={st} className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {SESSION_LABELS[st] ?? st}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className="font-semibold text-gray-900">DKK {professional.price_dkk} <span className="font-normal text-sm text-gray-400">/ session</span></span>
        <a href={`/professionals/${professional.id}`} className="text-sm font-medium text-green-800 hover:text-green-900">
          Se profil →
        </a>
      </div>
    </div>
  );
}
