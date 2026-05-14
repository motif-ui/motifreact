import { IconGlobalType, Size7 } from "../../types";
import type { MouseEvent } from "react";

export type IconButtonProps = {
  iconClass?: string;
  disabled?: boolean;
  name?: IconGlobalType;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & IconButtonDefaultableProps;

export type IconButtonDefaultableProps = {
  size?: Size7;
  variant?: "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "negative" | "strong";
};
