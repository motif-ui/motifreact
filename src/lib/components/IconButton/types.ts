import { IconGlobalType, Size8LG, Variant } from "../../types";
import type { MouseEvent } from "react";

export type IconButtonProps = {
  iconClass?: string;
  disabled?: boolean;
  name?: IconGlobalType;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & IconButtonDefaultableProps;

export type IconButtonDefaultableProps = {
  size?: Size8LG;
  variant?: Variant | "negative" | "strong";
};
