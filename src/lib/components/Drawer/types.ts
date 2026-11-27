import { OverlayCloseReason, Size3 } from "../../types";

export type DrawerPosition = "top" | "bottom" | "left" | "right";

export type DrawerProps = {
  title?: string;
  open?: boolean;
  onClose?: (reason: OverlayCloseReason) => void;
  onAfterClose?: () => void;
  includePadding?: boolean;
} & DrawerDefaultableProps;

export type DrawerDefaultableProps = {
  position?: DrawerPosition;
  size?: Size3;
  closable?: boolean;
  removeBackdrop?: boolean;
};
