import { TextTransform } from "@/components/Motif/InputText/types.ts";
import { capitalizeFirstLetter } from "src/utils/utils.ts";

export const applyTextTransform = (value: string, textTransform: TextTransform) => {
  switch (textTransform) {
    case "uppercase":
      return value.toLocaleUpperCase();
    case "lowercase":
      return value.toLocaleLowerCase();
    case "capitalize":
      return capitalizeFirstLetter(value);
    default:
      return value;
  }
};
