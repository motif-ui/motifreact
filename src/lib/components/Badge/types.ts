import type { IconGlobalType, Variants } from "../../types";

export type BadgeProps = {
  variant?: Variants;
  content?: string;
  icon?: IconGlobalType;
  dot?: boolean;
} & BadgeDefaultableProps;

export type BadgeDefaultableProps = {
  max?: number;
  align?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};
