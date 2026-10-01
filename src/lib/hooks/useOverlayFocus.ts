"use client";

import { useCallback } from "react";
import type { KeyboardEvent, RefObject } from "react";

type Options = {
  enabled: boolean;
  /** Called when the focus leaves the overlay by tabbing forward from its last element */
  onLeave?: () => void;
};

const focusableSelector = 'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const isVisible = (el: HTMLElement) => el.offsetParent !== null && !el.closest("[inert]");

/**
 * Bridges the keyboard focus between an anchor and its overlay rendered elsewhere in the DOM (e.g. a portal):
 * Tab from the last anchor element moves into the overlay, Shift+Tab from the first overlay element moves back,
 * and Tab from the last overlay element moves to the element after the anchor.
 * The returned onKeyDown should be attached to a common ancestor of the anchor in the React tree.
 */
const useOverlayFocus = (anchorRef: RefObject<HTMLElement | null>, overlayRef: RefObject<HTMLElement | null>, options: Options) => {
  const { enabled, onLeave } = options;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !enabled || !overlayRef.current || !anchorRef.current) return;

      const anchorEls = Array.from(anchorRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(isVisible);
      const overlayEls = Array.from(overlayRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(isVisible);
      const lastInAnchor = anchorEls.at(-1);
      const firstInOverlay = overlayEls.at(0);
      const lastInOverlay = overlayEls.at(-1);
      const inOverlay = overlayRef.current.contains(e.target as Node);

      if (!e.shiftKey && e.target === lastInAnchor && firstInOverlay) {
        e.preventDefault();
        firstInOverlay.focus({ preventScroll: true });
      } else if (inOverlay && e.shiftKey && e.target === firstInOverlay) {
        e.preventDefault();
        lastInAnchor?.focus({ preventScroll: true });
      } else if (inOverlay && !e.shiftKey && e.target === lastInOverlay) {
        const allEls = Array.from(document.querySelectorAll<HTMLElement>(focusableSelector)).filter(
          el => !overlayRef.current!.contains(el),
        );
        const nextEl = allEls.at(allEls.findLastIndex(el => anchorRef.current!.contains(el)) + 1);
        onLeave?.();
        if (nextEl) {
          e.preventDefault();
          nextEl.focus({ preventScroll: true });
        }
      }
    },
    [enabled, onLeave, anchorRef, overlayRef],
  );

  return { onKeyDown };
};

export default useOverlayFocus;
