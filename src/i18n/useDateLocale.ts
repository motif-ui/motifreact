import { useMemo } from "react";
import { useMotifContext } from "src/lib/motif/context/MotifProvider.tsx";
import { getDateLocale } from "src/i18n/helper.ts";
import { DateLocale } from "src/i18n/types.ts";

/**
 * A custom hook to fetch the current date locale.
 * It prioritizes an explicitly passed locale, falling back to the motif context.
 *
 * @param contextLocale - An optional override locale string or object
 * @returns The resolved date locale
 */
export function useDateLocale<T = DateLocale>(contextLocale?: T) {
  const { t } = useMotifContext();
  return useMemo(() => contextLocale ?? getDateLocale(t), [contextLocale, t]);
}
