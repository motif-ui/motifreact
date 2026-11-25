import { TextTransform } from "@/components/Motif/InputText/types.ts";
import { InputSize } from "@/components/Form/types";
import { Size8LG } from "../../../types";
import { Locale } from "src/i18n/locales/index.ts";

export const applyTextTransform = (value: string, textTransform: TextTransform, locale?: Locale) => {
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

// A field's icons are as tall as its text line (16 · 20 · 24 · 28), so an icon never makes the field taller
export const fieldIconSizeMap: Record<InputSize, Size8LG> = { xs: "xxs", sm: "sm", md: "lg", lg: "xl" };
