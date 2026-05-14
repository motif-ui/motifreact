import type { IconGlobalType, Size4SM } from "../../types";

export type ChipProps = {
  label: string;
  icon?: IconGlobalType;
  variant?: ChipVariant;
  closable?: boolean;
  onClose?: () => void;
} & ChipDefaultableProps;

export type ChipDefaultableProps = {
  shape?: "solid" | "outline";
  size?: Size4SM;
  pill?: boolean;
};

export type ChipVariant = "primary" | "secondary" | "danger" | "success" | "warning" | "info";
