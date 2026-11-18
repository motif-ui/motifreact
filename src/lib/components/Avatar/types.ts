import type { IconGlobalType, Size5, VariantV2 } from "../../types";

export type AvatarProps = {
  image?: string;
  icon?: IconGlobalType;
  letters?: string;
} & AvatarDefaultableProps;

export type AvatarDefaultableProps = {
  variant?: VariantV2;
  size?: Size5 | "xxl";
};
