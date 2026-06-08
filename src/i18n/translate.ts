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
  if (typeof current === "number") return String(current);
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

export const createTranslator =
  (locale: Locale, localeTexts?: DeepPartial<LocaleShape>): LibraryTranslateFn =>
  (key: LocaleKey, params?: Record<string, unknown>): string => {
    const template =
      (localeTexts && getNestedValue(localeTexts, key as string)) ??
      getNestedValue(locales[locale], key as string) ??
      getNestedValue(locales.en, key as string) ??
      key;
    return <string>interpolate(template as string, params);
  };
