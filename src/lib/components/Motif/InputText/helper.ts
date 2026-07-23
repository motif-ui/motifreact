import { TextTransform } from "@/components/Motif/InputText/types.ts";
import { capitalizeFirstLetter } from "src/utils/utils.ts";

export const applyTextTransform = (value: string, textTransform: TextTransform) => {
  switch (textTransform) {
    case "uppercase":
      return value.toUpperCase();
    case "lowercase":
      return value.toLowerCase();
    case "capitalize":
      return capitalizeFirstLetter(value);
    default:
      return value;
  }
};
