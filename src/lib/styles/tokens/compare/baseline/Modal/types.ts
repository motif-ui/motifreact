import { ReactElement, ReactNode, MouseEvent } from "react";
import { OverlayCloseReason, Size4LG } from "../../../../../types";
import { LinkProps } from "../../../../../components/Link/types";
import { ButtonProps } from "../../../../../components/Button/types";
import { IconButtonProps } from "../../../../../components/IconButton/types";

export type ModalDefaultableProps = {
  size?: Size4LG;
  maximizable?: boolean;
  closable?: boolean;
};

export type ModalProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  open?: boolean;
  onClose?: (reason: OverlayCloseReason) => void;
  onAfterClose?: () => void;
  buttons?: ReactElement<ButtonProps | LinkProps | IconButtonProps>[];
  actionButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  alternateButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  noContentPadding?: boolean;
} & ModalDefaultableProps;
