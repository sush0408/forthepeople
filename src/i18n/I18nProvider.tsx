/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";
import { translateDictionaryValue, type TranslationDictionary } from "./translate";

export { translateDictionaryValue } from "./translate";
export type { TranslationDictionary } from "./translate";

type I18nContextValue = {
  locale: string;
  dictionary: TranslationDictionary;
  t: (path: string, fallback?: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: string;
  dictionary: TranslationDictionary;
  children: ReactNode;
}) {
  const value: I18nContextValue = {
    locale,
    dictionary,
    t: (path, fallback = path, vars) => translateDictionaryValue(dictionary, path, fallback, vars),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
