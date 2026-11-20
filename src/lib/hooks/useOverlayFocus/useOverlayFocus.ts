"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { focusableSelector, getFocusables } from "./focusable";

type Props = {
  enabled: boolean;
  /** Called when the focus leaves the overlay by tabbing forward from its last element */
  onLeave?: () => void;
};

/**
 * Bridges the keyboard focus between an anchor and its overlay rendered elsewhere in the DOM (e.g. a portal):
 * Tab from the last anchor element moves into the overlay, Shift+Tab from the first overlay element moves back,
 * and Tab from the last overlay element moves to the element after the anchor.
 * It listens on the document while enabled, so the anchor and the overlay need no common ancestor.
 */
const useOverlayFocus = (anchorRef: RefObject<HTMLElement | null>, overlayRef: RefObject<HTMLElement | null>, props: Props) => {
  const { enabled, onLeave } = props;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const anchor = anchorRef.current;
      const overlay = overlayRef.current;
      if (e.key !== "Tab" || !anchor || !overlay || !(e.target instanceof Node)) return;
      const inOverlay = overlay.contains(e.target);
      if (!inOverlay && !anchor.contains(e.target)) return;

      const anchorEls = getFocusables(anchor);
      const overlayEls = getFocusables(overlay);
      const lastInAnchor = anchorEls.at(-1);
      const firstInOverlay = overlayEls.at(0);
      const lastInOverlay = overlayEls.at(-1);

      if (!e.shiftKey && e.target === lastInAnchor && firstInOverlay) {
        e.preventDefault();
        firstInOverlay.focus({ preventScroll: true });
      } else if (inOverlay && e.shiftKey && e.target === firstInOverlay) {
        e.preventDefault();
        lastInAnchor?.focus({ preventScroll: true });
      } else if (inOverlay && !e.shiftKey && e.target === lastInOverlay) {
        const allEls = Array.from(document.querySelectorAll<HTMLElement>(focusableSelector)).filter(el => !overlay.contains(el));
        const nextEl = allEls.at(allEls.findLastIndex(el => anchor.contains(el)) + 1);
        onLeave?.();
        if (nextEl) {
          e.preventDefault();
          nextEl.focus({ preventScroll: true });
        }
      }
    };

    // Capture phase, so an element inside that stops the propagation of keydown does not block the bridge
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [enabled, onLeave, anchorRef, overlayRef]);
};

export default useOverlayFocus;
