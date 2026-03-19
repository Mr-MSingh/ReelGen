"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  LANGUAGE_COOKIE,
  LANGUAGE_STORAGE_KEY,
  isSiteLanguage,
  type SiteLanguage,
} from "./site-language";

type LanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (nextLanguage: SiteLanguage) => void;
};

const LANGUAGE_MAX_AGE = 60 * 60 * 24 * 365;

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persistLanguage(nextLanguage: SiteLanguage) {
  document.documentElement.lang = nextLanguage;
  document.cookie = `${LANGUAGE_COOKIE}=${nextLanguage}; path=/; max-age=${LANGUAGE_MAX_AGE}; samesite=lax`;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  } catch {}
}

export default function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage: SiteLanguage;
}) {
  const [language, setLanguageState] = useState<SiteLanguage>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    try {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (isSiteLanguage(storedLanguage) && storedLanguage !== initialLanguage) {
        persistLanguage(storedLanguage);

        startTransition(() => {
          setLanguageState(storedLanguage);
        });
      }
    } catch {}
  }, [initialLanguage]);

  const setLanguage = (nextLanguage: SiteLanguage) => {
    persistLanguage(nextLanguage);

    startTransition(() => {
      setLanguageState(nextLanguage);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
