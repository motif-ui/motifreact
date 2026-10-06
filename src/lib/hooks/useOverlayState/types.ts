import type { RefObject, SyntheticEvent } from "react";
import { OverlayCloseReason } from "src/lib/types";

export type OverlayStateProps = {
  /** Controlled open state. When it is not given, the overlay manages its own state */
  open?: boolean;
  /** Initial open state for the uncontrolled usage */
  defaultOpen?: boolean;
  /** Length in ms of the enter/exit transition */
  duration?: number;
  /** Called once per open cycle, when the overlay starts closing or when a close is requested in the controlled usage */
  onClose?: (reason?: OverlayCloseReason) => void;
  /**
   * Elements that are part of the overlay. Clicks and scrolls inside them do not close it.
   * Pass a stable array (e.g. with useMemo), otherwise the listeners are added again on each render.
   */
  insideRefs?: RefObject<HTMLElement | null>[];
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  /** Closes the overlay when a scroll moves the inside elements, e.g. a page or a container scroll */
  closeOnScroll?: boolean;
};

export type UseOverlayStateReturn = {
  open: boolean;
  /** Whether the overlay should be in the DOM, it stays true during the exit transition */
  attached: boolean;
  /** Whether the overlay should be shown, use it to trigger the enter/exit transitions */
  visible: boolean;
  show: () => void;
  /** Closes the overlay with the given reason, passed to onClose. In the controlled usage it only calls onClose. */
  hide: (reason?: OverlayCloseReason) => void;
  toggle: () => void;
  /**
   * Handlers to spread on an element whose React subtree belongs to the overlay, e.g. the overlay root.
   * Clicks in nested overlays rendered in their own portals bubble through the React tree, so they are not counted as outside.
   */
  insideProps: { onMouseUp: (e: SyntheticEvent) => void; onTouchEnd: (e: SyntheticEvent) => void };
};
