export const LOCALE_STORAGE_KEY = "gyb-locale";

export const APP_LOCALES = [
  { value: "tr", label: "Türkçe", short: "TR" },
  { value: "en", label: "English", short: "EN" },
] as const;

export type AppLocale = (typeof APP_LOCALES)[number]["value"];

export function isAppLocale(value: string): value is AppLocale {
  return value === "tr" || value === "en";
}

export function readStoredLocale(): AppLocale {
  if (typeof window === "undefined") return "tr";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored && isAppLocale(stored) ? stored : "tr";
}

export function persistLocale(locale: AppLocale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.documentElement.lang = locale;
}

export function localeShort(code: AppLocale): string {
  return APP_LOCALES.find((l) => l.value === code)?.short ?? code.toUpperCase();
}
