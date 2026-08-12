import { ar } from "./dictionaries/ar";
import { en, type Dictionary } from "./dictionaries/en";
import type { Locale } from "./types";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ar,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

type Primitive = string | number | boolean | null | undefined;

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Primitive
    ? Key
    : T[Key] extends ReadonlyArray<infer U>
      ? U extends Primitive
        ? Key
        : `${Key}.${PathImpl<U, keyof U>}` | Key
      : `${Key}.${PathImpl<T[Key], keyof T[Key]>}` | Key
  : never;

export type TranslationKey = PathImpl<Dictionary, keyof Dictionary>;

export function translate(
  dictionary: Dictionary,
  key: string,
  fallback?: string
): string {
  const parts = key.split(".");
  let current: unknown = dictionary;

  for (const part of parts) {
    if (current == null || typeof current !== "object") {
      return fallback ?? key;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current === "string") return current;
  return fallback ?? key;
}
