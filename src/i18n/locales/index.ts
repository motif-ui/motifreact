import en from "./en.json" with { type: "json" };
import tr from "./tr.json" with { type: "json" };

/**
 * Add a new locale here — this is the only file a contributor needs to touch.
 * The Locale type and autocomplete keys update automatically.
 */
export const locales = { en, tr } as const;

export type Locale = keyof typeof locales;
