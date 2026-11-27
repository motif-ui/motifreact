import { IconGlobalType, Size7, VariantV2 } from "../../types";
import type { MouseEvent } from "react";

export type IconButtonProps = {
  iconClass?: string;
  disabled?: boolean;
  name?: IconGlobalType;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & IconButtonDefaultableProps;

export type IconButtonDefaultableProps = {
  size?: Size7;
  variant?: VariantV2 | "negative" | "strong";
};
