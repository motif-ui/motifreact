import { ReactElement, ReactNode, MouseEvent } from "react";
import { Size3 } from "../../types";
import { LinkProps } from "../Link/types";
import { ButtonProps } from "../Button/types";
import { IconButtonProps } from "../IconButton/types";

export type ModalDefaultableProps = {
  size?: Size3;
  maximizable?: boolean;
  closable?: boolean;
};

export type ModalProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  open?: boolean;
  onClose?: () => void;
  buttons?: ReactElement<ButtonProps | LinkProps | IconButtonProps>[];
  actionButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  alternateButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  noContentPadding?: boolean;
} & ModalDefaultableProps;
