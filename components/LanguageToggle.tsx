'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === 'da' ? 'en' : 'da')}
      aria-label={lang === 'da' ? 'Switch to English' : 'Skift til dansk'}
      className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium px-2"
    >
      {lang === 'da' ? 'EN' : 'DA'}
    </button>
  );
}
