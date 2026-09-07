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

const getPluralSuffix = (locale: Locale, count: number): string => {
  const rule = new Intl.PluralRules(locale).select(count);
  return rule === "other" ? "" : `_${rule}`;
};

const lookup = (key: string, ...sources: (Record<string, unknown> | undefined)[]) => {
  for (const source of sources) {
    if (!source) continue;
    const val = getNestedValue(source, key);
    if (val !== undefined) return val;
  }
};

export const createTranslator =
  (locale: Locale, localeTexts?: DeepPartial<LocaleShape>): LibraryTranslateFn =>
  (key: LocaleKey, params?: Record<string, unknown>) => {
    const suffix = typeof params?.count === "number" ? getPluralSuffix(locale, params.count) : "";
    const pluralKey = suffix ? `${key}${suffix}` : undefined;
    const template =
      (pluralKey && lookup(pluralKey, localeTexts)) ??
      lookup(key, localeTexts) ??
      (pluralKey && lookup(pluralKey, locales[locale])) ??
      lookup(key, locales[locale], locales.en) ??
      key;
    return interpolate(template, params) as string;
  };
