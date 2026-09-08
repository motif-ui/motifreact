import type { IconGlobalType, Size5, Variant } from "../../types";

export type AvatarProps = {
  image?: string;
  icon?: IconGlobalType;
  letters?: string;
} & AvatarDefaultableProps;

export type AvatarDefaultableProps = {
  variant?: Variant;
  size?: Size5 | "xl2";
};
