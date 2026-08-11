import { Locale, locales } from "./locales/index.ts";
import { LibraryTranslateFn, LocaleKey } from "./types";
import { DeepPartial, LocaleShape } from "../lib/types";

const getNestedValue = (obj: Record<string, unknown>, key: string): string | string[] | undefined => {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === "string") return current;
  if (Array.isArray(current) && current.every(item => typeof item === "string")) return current;
  return undefined;
};

const interpolate = (template: string | string[], params?: Record<string, unknown>): string | string[] => {
  if (Array.isArray(template) || !params) {
    return template;
  }

  return template.replace(/{{(\w+)}}/g, (_, key: string) => {
    const val = params[key];
    return typeof val === "string" || typeof val === "number" ? String(val) : `{{${key}}}`;
  });
};

// Locales where Intl.PluralRules returns "other" for all counts (Turkish has no built-in singular category).
// For these, count === 1 is explicitly mapped to "_one".
const SINGULAR_OVERRIDE_LOCALES: readonly Locale[] = ["tr"];

const getPluralSuffix = (locale: Locale, count: number): string => {
  if (SINGULAR_OVERRIDE_LOCALES.includes(locale)) {
    return count === 1 ? "_one" : "";
  }
  const rule = new Intl.PluralRules(locale).select(count);
  return rule === "other" ? "" : `_${rule}`;
};

const lookupText = (key: string, locale: Locale, localeTexts?: DeepPartial<LocaleShape>): string | string[] | undefined =>
  (localeTexts && getNestedValue(localeTexts, key)) ?? getNestedValue(locales[locale], key);

export const createTranslator =
  (locale: Locale, localeTexts?: DeepPartial<LocaleShape>): LibraryTranslateFn =>
  (key: LocaleKey, params?: Record<string, unknown>) => {
    const suffix = typeof params?.count === "number" ? getPluralSuffix(locale, params.count) : "";
    const pluralKey = suffix ? `${key}${suffix}` : undefined;
    const template =
      (pluralKey && lookupText(pluralKey, locale, localeTexts)) ??
      lookupText(key, locale, localeTexts) ??
      getNestedValue(locales.en, key) ??
      key;
    return interpolate(template, params) as string;
  };
