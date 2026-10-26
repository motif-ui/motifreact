"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import { OverlayPlaceOn } from "../../types";
import { OverlayPositionProps, OverlayPositionReturn, Position } from "./types";
import { calculatePosition, followAnchor, isFixed, needsRefit } from "./helper/placement.ts";
import { addAnchorName, INSETS, placeWithCssAnchor, removeAnchorName, supportsCssAnchor } from "./helper/cssAnchor.ts";
import { getScrollAncestors, placeWithJs } from "./helper/jsFallback.ts";

/**
 * Clears the written position, so the overlay is measured at the origin without a limit from its placement.
 * It is fixed on the screen when its anchor is, e.g. in a modal, so a scroll of the page behind does not move it away.
 */
const resetPosition = (overlay: HTMLElement, fixed: boolean) => {
  const { style } = overlay;
  style.position = fixed ? "fixed" : "";
  INSETS.forEach(inset => (style[inset] = ""));
  style.top = "0px";
  style.left = "0px";
  style.justifySelf = "";
  style.alignSelf = "";
  style.translate = "";
};

/**
 * Writes where the anchor's edges are relative to the overlay's border box as CSS variables, e.g. for a caret pointing
 * to the anchor: --overlay-anchor-left, --overlay-anchor-right, --overlay-anchor-top and --overlay-anchor-bottom.
 */
const setAnchorOffsets = (anchor: HTMLElement, overlay: HTMLElement) => {
  const anchorRect = anchor.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  overlay.style.setProperty("--overlay-anchor-left", `${anchorRect.left - overlayRect.left}px`);
  overlay.style.setProperty("--overlay-anchor-right", `${anchorRect.right - overlayRect.left}px`);
  overlay.style.setProperty("--overlay-anchor-top", `${anchorRect.top - overlayRect.top}px`);
  overlay.style.setProperty("--overlay-anchor-bottom", `${anchorRect.bottom - overlayRect.top}px`);
};

const getAnchorWidth = (anchor: HTMLElement) => `${anchor.offsetWidth}px`;
type Mode = "place" | "refit" | "follow";

const POSITIONED: CSSProperties = {};
const HIDDEN: CSSProperties = { visibility: "hidden" };

/**
 * Positions an overlay next to its anchor. The placement is chosen by JS on open, so it fits into the viewport.
 * The anchor's width is written to the overlay as --overlay-anchor-width before it is measured, e.g. for its width or min-width.
 * While it is open, CSS anchor positioning keeps it at the anchor where it is supported, JS follows the anchor otherwise.
 *
 * The position is written to the overlay element, so neither the overlay nor its content renders on each update.
 * Only the chosen placement is rendered, e.g. for the classes of a caret.
 */
const useOverlayPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<HTMLElement | null>,
  props: OverlayPositionProps,
): OverlayPositionReturn => {
  const { placement, enabled, limitWidth = false } = props;
  const anchorName = `--motif-overlay-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const positionRef = useRef<Position>(undefined);
  // Not cleared when disabled, it is ignored instead and replaced on the next enable before the overlay is painted
  const [placed, setPlaced] = useState<OverlayPlaceOn>();

  /**
   * place: chooses the placement, e.g. on open or when the viewport changes
   * refit: keeps the placement and shifts it horizontally into the viewport again, e.g. when its content resizes it
   * follow: keeps the placement and the shift, so the overlay moves with the anchor (JS fallback only)
   */
  const update = useCallback(
    (mode: Mode) => {
      const anchor = anchorRef.current;
      const overlay = overlayRef.current;
      const previous = positionRef.current;
      if (!anchor || !overlay || (mode !== "place" && !previous)) return;

      // Measures the overlay from a cleared position, keeping the placement of the given position (refit) or choosing it (place)
      const measure = (keep?: Position) => {
        const fixed = keep ? keep.fixed : isFixed(anchor);
        resetPosition(overlay, fixed);
        overlay.style.setProperty("--overlay-anchor-width", getAnchorWidth(anchor));
        return calculatePosition(anchor, overlay, placement, limitWidth, fixed, keep);
      };
      const position = mode === "follow" && previous ? followAnchor(anchor, previous) : measure(mode === "refit" ? previous : undefined);
      positionRef.current = position;

      if (supportsCssAnchor()) {
        placeWithCssAnchor(overlay, anchorName, position);
      } else {
        placeWithJs(overlay, position);
      }
      setAnchorOffsets(anchor, overlay);
      // Only a new placement is rendered, the other modes keep it
      if (mode === "place") setPlaced(position.placement);
    },
    [anchorRef, overlayRef, placement, limitWidth, anchorName],
  );

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!enabled || !anchor || !supportsCssAnchor()) return;
    // Added to the names of the anchor, which may have other overlays on it, e.g. a tooltip and a popover
    addAnchorName(anchor, anchorName);
    return () => removeAnchorName(anchor, anchorName);
  }, [enabled, anchorRef, anchorName]);

  useLayoutEffect(() => {
    if (enabled) update("place");
  }, [enabled, update]);

  const positioned = enabled ? placed : undefined;
  useLayoutEffect(() => {
    // The class of the chosen placement, rendered after it is chosen, may change the margins, e.g. when placeOn changes its side
    const overlay = overlayRef.current;
    if (positioned && overlay && needsRefit(overlay, positionRef.current)) update("refit");
  }, [positioned, overlayRef, update]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!enabled || !anchor || supportsCssAnchor()) return;

    // JS follows what moves the anchor without resizing it, which CSS anchor positioning follows by itself:
    // - the scrolls of the page, e.g. for a fixed anchor, and of the anchor's scrolling ancestors
    // - the end of an animation, e.g. a modal popping in or a panel collapsing above the anchor. It does not follow
    //   while the animation runs. Following keeps the placement and does not measure the overlay, so it is cheap
    //   to run on the end of any animation on the page, also the ones that do not move the anchor.
    const follow = () => update("follow");
    const scrollTargets = [document, ...getScrollAncestors(anchor.parentElement)];
    const animationEnds = ["transitionend", "animationend"] as const;
    scrollTargets.forEach(target => target.addEventListener("scroll", follow, { passive: true }));
    animationEnds.forEach(type => document.addEventListener(type, follow, { capture: true }));
    return () => {
      scrollTargets.forEach(target => target.removeEventListener("scroll", follow));
      animationEnds.forEach(type => document.removeEventListener(type, follow, { capture: true }));
    };
  }, [enabled, update, anchorRef]);

  useEffect(() => {
    const anchor = anchorRef.current;
    const overlay = overlayRef.current;
    if (!enabled || !overlay || typeof ResizeObserver === "undefined") return;

    // ResizeObserver callbacks run before the browser paints the frame. The overlay is fitted into the viewport again
    // when its content resizes it. The anchor's size is followed by CSS where it is supported.
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.some(({ target }) => target === overlay) && needsRefit(overlay, positionRef.current)) {
        update("refit");
      } else if (anchor && entries.some(({ target }) => target !== overlay)) {
        update(overlay.style.getPropertyValue("--overlay-anchor-width") === getAnchorWidth(anchor) ? "follow" : "refit");
      }
    });
    resizeObserver.observe(overlay);
    if (anchor && !supportsCssAnchor()) resizeObserver.observe(anchor);
    return () => resizeObserver.disconnect();
  }, [enabled, update, anchorRef, overlayRef]);

  useEffect(() => {
    if (!enabled) return;

    // The placement chosen on open no longer holds when the viewport changes, so it is chosen again.
    // Resizing the window fires many events in a frame, so it is chosen once per frame, still before the frame is painted.
    const frame = { id: 0 };
    const placeAgain = () => {
      cancelAnimationFrame(frame.id);
      frame.id = requestAnimationFrame(() => update("place"));
    };
    window.addEventListener("resize", placeAgain);
    return () => {
      cancelAnimationFrame(frame.id);
      window.removeEventListener("resize", placeAgain);
    };
  }, [enabled, update]);

  return positioned ? { style: POSITIONED, placement: positioned } : { style: HIDDEN, placement };
};

export default useOverlayPosition;
