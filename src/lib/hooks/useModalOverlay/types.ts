import type { Ref, RefObject, SyntheticEvent } from "react";
import { OverlayCloseReason } from "src/lib/types";
import { UseOverlayStateReturn } from "../useOverlayState/types";

export type ModalOverlayProps = {
  open: boolean;
  /** A ref from outside, e.g. a component's prop, that also gets the root element */
  rootRef?: Ref<HTMLDivElement>;
  onClose?: (reason: OverlayCloseReason) => void;
  onAfterClose?: () => void;
  duration?: number;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
};

export type UseModalOverlayReturn<T extends HTMLElement = HTMLDivElement> = Pick<UseOverlayStateReturn, "attached" | "visible" | "hide"> & {
  /** The element that covers the page, e.g. the backdrop. Clicks on it close the modal when closeOnOutsideClick is set */
  rootRef: Ref<HTMLDivElement>;
  /** The dialog in the root. It gets the focus on open, so give it tabIndex={-1} */
  dialogRef: RefObject<T | null>;
  /**
   * Handlers to spread on the dialog. Clicks and focuses in nested overlays rendered in their own portals bubble through
   * the React tree, so they are counted as inside the dialog, e.g. a select's list.
   */
  insideProps: UseOverlayStateReturn["insideProps"] & { onFocus: (e: SyntheticEvent) => void };
};
