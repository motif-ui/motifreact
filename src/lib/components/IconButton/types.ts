import { Size7 } from "../../types";
import type { MouseEvent } from "react";

export type IconButtonProps = {
  iconClass?: string;
  disabled?: boolean;
  name?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & IconButtonDefaultableProps;

export type IconButtonDefaultableProps = {
  size?: Size7;
  variant?: "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "negative" | "strong";
};
