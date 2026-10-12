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
  /** Makes the overlay as wide as its anchor, e.g. a list under a select */
  matchAnchorWidth?: boolean;
  /** Bridges the Tab key between the anchor and the overlay */
  tabBridge?: boolean;
  /** Opens and closes the overlay when the anchor is clicked */
  toggleOnAnchorClick?: boolean;
  /**
   * Opens the overlay while the pointer is on the anchor or the overlay, or the focus is in them, e.g. a tooltip.
   * It closes a moment after they are left, so the pointer can cross the gap between them.
   */
  openOnHover?: boolean;
} & Omit<OverlayStateProps, "insideRefs">;

/** How long the overlay stays open after the pointer or the focus leaves it and its anchor, in ms */
const HOVER_LEAVE_DELAY = 100;

/**
 * An overlay attached to an anchor element: open state and dismissal, positioning and keyboard focus in one place.
 * The overlay is expected to be absolutely positioned and rendered in document.body, e.g. with a portal.
 * It is fixed on the screen while its anchor is, e.g. in a modal.
 */
const useAnchoredOverlay = <T extends HTMLElement = HTMLDivElement>(props: Props) => {
  const { anchorRef, placement, limitWidth, matchAnchorWidth, tabBridge, toggleOnAnchorClick, openOnHover, ...overlayStateProps } = props;
  const overlayRef = useRef<T>(null);
  const insideRefs = useMemo(() => [anchorRef, overlayRef], [anchorRef]);

  const state = useOverlayState({ ...overlayStateProps, insideRefs });
  const position = useOverlayPosition(anchorRef, overlayRef, { placement, limitWidth, matchAnchorWidth, enabled: state.attached });

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

  useEffect(() => {
    if (!openOnHover) return;
    const isOn = (target: EventTarget | null) => target instanceof Node && insideRefs.some(ref => ref.current?.contains(target));
    const timer = { id: undefined as ReturnType<typeof setTimeout> | undefined };
    const enter = (target: EventTarget | null) => {
      if (!isOn(target)) return;
      clearTimeout(timer.id);
      show();
    };
    const leave = (target: EventTarget | null, next: EventTarget | null, reason: "hoverLeave" | "focusLeave") => {
      if (!isOn(target) || isOn(next)) return;
      clearTimeout(timer.id);
      timer.id = setTimeout(() => hide(reason), HOVER_LEAVE_DELAY);
    };
    // Listened on the document, so it works with an anchor replaced while open, like the anchor click
    const handleMouseOver = (e: MouseEvent) => enter(e.target);
    const handleMouseOut = (e: MouseEvent) => leave(e.target, e.relatedTarget, "hoverLeave");
    const handleFocusIn = (e: FocusEvent) => enter(e.target);
    const handleFocusOut = (e: FocusEvent) => leave(e.target, e.relatedTarget, "focusLeave");
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      clearTimeout(timer.id);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [openOnHover, insideRefs, show, hide]);

  return { ...state, ...position, overlayRef };
};

export default useAnchoredOverlay;
