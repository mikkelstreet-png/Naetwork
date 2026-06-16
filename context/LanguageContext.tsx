'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { t, type Lang } from '@/lib/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'da',
  setLang: () => {},
  tr: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('da');
  const tr = (key: string): string => t[lang][key] ?? key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
