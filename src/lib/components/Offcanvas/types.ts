import { ReactNode } from "react";
import { Size3 } from "../../types";

export type OffcanvasPosition = "top" | "bottom" | "left" | "right";

export type OffcanvasDefaultableProps = {
  position?: OffcanvasPosition;
  size?: Size3;
  closable?: boolean;
  hideBackdrop?: boolean;
};

export type OffcanvasProps = {
  children: ReactNode;
  title?: string;
  open?: boolean;
  onClose?: () => void;
} & OffcanvasDefaultableProps;
