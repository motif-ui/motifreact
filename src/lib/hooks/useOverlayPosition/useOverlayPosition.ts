"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useReducer, useRef } from "react";
import type { RefObject } from "react";
import { Calculated, OverlayPositionProps, OverlayPositionReturn, Point, PositionMode } from "./types";
import {
  addAnchorName,
  calculatePosition,
  getCssAnchorStyle,
  getContainingBlockOrigin,
  getCssAnchorTranslate,
  getScrollAncestors,
  isSamePosition,
  removeAnchorName,
  setAnchorOffsets,
  supportsCssAnchor,
} from "./helper";

const useOverlayPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<HTMLElement | null>,
  props: OverlayPositionProps,
): OverlayPositionReturn => {
  const { placement, enabled, limitWidth = false } = props;
  const anchorName = `--motif-overlay-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  // The latest calculation, kept in a ref since it may be written to the DOM without a render
  const calculatedRef = useRef<Calculated>(undefined);
  // Counts the calculations applied with a render, so the effect correcting the CSS position runs again for each of them
  const [renderedCalculation, countRenderedCalculation] = useReducer(count => count + 1, 0);
  const cssTranslateRef = useRef<Point>({ x: 0, y: 0 });
  // Where the overlay's containing block starts in the document when JS positions it, measured after it is placed
  const originRef = useRef<Point>({ x: 0, y: 0 });
  const writePosition = useCallback((overlay: HTMLElement, position: Calculated) => {
    overlay.style.top = `${position.top - originRef.current.y}px`;
    overlay.style.left = `${position.left - originRef.current.x}px`;
  }, []);

  // Corrects where CSS places the overlay to the calculated position
  const correctCssPosition = useCallback((overlay: HTMLElement, target: Calculated) => {
    const translate = getCssAnchorTranslate(overlay, target);
    cssTranslateRef.current = translate;
    overlay.style.translate = `${translate.x}px ${translate.y}px`;
  }, []);

  /**
   * The placement is chosen by JS on open. While open, CSS anchor positioning follows the anchor where it is supported, JS otherwise.
   *
   * On open, the placement and the shift are chosen to fit the overlay into the viewport, and applied with a render.
   * While following the anchor or refitting a resized overlay, the placement is kept and the position is written to
   * the overlay element directly, so neither the overlay nor its content renders on each scroll frame.
   */
  const calculate = useCallback(
    (mode: PositionMode) => {
      const anchor = anchorRef.current;
      const overlay = overlayRef.current;
      if (!anchor || !overlay) return;

      const prev = calculatedRef.current;
      const position = calculatePosition(anchor, overlay, placement, mode, limitWidth, prev);
      // Kept even when the position is the same, so the shift calculated on open is followed
      calculatedRef.current = position;

      if (prev && !supportsCssAnchor()) {
        // Written directly also when it is rendered, since React skips a style value it rendered before,
        // while the element may have another one written while following
        writePosition(overlay, position);
      }
      if (mode === "fit" || !prev) {
        if (!isSamePosition(prev, position)) return countRenderedCalculation();
        if (!prev) return;
      } else if (mode === "follow" || isSamePosition(prev, position)) {
        // While following, the anchor's offsets stay the same, since the shift is kept
        return;
      }
      // Applied without a render, also when fitted again to the same position: CSS keeps the overlay at the anchor,
      // which may have moved or resized since the last correction
      if (supportsCssAnchor()) correctCssPosition(overlay, position);
      setAnchorOffsets(anchor, overlay);
    },
    [anchorRef, overlayRef, placement, limitWidth, correctCssPosition, writePosition],
  );

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!enabled || !anchor || !supportsCssAnchor()) return;
    // Added to the names of the anchor, which may have other overlays on it, e.g. a tooltip and a popover
    addAnchorName(anchor, anchorName);
    return () => removeAnchorName(anchor, anchorName);
  }, [enabled, anchorRef, anchorName]);

  useLayoutEffect(() => {
    // The last calculation is not cleared when disabled, it is ignored instead and replaced on the next enable
    enabled && calculate("fit");
  }, [enabled, calculate]);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const overlay = overlayRef.current;
    const target = calculatedRef.current;
    if (!enabled || !anchor || !overlay || !target) return;

    // Done before the browser paints. While following, the anchor's offsets stay the same, since the shift is kept.
    if (supportsCssAnchor()) {
      correctCssPosition(overlay, target);
    } else {
      // The position is written as if the overlay were positioned in the document, which holds unless its containing block
      // starts elsewhere, e.g. a positioned body with a margin. Then it is written again with where it starts.
      const origin = getContainingBlockOrigin(overlay, target, originRef.current);
      if (Math.abs(origin.x - originRef.current.x) >= 0.5 || Math.abs(origin.y - originRef.current.y) >= 0.5) {
        originRef.current = origin;
        writePosition(overlay, target);
      }
    }
    setAnchorOffsets(anchor, overlay);
  }, [enabled, renderedCalculation, anchorRef, overlayRef, correctCssPosition, writePosition]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!enabled || !anchor || supportsCssAnchor()) return;

    // Scroll events run right before the browser paints the frame,
    // so updating synchronously in them keeps the overlay stuck to the anchor without lagging a frame behind.
    // Only the scrolls that move the anchor are listened to: of the page and of the anchor's scrolling ancestors.
    const follow = () => calculate("follow");
    const targets = [document, ...getScrollAncestors(anchor.parentElement)];
    targets.forEach(target => target.addEventListener("scroll", follow, { passive: true }));
    return () => targets.forEach(target => target.removeEventListener("scroll", follow));
  }, [enabled, calculate, anchorRef]);

  useEffect(() => {
    const anchor = anchorRef.current;
    const overlay = overlayRef.current;
    if (!enabled || !overlay || typeof ResizeObserver === "undefined") return;

    // ResizeObserver callbacks run before the browser paints the frame too. The overlay is fitted into the viewport again
    // when its content resizes it, keeping its placement. The anchor's size is followed by CSS where it is supported.
    const resizeObserver = new ResizeObserver(entries => calculate(entries.some(({ target }) => target === overlay) ? "refit" : "follow"));
    resizeObserver.observe(overlay);
    if (anchor && !supportsCssAnchor()) resizeObserver.observe(anchor);
    return () => resizeObserver.disconnect();
  }, [enabled, calculate, anchorRef, overlayRef]);

  useEffect(() => {
    if (!enabled) return;

    // The placement chosen on open no longer holds when the viewport changes, so it is chosen again, also with CSS anchor positioning.
    // Resizing the window fires many events in a frame, so it is chosen once per frame, still before the frame is painted.
    const frame = { id: 0 };
    const fitAgain = () => {
      cancelAnimationFrame(frame.id);
      frame.id = requestAnimationFrame(() => calculate("fit"));
    };
    window.addEventListener("resize", fitAgain);
    return () => {
      cancelAnimationFrame(frame.id);
      window.removeEventListener("resize", fitAgain);
    };
  }, [enabled, calculate]);

  const positioned = enabled ? calculatedRef.current : undefined;
  if (!positioned) return { style: { top: 0, left: 0, visibility: "hidden" }, placement };
  const position = supportsCssAnchor()
    ? getCssAnchorStyle(positioned.placement, anchorName, cssTranslateRef.current)
    : { top: positioned.top - originRef.current.y, left: positioned.left - originRef.current.x };
  return { style: { ...position, maxWidth: positioned.maxWidth }, placement: positioned.placement };
};

export default useOverlayPosition;
