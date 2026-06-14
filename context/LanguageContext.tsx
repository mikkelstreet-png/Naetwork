'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { t, Lang } from '@/lib/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'da',
  setLang: () => {},
  tr: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('da');

  useEffect(() => {
    const stored = localStorage.getItem('naetwork_lang') as Lang | null;
    if (stored === 'da' || stored === 'en') {
      setLangState(stored);
      document.documentElement.lang = stored;
    } else {
      document.documentElement.lang = 'da';
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('naetwork_lang', l);
    document.documentElement.lang = l;
  };

  const tr = (key: string): string => {
    return t[lang][key] ?? t['da'][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
