import { MouseEvent } from "react";
import { IconGlobalType, OverlayCloseReason, Size4LG, VariantV2 } from "../../types";

export type AlertModalContentPosition = "left" | "center" | "right";
export type AlertModalButtonPosition = "left" | "center" | "right" | "spaceBetween" | "stretch" | "fullWidth";
export type IconPosition = "left" | "right";

export type AlertModalButtonProps = {
  text: string;
  icon?: IconGlobalType;
  iconPosition?: IconPosition;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export type AlertModalProps = {
  title: string;
  text?: string;
  open?: boolean;
  onClose?: (reason: OverlayCloseReason) => void;
  onAfterClose?: () => void;
  actionButton?: AlertModalButtonProps;
  alternateButton?: AlertModalButtonProps;
} & AlertModalDefaultableProps;

export type AlertModalDefaultableProps = {
  icon?: IconGlobalType;
  size?: Size4LG;
  contentPosition?: AlertModalContentPosition;
  buttonsPosition?: AlertModalButtonPosition;
  variant?: VariantV2;
  enableDivider?: boolean;
  removeBackdrop?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  closable?: boolean;
};
