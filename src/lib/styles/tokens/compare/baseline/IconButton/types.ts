import { IconGlobalType, Size10LG, Variant } from "../../../../../types";
import type { MouseEvent } from "react";

export type IconButtonProps = {
  iconClass?: string;
  disabled?: boolean;
  name?: IconGlobalType;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & IconButtonDefaultableProps;

export type IconButtonDefaultableProps = {
  size?: Size10LG;
  variant?: Variant | "negative" | "strong";
};
