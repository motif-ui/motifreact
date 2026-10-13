"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import useOverlayState from "../useOverlayState";
import useOverlayPosition from "../useOverlayPosition";
import useOverlayFocus from "../useOverlayFocus";
import { OverlayStateProps } from "../useOverlayState/types";
import { OverlayPlaceOn } from "../../types";

type Props = {
  anchorRef: RefObject<HTMLElement | null>;
  placement: OverlayPlaceOn;
  /** Limits the overlay's width to the space at its placement, so long content wraps instead of overflowing the screen */
  limitWidth?: boolean;
  /** Bridges the Tab key between the anchor and the overlay */
  tabBridge?: boolean;
  /** Opens and closes the overlay when the anchor is clicked */
  toggleOnAnchorClick?: boolean;
} & Omit<OverlayStateProps, "insideRefs">;

/**
 * An overlay attached to an anchor element: open state and dismissal, positioning and keyboard focus in one place.
 * The overlay is expected to be absolutely positioned and rendered in document.body, e.g. with a portal.
 * It is fixed on the screen while its anchor is, e.g. in a modal.
 */
const useAnchoredOverlay = <T extends HTMLElement = HTMLDivElement>(props: Props) => {
  const { anchorRef, placement, limitWidth, tabBridge, toggleOnAnchorClick, ...overlayStateProps } = props;
  const overlayRef = useRef<T>(null);
  const insideRefs = useMemo(() => [anchorRef, overlayRef], [anchorRef]);

  const state = useOverlayState({ ...overlayStateProps, insideRefs });
  const position = useOverlayPosition(anchorRef, overlayRef, { placement, limitWidth, enabled: state.attached });

  const { hide, show, open } = state;
  const onLeave = useCallback(() => hide("focusLeave"), [hide]);
  useOverlayFocus(anchorRef, overlayRef, { enabled: !!tabBridge && state.open, onLeave });

  useEffect(() => {
    if (!toggleOnAnchorClick) return;
    // Reads the anchor on each click, so it also works after the anchor node is replaced, e.g. in a filtered list.
    // Capture phase, so a click handler of the anchor that stops the propagation does not block it.
    const handleClick = (e: MouseEvent) => {
      if (!(e.target instanceof Node) || !anchorRef.current?.contains(e.target)) return;
      open ? hide("anchorClick") : show();
    };
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [anchorRef, open, hide, show, toggleOnAnchorClick]);

  return { ...state, ...position, overlayRef };
};

export default useAnchoredOverlay;
