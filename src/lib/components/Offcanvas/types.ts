import { PropsWithChildren } from "react";
import { OverlayCloseReason, Size3 } from "../../types";

export type OffcanvasPosition = "top" | "bottom" | "left" | "right";

export type OffcanvasDefaultableProps = {
  position?: OffcanvasPosition;
  size?: Size3;
  closable?: boolean;
  removeBackdrop?: boolean;
};

export type OffcanvasProps = PropsWithChildren<{
  title?: string;
  open?: boolean;
  onClose?: (reason: OverlayCloseReason) => void;
  onAfterClose?: () => void;
  includePadding?: boolean;
}> &
  OffcanvasDefaultableProps;
