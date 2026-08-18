export type Locale = "en" | "ar";

export const LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_STORAGE_KEY = "maqsed-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ar";
}
