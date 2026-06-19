import { useMemo } from "react";
import { useMotifContext } from "src/lib/motif/context/MotifProvider.tsx";
import { DateLocale, getDateLocale } from "src/i18n/helper.ts";

/**
 * A custom hook to fetch the current date locale.
 * It prioritizes an explicitly passed locale, falling back to the motif context.
 *
 * @param contextLocale - An optional override locale string or object
 * @returns The resolved date locale
 */
export function useDateLocale<T = DateLocale>(contextLocale?: T): T | DateLocale {
  const { t } = useMotifContext();

  return useMemo(() => {
    return contextLocale ?? getDateLocale(t);
  }, [contextLocale, t]);
}
