import type { IconGlobalType, Variant } from "../../types";

export type BadgeProps = {
  variant?: Variant;
  content?: string;
  icon?: IconGlobalType;
  dot?: boolean;
} & BadgeDefaultableProps;

export type BadgeDefaultableProps = {
  max?: number;
  align?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};
