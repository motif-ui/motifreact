import { useCallback } from "react";
import { TextTransform } from "@/components/Motif/InputText/types.ts";
import { Locale } from "src/i18n/locales/index.ts";
import { useMotifContext } from "src/lib/motif/context/MotifProvider";

const applyTextTransform = (value: string, textTransform: TextTransform, locale?: Locale) => {
  switch (textTransform) {
    case "uppercase":
      return value.toLocaleUpperCase(locale);
    case "lowercase":
      return value.toLocaleLowerCase(locale);
    case "capitalize":
      return value.replace(/(^|\s)\S/g, char => char.toLocaleUpperCase(locale));
    default:
      return value;
  }
};

export const useTextTransform = () => {
  const { locale } = useMotifContext();
  return useCallback((value: string, textTransform: TextTransform) => applyTextTransform(value, textTransform, locale), [locale]);
};
