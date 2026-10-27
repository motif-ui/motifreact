import type { RefObject, SyntheticEvent } from "react";
import { OverlayCloseReason } from "src/lib/types";
import { UseOverlayStateReturn } from "../useOverlayState/types";

export type ModalOverlayProps = {
  open: boolean;
  onClose?: (reason: OverlayCloseReason) => void;
  duration?: number;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
};

export type UseModalOverlayReturn = Pick<UseOverlayStateReturn, "attached" | "visible" | "hide"> & {
  /** The element that covers the page, e.g. the backdrop. Clicks on it close the modal when closeOnOutsideClick is set */
  rootRef: RefObject<HTMLDivElement | null>;
  /** The dialog in the root. It gets the focus on open, so give it tabIndex={-1} */
  dialogRef: RefObject<HTMLDivElement | null>;
  /**
   * Handlers to spread on the dialog. Clicks and focuses in nested overlays rendered in their own portals bubble through
   * the React tree, so they are counted as inside the dialog, e.g. a select's list.
   */
  insideProps: UseOverlayStateReturn["insideProps"] & { onFocus: (e: SyntheticEvent) => void };
};
