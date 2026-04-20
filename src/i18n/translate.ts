import { Locale, locales } from "./locales/index";
import { LibraryTranslateFn, LocaleKey } from "./types";
import { DeepPartial, LocaleShape } from "../lib/types";

const getNestedValue = (obj: Record<string, unknown>, key: string): string | undefined => {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
};

const interpolate = (template: string, params?: Record<string, unknown>): string =>
  !params
    ? template
    : template.replace(/{{(\w+)}}/g, (_, key: string) => {
        const val = params[key];
        return typeof val === "string" || typeof val === "number" ? String(val) : `{{${key}}}`;
      });

export const createTranslator =
  (locale: Locale, localeTexts?: DeepPartial<LocaleShape>): LibraryTranslateFn =>
  (key: LocaleKey, params?: Record<string, unknown>): string => {
    const template =
      (localeTexts && getNestedValue(localeTexts as Record<string, unknown>, key)) ??
      getNestedValue(locales[locale] as Record<string, unknown>, key) ??
      getNestedValue(locales.en as Record<string, unknown>, key) ??
      key;
    return interpolate(template, params);
  };
