"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useReducer, useRef } from "react";
import { flushSync } from "react-dom";
import type { RefObject } from "react";
import { ApplyMode, Calculated, OverlayPositionOptions, Point } from "./types";
import { calculatePosition, getCssAnchorStyle, getCssAnchorTranslate, isSamePosition, supportsCssAnchor } from "./helper";

const useOverlayPosition = (
  anchorRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<HTMLElement | null>,
  options: OverlayPositionOptions,
) => {
  const { placement, enabled, keepInView } = options;
  const anchorName = `--motif-overlay-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  // The placement is chosen by JS on open in both ways. While open, CSS anchor positioning follows the anchor where it is supported.
  // keepInView needs flipping and sticking to the edges while scrolling, so it is followed by JS.
  const cssAnchor = !keepInView && supportsCssAnchor();
  // The latest calculation, kept in a ref since it may be written to the DOM without a render
  const calculatedRef = useRef<Calculated>(undefined);
  // Counts the calculations applied with a render, so the effect correcting the CSS position runs again for each of them
  const [renderedCalculation, countRenderedCalculation] = useReducer((count: number) => count + 1, 0);
  const cssTranslateRef = useRef<Point>({ x: 0, y: 0 });

  const calculate = useCallback(
    (fitIntoView: boolean, mode: ApplyMode) => {
      const anchor = anchorRef.current;
      const overlay = overlayRef.current;
      if (!anchor || !overlay) return;

      const prev = calculatedRef.current;
      const position = calculatePosition(anchor, overlay, placement, fitIntoView, prev);
      // Kept even when the position is the same, so the latest shift is followed
      calculatedRef.current = position;
      if (isSamePosition(prev, position)) return;

      if (mode === "dom" && prev?.placement === position.placement) {
        overlay.style.top = `${position.top}px`;
        overlay.style.left = `${position.left}px`;
      } else if (mode === "render") {
        countRenderedCalculation();
      } else {
        flushSync(countRenderedCalculation);
      }
    },
    [anchorRef, overlayRef, placement],
  );

  useLayoutEffect(() => {
    // The last calculation is not cleared when disabled, it is ignored instead and replaced on the next enable
    enabled && calculate(true, "render");
  }, [enabled, calculate]);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const overlay = overlayRef.current;
    const target = calculatedRef.current;
    if (!cssAnchor || !enabled || !anchor || !overlay || !target) return;

    // Corrects where CSS places the overlay to the calculated position, before the browser paints
    anchor.style.setProperty("anchor-name", anchorName);
    const translate = getCssAnchorTranslate(overlay, target);
    cssTranslateRef.current = translate;
    overlay.style.translate = `${translate.x}px ${translate.y}px`;

    return () => {
      anchor.style.removeProperty("anchor-name");
    };
  }, [cssAnchor, enabled, renderedCalculation, anchorRef, overlayRef, anchorName]);

  useEffect(() => {
    if (!enabled || cssAnchor) return;

    // Scroll and resize events and ResizeObserver callbacks run right before the browser paints the frame,
    // so updating synchronously in them keeps the overlay stuck to the anchor without lagging a frame behind
    const update = () => calculate(!!keepInView, keepInView ? "syncRender" : "dom");
    const handleScroll = ({ target }: Event) => {
      // Scrolls inside the overlay do not move it
      if (target instanceof Node && overlayRef.current?.contains(target)) return;
      update();
    };

    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    window.addEventListener("resize", update);
    const resizeObserver = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(update);
    anchorRef.current && resizeObserver?.observe(anchorRef.current);
    overlayRef.current && resizeObserver?.observe(overlayRef.current);

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      window.removeEventListener("resize", update);
      resizeObserver?.disconnect();
    };
  }, [enabled, keepInView, calculate, anchorRef, overlayRef, cssAnchor]);

  const positioned = enabled ? calculatedRef.current : undefined;
  if (!positioned) return { style: { top: 0, left: 0, visibility: "hidden" as const }, placement };
  return {
    style: cssAnchor
      ? getCssAnchorStyle(positioned.placement, anchorName, cssTranslateRef.current)
      : { top: positioned.top, left: positioned.left },
    placement: positioned.placement,
  };
};

export default useOverlayPosition;
