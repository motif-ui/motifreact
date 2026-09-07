import { IconGlobalType, Size7, Variant } from "../../types";
import type { MouseEvent } from "react";

export type IconButtonProps = {
  iconClass?: string;
  disabled?: boolean;
  name?: IconGlobalType;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & IconButtonDefaultableProps;

export type IconButtonDefaultableProps = {
  size?: Size7;
  variant?: Variant | "negative" | "strong";
};
