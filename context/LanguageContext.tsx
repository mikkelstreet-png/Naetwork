'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { t, type Lang } from '@/lib/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'da',
  setLang: () => {},
  tr: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('da');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('naetwork_lang') as Lang | null;
      if (stored === 'da' || stored === 'en') {
        setLangState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      document.documentElement.lang = 'da';
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem('naetwork_lang', l);
    } catch {
      // The language still applies for the current session when storage is unavailable.
    }
  };

  const tr = (key: string): string => {
    return t[lang]?.[key] ?? t['da']?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslation() {
  return useContext(LanguageContext);
}
