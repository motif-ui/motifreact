import { Locale, locales } from "./locales/index";
import { DeepPartial, LocaleShape } from "../lib/types";

/**
 * Accepted values for the `locale` prop on MotifProvider.
 *
 * - Plain string: `locale="tr"` — use the built-in locale, no overrides.
 * - Object: `locale={{ locale: "tr", texts: { upload: { browse: "Gözat" } } }}`
 *   — built-in locale with partial text overrides, or a fully custom locale.
 */
export type LocaleConfig = Locale | { locale?: Locale; texts?: DeepPartial<LocaleShape> };

/**
 * Recursively builds a union of all dot-notation key paths in a JSON shape.
 * e.g. { upload: { browse: string } } → "upload" | "upload.browse"
 */
type DeepKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends Record<string, unknown>
      ? `${Prefix}${K}` | DeepKeys<T[K], `${Prefix}${K}.`>
      : never;
}[keyof T & string];

/** Union of every valid translation key derived from the English locale file. */
export type LocaleKey = DeepKeys<typeof locales.en>;

/**
 * A minimal translation function whose first argument is constrained to known
 * locale keys — giving full IDE autocomplete for t("upload.‸").
 *
 * The signature is intentionally compatible with i18next's `t` so consumers
 * can pass their own t to <MotifProvider t={t}> without type errors.
 */
export type LibraryTranslateFn = (key: LocaleKey, params?: Record<string, unknown>) => string;
