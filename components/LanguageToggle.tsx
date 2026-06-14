'use client';

import { useTranslation } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLang('da')}
        className={`px-2.5 py-1 rounded-full transition-all ${
          lang === 'da'
            ? 'bg-white text-[#0A0A0A] shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        DA
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-full transition-all ${
          lang === 'en'
            ? 'bg-white text-[#0A0A0A] shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
    </div>
  );
}
