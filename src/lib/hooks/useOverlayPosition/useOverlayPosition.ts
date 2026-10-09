"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useReducer, useRef } from "react";
import type { RefObject } from "react";
import { Calculated, OverlayPositionProps, OverlayPositionReturn, Point } from "./types";
import { calculatePosition, getCssAnchorStyle, getCssAnchorTranslate, isSamePosition, supportsCssAnchor } from "./helper";

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

  /**
   * The placement is chosen by JS on open. While open, CSS anchor positioning follows the anchor where it is supported, JS otherwise.
   *
   * On open, the placement and the shift are chosen to fit the overlay into the viewport, and applied with a render.
   * While following the anchor, they are kept and the position is written to the overlay element directly,
   * so neither the overlay nor its content renders on each scroll frame.
   */
  const calculate = useCallback(
    (followAnchor: boolean) => {
      const anchor = anchorRef.current;
      const overlay = overlayRef.current;
      if (!anchor || !overlay) return;

      const prev = calculatedRef.current;
      const position = calculatePosition(anchor, overlay, placement, !followAnchor, limitWidth, prev);
      // Kept even when the position is the same, so the shift calculated on open is followed
      calculatedRef.current = position;
      if (isSamePosition(prev, position)) return;

      if (followAnchor && prev) {
        overlay.style.top = `${position.top}px`;
        overlay.style.left = `${position.left}px`;
      } else {
        countRenderedCalculation();
      }
    },
    [anchorRef, overlayRef, placement, limitWidth],
  );

  useLayoutEffect(() => {
    // The last calculation is not cleared when disabled, it is ignored instead and replaced on the next enable
    enabled && calculate(false);
  }, [enabled, calculate]);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const overlay = overlayRef.current;
    const target = calculatedRef.current;
    if (!supportsCssAnchor() || !enabled || !anchor || !overlay || !target) return;

    // Corrects where CSS places the overlay to the calculated position, before the browser paints
    anchor.style.setProperty("anchor-name", anchorName);
    const translate = getCssAnchorTranslate(overlay, target);
    cssTranslateRef.current = translate;
    overlay.style.translate = `${translate.x}px ${translate.y}px`;

    return () => {
      anchor.style.removeProperty("anchor-name");
    };
  }, [enabled, renderedCalculation, anchorRef, overlayRef, anchorName]);

  useEffect(() => {
    if (!enabled || supportsCssAnchor()) return;

    // Scroll events and ResizeObserver callbacks run right before the browser paints the frame,
    // so updating synchronously in them keeps the overlay stuck to the anchor without lagging a frame behind
    const follow = () => calculate(true);
    const handleScroll = ({ target }: Event) => {
      // Scrolls inside the overlay do not move it
      if (target instanceof Node && overlayRef.current?.contains(target)) return;
      follow();
    };

    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    const resizeObserver = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(follow);
    anchorRef.current && resizeObserver?.observe(anchorRef.current);
    overlayRef.current && resizeObserver?.observe(overlayRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      resizeObserver?.disconnect();
    };
  }, [enabled, calculate, anchorRef, overlayRef]);

  useEffect(() => {
    if (!enabled) return;

    // The placement chosen on open no longer holds when the viewport changes, so it is chosen again, also with CSS anchor positioning
    const fitAgain = () => calculate(false);
    window.addEventListener("resize", fitAgain);
    return () => window.removeEventListener("resize", fitAgain);
  }, [enabled, calculate]);

  const positioned = enabled ? calculatedRef.current : undefined;
  if (!positioned) return { style: { top: 0, left: 0, visibility: "hidden" }, placement };
  const position = supportsCssAnchor()
    ? getCssAnchorStyle(positioned.placement, anchorName, cssTranslateRef.current)
    : { top: positioned.top, left: positioned.left };
  return { style: { ...position, maxWidth: positioned.maxWidth }, placement: positioned.placement };
};

export default useOverlayPosition;
