import type { IconGlobalType, VariantV2 } from "../../types";

export type BadgeProps = {
  variant?: VariantV2;
  content?: string;
  icon?: IconGlobalType;
  dot?: boolean;
} & BadgeDefaultableProps;

export type BadgeDefaultableProps = {
  max?: number;
  align?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};
