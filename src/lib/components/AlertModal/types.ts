import { MouseEvent } from "react";
import { IconGlobalType, Size4LG, Variant } from "../../types";

export type AlertModalProps = {
  title: string;
  text?: string;
  open?: boolean;
  onClose?: () => void;
  actionButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  alternateButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
} & AlertModalDefaultableProps;

export type AlertModalDefaultableProps = {
  icon?: IconGlobalType;
  size?: Size4LG;
  contentPosition?: "left" | "center";
  buttonsPosition?: "left" | "center" | "right" | "spaceBetween" | "stretch" | "fullWidth";
  variant?: Variant;
  enableDivider?: boolean;
  removeBackdrop?: boolean;
  bordered?: boolean;
  elevated?: boolean;
};
