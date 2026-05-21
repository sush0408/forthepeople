/**
 * ForThePeople.in — Your District. Your Data. Your Right.
 * © 2026 Jayanth M B. MIT License with Attribution.
 * https://github.com/jayanthmb14/forthepeople
 */

export type TranslationStatus = "complete" | "fallback";

export type LocaleMeta = {
  code: string;
  englishName: string;
  nativeName: string;
  shortLabel: string;
  dir: "ltr" | "rtl";
  translationStatus: TranslationStatus;
};

export const SUPPORTED_LOCALES = [
  { code: "en", englishName: "English", nativeName: "English", shortLabel: "EN", dir: "ltr", translationStatus: "complete" },
  { code: "kn", englishName: "Kannada", nativeName: "ಕನ್ನಡ", shortLabel: "ಕನ್ನಡ", dir: "ltr", translationStatus: "complete" },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", shortLabel: "हिन्दी", dir: "ltr", translationStatus: "complete" },
  { code: "te", englishName: "Telugu", nativeName: "తెలుగు", shortLabel: "తెలుగు", dir: "ltr", translationStatus: "fallback" },
  { code: "ta", englishName: "Tamil", nativeName: "தமிழ்", shortLabel: "தமிழ்", dir: "ltr", translationStatus: "fallback" },
  { code: "ml", englishName: "Malayalam", nativeName: "മലയാളം", shortLabel: "മലയാളം", dir: "ltr", translationStatus: "fallback" },
  { code: "mr", englishName: "Marathi", nativeName: "मराठी", shortLabel: "मराठी", dir: "ltr", translationStatus: "fallback" },
  { code: "bn", englishName: "Bengali", nativeName: "বাংলা", shortLabel: "বাংলা", dir: "ltr", translationStatus: "fallback" },
  { code: "gu", englishName: "Gujarati", nativeName: "ગુજરાતી", shortLabel: "ગુજરાતી", dir: "ltr", translationStatus: "fallback" },
  { code: "pa", englishName: "Punjabi", nativeName: "ਪੰਜਾਬੀ", shortLabel: "ਪੰਜਾਬੀ", dir: "ltr", translationStatus: "fallback" },
  { code: "or", englishName: "Odia", nativeName: "ଓଡ଼ିଆ", shortLabel: "ଓଡ଼ିଆ", dir: "ltr", translationStatus: "fallback" },
  { code: "as", englishName: "Assamese", nativeName: "অসমীয়া", shortLabel: "অসমীয়া", dir: "ltr", translationStatus: "fallback" },
  { code: "ur", englishName: "Urdu", nativeName: "اردو", shortLabel: "اردو", dir: "rtl", translationStatus: "fallback" },
  { code: "sa", englishName: "Sanskrit", nativeName: "संस्कृतम्", shortLabel: "संस्कृतम्", dir: "ltr", translationStatus: "fallback" },
  { code: "ne", englishName: "Nepali", nativeName: "नेपाली", shortLabel: "नेपाली", dir: "ltr", translationStatus: "fallback" },
  { code: "sd", englishName: "Sindhi", nativeName: "سنڌي", shortLabel: "سنڌي", dir: "rtl", translationStatus: "fallback" },
  { code: "ks", englishName: "Kashmiri", nativeName: "कॉशुर", shortLabel: "कॉशुर", dir: "ltr", translationStatus: "fallback" },
  { code: "doi", englishName: "Dogri", nativeName: "डोगरी", shortLabel: "डोगरी", dir: "ltr", translationStatus: "fallback" },
  { code: "kok", englishName: "Konkani", nativeName: "कोंकणी", shortLabel: "कोंकणी", dir: "ltr", translationStatus: "fallback" },
  { code: "mni", englishName: "Manipuri", nativeName: "মৈতৈলোন্", shortLabel: "মৈতৈলোন্", dir: "ltr", translationStatus: "fallback" },
  { code: "brx", englishName: "Bodo", nativeName: "बड़ो", shortLabel: "बड़ो", dir: "ltr", translationStatus: "fallback" },
  { code: "sat", englishName: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", shortLabel: "ᱥᱟᱱᱛᱟᱲᱤ", dir: "ltr", translationStatus: "fallback" },
  { code: "mai", englishName: "Maithili", nativeName: "मैथिली", shortLabel: "मैथिली", dir: "ltr", translationStatus: "fallback" },
] as const satisfies readonly LocaleMeta[];

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]["code"];

export const LOCALE_CODES = SUPPORTED_LOCALES.map((locale) => locale.code) as [AppLocale, ...AppLocale[]];

export function getLocaleMeta(code: string): LocaleMeta {
  return SUPPORTED_LOCALES.find((locale) => locale.code === code) ?? SUPPORTED_LOCALES[0];
}
