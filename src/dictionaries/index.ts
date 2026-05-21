/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

import en from "./en.json";
import hi from "./hi.json";
import kn from "./kn.json";
import { getLocaleMeta } from "@/i18n/locales";
import type { TranslationDictionary } from "@/i18n/I18nProvider";

const dictionaries = {
  en,
  hi,
  kn,
} as const;

export type Dictionary = TranslationDictionary;

export function getDictionary(locale: string): Dictionary {
  return dictionaries[locale as keyof typeof dictionaries] ?? dictionaries.en;
}

export function getDictionaryInfo(locale: string) {
  const meta = getLocaleMeta(locale);

  return {
    locale: meta.code,
    nativeName: meta.nativeName,
    englishName: meta.englishName,
    dir: meta.dir,
    usesFallbackDictionary: !(meta.code in dictionaries),
  };
}
