import type { IconGlobalType, Size4SM, VariantV2 } from "../../types";

export type ChipProps = {
  label: string;
  icon?: IconGlobalType;
  variant?: VariantV2;
  closable?: boolean;
  onClose?: () => void;
} & ChipDefaultableProps;

export type ChipDefaultableProps = {
  shape?: "solid" | "outline";
  size?: Size4SM;
  pill?: boolean;
};
