"use client";

import { useCallback, useMemo, useRef } from "react";
import type { RefObject } from "react";
import useOverlayState from "./useOverlayState";
import useOverlayPosition from "./useOverlayPosition";
import useOverlayFocus from "./useOverlayFocus";
import { OverlayCloseReason, OverlayPosition } from "src/lib/types";

type Options = {
  anchorRef: RefObject<HTMLElement | null>;
  placement: OverlayPosition;
  keepInView?: boolean;
  /** Bridges the Tab key between the anchor and the overlay, use the returned onKeyDown on an ancestor of the anchor */
  tabBridge?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  duration?: number;
  onClose?: (reason: OverlayCloseReason) => void;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  closeOnScroll?: boolean;
};

/**
 * An overlay attached to an anchor element: open state and dismissal, positioning and keyboard focus in one place.
 * The overlay is expected to be absolutely positioned and rendered in document.body, e.g. with a portal.
 */
const useAnchoredOverlay = <T extends HTMLElement = HTMLDivElement>(options: Options) => {
  const { anchorRef, placement, keepInView, tabBridge, ...stateOptions } = options;
  const overlayRef = useRef<T>(null);
  const insideRefs = useMemo(() => [anchorRef, overlayRef], [anchorRef]);

  const state = useOverlayState({ ...stateOptions, insideRefs });
  const position = useOverlayPosition(anchorRef, overlayRef, { placement, keepInView, enabled: state.attached });

  const { close } = state;
  const onLeave = useCallback(() => close("focusLeave"), [close]);
  const { onKeyDown } = useOverlayFocus(anchorRef, overlayRef, { enabled: !!tabBridge && state.open, onLeave });

  return { ...state, ...position, overlayRef, onKeyDown };
};

export default useAnchoredOverlay;
