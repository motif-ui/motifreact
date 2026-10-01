"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { CSSProperties, RefObject } from "react";
import { OverlayPosition } from "src/lib/types";

type Options = {
  placement: OverlayPosition;
  /** Position is calculated only while enabled, typically while the overlay is attached */
  enabled: boolean;
  /**
   * When false, the overlay moves together with the anchor on scroll and resize, even out of the screen.
   * When true, it is kept in the viewport by flipping to the opposite side or sticking to the edges.
   */
  keepInView?: boolean;
};

type Point = { x: number; y: number };
type Size = { width: number; height: number };
type Box = { top: number; right: number; bottom: number; left: number };
type Calculated = { placement: OverlayPosition; top: number; left: number };
/**
 * How a new position is applied:
 * - render: a regular state update, used on open
 * - syncRender: a state update rendered before the browser paints, used when the placement or the shift may change
 * - dom: written to the overlay element directly, used while following the anchor, so the overlay and its content are not rendered
 */
type ApplyMode = "render" | "syncRender" | "dom";

const HIDDEN_STYLE: CSSProperties = { top: 0, left: 0, visibility: "hidden" };

const getSide = (placement: OverlayPosition) =>
  placement.startsWith("top") ? "top" : placement.startsWith("bottom") ? "bottom" : (placement as "left" | "right");

const getViewport = (): Box => {
  const { visualViewport: vv } = window;
  if (vv) return { top: vv.offsetTop, left: vv.offsetLeft, right: vv.offsetLeft + vv.width, bottom: vv.offsetTop + vv.height };
  const { clientWidth, clientHeight } = document.documentElement;
  return { top: 0, left: 0, right: clientWidth || window.innerWidth, bottom: clientHeight || window.innerHeight };
};

const getMargins = (el: HTMLElement): Box => {
  const { marginTop, marginRight, marginBottom, marginLeft } = getComputedStyle(el);
  return {
    top: parseFloat(marginTop) || 0,
    right: parseFloat(marginRight) || 0,
    bottom: parseFloat(marginBottom) || 0,
    left: parseFloat(marginLeft) || 0,
  };
};

/**
 * Candidates in the order of preference: the placement itself, the one with the other alignment (e.g. bottomLeft -> bottomRight),
 * then the opposite side ones (e.g. bottomLeft -> topLeft, topRight)
 */
const getCandidates = (placement: OverlayPosition): OverlayPosition[] => {
  const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
  const side = getSide(placement);
  const alignment = placement.slice(side.length);
  if (!alignment) return [placement, opposite[side]];

  const otherAlignment = alignment === "Left" ? "Right" : "Left";
  return [
    placement,
    `${side}${otherAlignment}`,
    `${opposite[side]}${alignment}`,
    `${opposite[side]}${otherAlignment}`,
  ] as OverlayPosition[];
};

/**
 * Viewport coordinates of the overlay's border box for the given placement.
 * The overlay's margin on the side facing the anchor is used as the gap between them.
 */
const getCoords = (placement: OverlayPosition, anchor: DOMRect, { width, height }: Size, margins: Box): Point => {
  const side = getSide(placement);
  if (side === "left" || side === "right") {
    return {
      x: side === "left" ? anchor.left - margins.right - width : anchor.right + margins.left,
      y: anchor.top + anchor.height / 2 - height / 2,
    };
  }
  return {
    x: placement.endsWith("Left")
      ? anchor.left
      : placement.endsWith("Right")
        ? anchor.right - width
        : anchor.left + anchor.width / 2 - width / 2,
    y: side === "top" ? anchor.top - margins.bottom - height : anchor.bottom + margins.top,
  };
};

const getOverflow = ({ x, y }: Point, { width, height }: Size, viewport: Box) =>
  Math.max(0, viewport.left - x) +
  Math.max(0, x + width - viewport.right) +
  Math.max(0, viewport.top - y) +
  Math.max(0, y + height - viewport.bottom);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

const supportsCssAnchor = () =>
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("anchor-name: --a") &&
  CSS.supports("top: anchor(bottom)");

const parseTranslate = (translate: string): Point => {
  const [x = 0, y = 0] = translate.split(" ").map(value => parseFloat(value) || 0);
  return { x, y };
};

/**
 * Keeps the overlay at the given placement with CSS anchor positioning. The browser moves it together with the anchor
 * in the same frame as a scroll, which JS cannot do since the scroll events arrive a frame after the scroll is painted.
 * The translate corrects it to the position calculated on open, e.g. the shift into the viewport.
 */
