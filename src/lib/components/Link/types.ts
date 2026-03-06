import { Size3 } from "../../types";
import type { MouseEvent } from "react";

export type LinkProps = {
  label?: string;
  disabled?: boolean;
  url?: string;
  icon?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
  iconPosition?: "left" | "right";
} & LinkDefaultableProps;

export type LinkDefaultableProps = {
  targetBlank?: boolean;
  size?: Size3;
  underline?: boolean;
};
