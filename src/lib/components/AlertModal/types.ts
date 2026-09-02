import { ReactElement } from "react";
import { ButtonProps } from "../Button/types";
import { Size3 } from "../../types";

export type AlertModalContentPosition = "left" | "center" | "right";
export type AlertModalButtonsPosition = AlertModalContentPosition | "spread" | "stretch";

export type AlertModalProps = {
  title: string;
  subtitle?: string;
  icon?: ReactElement;
  open?: boolean;
  onClose?: () => void;
  buttonAction?: ReactElement<ButtonProps>[];
} & AlertModalDefaultableProps;

export type AlertModalDefaultableProps = {
  size?: Size3;
  contentPosition?: AlertModalContentPosition;
  buttonsPosition?: AlertModalButtonsPosition;
  enableDivider?: boolean;
  removeBackdrop?: boolean;
  bordered?: boolean;
  elevated?: boolean;
};