const getCssAnchorStyle = (placement: OverlayPosition, anchorName: string, translate: Point): CSSProperties => {
  const side = getSide(placement);
  const style: Record<string, string> = {
    positionAnchor: anchorName,
    // hides it while the anchor is completely clipped by a scroll container, so it does not float over unrelated content
    positionVisibility: "anchors-visible",
    top: "auto",
    left: "auto",
    translate: `${translate.x}px ${translate.y}px`,
  };

  if (side === "top") style.bottom = "anchor(top)";
  else if (side === "bottom") style.top = "anchor(bottom)";
  else if (side === "left") style.right = "anchor(left)";
  else style.left = "anchor(right)";

  if (side === "left" || side === "right") style.alignSelf = "anchor-center";
  else if (placement.endsWith("Left")) style.left = "anchor(left)";
  else if (placement.endsWith("Right")) style.right = "anchor(right)";
  else style.justifySelf = "anchor-center";

  return style;
};

const useOverlayPosition = (anchorRef: RefObject<HTMLElement | null>, overlayRef: RefObject<HTMLElement | null>, options: Options) => {
  const { placement, enabled, keepInView } = options;
  const anchorName = `--motif-overlay-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  // The placement is chosen by JS on open in both ways. While open, CSS anchor positioning follows the anchor where it is supported.
  // keepInView needs flipping and sticking to the edges while scrolling, so it is followed by JS.
  const cssAnchor = !keepInView && supportsCssAnchor();
  // The latest calculation is kept in the ref, since it may be written to the DOM without a render. The state only triggers renders.
  const calculatedRef = useRef<Calculated>(undefined);
  const [calculated, setCalculated] = useState<Calculated>();
  const cssTranslateRef = useRef<Point>({ x: 0, y: 0 });
  // The shift applied when the overlay is fitted into the viewport, kept while the overlay follows the anchor
  const shiftRef = useRef<Point>({ x: 0, y: 0 });

  const calculate = useCallback(
    (fitIntoView: boolean, mode: ApplyMode) => {
      const anchor = anchorRef.current;
      const overlay = overlayRef.current;
      if (!anchor || !overlay) return;

      const anchorRect = anchor.getBoundingClientRect();
      const size = { width: overlay.offsetWidth, height: overlay.offsetHeight };
      const margins = getMargins(overlay);
      let resolvedPlacement = calculatedRef.current?.placement ?? placement;
      let coords: Point;

      if (fitIntoView) {
        const viewport = getViewport();
        const candidates = getCandidates(placement).map(candidate => {
          const candidateCoords = getCoords(candidate, anchorRect, size, margins);
          return { candidate, candidateCoords, overflow: getOverflow(candidateCoords, size, viewport) };
        });
        const best = candidates.reduce((min, current) => (current.overflow < min.overflow ? current : min));
        resolvedPlacement = best.candidate;
        coords = {
          x: clamp(best.candidateCoords.x, viewport.left, Math.max(viewport.left, viewport.right - size.width)),
          y: clamp(best.candidateCoords.y, viewport.top, Math.max(viewport.top, viewport.bottom - size.height)),
        };
        shiftRef.current = { x: coords.x - best.candidateCoords.x, y: coords.y - best.candidateCoords.y };
      } else {
        const anchoredCoords = getCoords(resolvedPlacement, anchorRect, size, margins);
        coords = { x: anchoredCoords.x + shiftRef.current.x, y: anchoredCoords.y + shiftRef.current.y };
      }

      // The overlay is absolutely positioned in the document, so the margin box is positioned with document coordinates
      const next = {
        placement: resolvedPlacement,
        top: coords.y + window.scrollY - margins.top,
        left: coords.x + window.scrollX - margins.left,
      };
      const prev = calculatedRef.current;
      if (prev?.placement === next.placement && prev.top === next.top && prev.left === next.left) return;
      calculatedRef.current = next;

      if (mode === "dom" && prev?.placement === next.placement) {
        overlay.style.top = `${next.top}px`;
        overlay.style.left = `${next.left}px`;
      } else if (mode === "render") {
        setCalculated(next);
      } else {
        flushSync(() => setCalculated(next));
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

    // Measures where CSS places the overlay and corrects it to the calculated position, before the browser paints
    anchor.style.setProperty("anchor-name", anchorName);
    const margins = getMargins(overlay);
    const applied = parseTranslate(overlay.style.translate);
    const rect = overlay.getBoundingClientRect();
    const translate = {
      x: target.left - window.scrollX + margins.left - (rect.left - applied.x),
      y: target.top - window.scrollY + margins.top - (rect.top - applied.y),
    };
    cssTranslateRef.current = translate;
    overlay.style.translate = `${translate.x}px ${translate.y}px`;

    return () => {
      anchor.style.removeProperty("anchor-name");
    };
  }, [cssAnchor, enabled, calculated, anchorRef, overlayRef, anchorName]);

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
  if (!positioned) return { style: HIDDEN_STYLE, placement };
  return {
    style: cssAnchor
      ? getCssAnchorStyle(positioned.placement, anchorName, cssTranslateRef.current)
      : { top: positioned.top, left: positioned.left },
    placement: positioned.placement,
  };
};

export default useOverlayPosition;
