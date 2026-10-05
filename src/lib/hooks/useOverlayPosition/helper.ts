import type { CSSProperties } from "react";
import { Box, Calculated, OverlayPosition, PlacementCandidate, Point, Size } from "./types";
import { clamp } from "src/utils/utils";

const OPPOSITE_SIDE = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

const getSide = (placement: OverlayPosition) =>
  placement.startsWith("top") ? "top" : placement.startsWith("bottom") ? "bottom" : (placement as "left" | "right");

/** The edge the overlay is aligned to on the cross axis, empty when it is centered */
const getAlignment = (placement: OverlayPosition) => placement.slice(getSide(placement).length) as "" | "Left" | "Right";

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
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  if (!alignment) return [placement, OPPOSITE_SIDE[side]];

  const otherAlignment = alignment === "Left" ? "Right" : "Left";
  return [
    placement,
    `${side}${otherAlignment}`,
    `${OPPOSITE_SIDE[side]}${alignment}`,
    `${OPPOSITE_SIDE[side]}${otherAlignment}`,
  ] as OverlayPosition[];
};

/**
 * Viewport coordinates of the overlay's border box for the given placement.
 * The overlay's margin on the side facing the anchor is used as the gap between them.
 */
const getCoords = (placement: OverlayPosition, anchor: DOMRect, { width, height }: Size, margins: Box): Point => {
  const side = getSide(placement);

  return side === "left" || side === "right"
    ? {
        x: side === "left" ? anchor.left - margins.right - width : anchor.right + margins.left,
        y: anchor.top + anchor.height / 2 - height / 2,
      }
    : {
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

/**
 * Picks the candidate placement that overflows the viewport the least and shifts it into the viewport.
 * Returns the shift too, so it can be kept while the overlay follows the anchor.
 */
const fitIntoViewport = (placement: OverlayPosition, anchorRect: DOMRect, size: Size, margins: Box) => {
  const viewport = getViewport();
  // On equal overflows the earlier candidate is kept, since the candidates are in the order of preference
  const best = getCandidates(placement).reduce<PlacementCandidate | undefined>((min, candidate) => {
    const coords = getCoords(candidate, anchorRect, size, margins);
    const overflow = getOverflow(coords, size, viewport);
    return min && min.overflow <= overflow ? min : { candidate, coords, overflow };
  }, undefined)!;
  const coords = {
    x: clamp(best.coords.x, viewport.left, Math.max(viewport.left, viewport.right - size.width)),
    y: clamp(best.coords.y, viewport.top, Math.max(viewport.top, viewport.bottom - size.height)),
  };
  return { placement: best.candidate, coords, shift: { x: coords.x - best.coords.x, y: coords.y - best.coords.y } };
};

/**
 * Calculates the overlay's position next to the anchor.
 * When fitIntoView is true, the placement and the shift are chosen to keep it in the viewport.
 * Otherwise the previous placement and shift are kept, so it follows the anchor.
 */
export const calculatePosition = (
  anchor: HTMLElement,
  overlay: HTMLElement,
  placement: OverlayPosition,
  fitIntoView: boolean,
  previous?: Calculated,
): Calculated => {
  const anchorRect = anchor.getBoundingClientRect();
  const size = { width: overlay.offsetWidth, height: overlay.offsetHeight };
  const margins = getMargins(overlay);
  const fitted = fitIntoView ? fitIntoViewport(placement, anchorRect, size, margins) : undefined;
  const shift = fitted?.shift ?? previous?.shift ?? { x: 0, y: 0 };
  const resolvedPlacement = fitted?.placement ?? previous?.placement ?? placement;
  const anchoredCoords = getCoords(resolvedPlacement, anchorRect, size, margins);
  const coords = fitted?.coords ?? { x: anchoredCoords.x + shift.x, y: anchoredCoords.y + shift.y };

  // The overlay is absolutely positioned in the document, so the margin box is positioned with document coordinates
  return {
    placement: resolvedPlacement,
    top: coords.y + window.scrollY - margins.top,
    left: coords.x + window.scrollX - margins.left,
    shift,
  };
};

export const isSamePosition = (a: Calculated | undefined, b: Calculated) =>
  a?.placement === b.placement && a.top === b.top && a.left === b.left;

export const supportsCssAnchor = () =>
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("anchor-name: --a") &&
  CSS.supports("top: anchor(bottom)");

const parseTranslate = (translate: string): Point => {
  const [x = 0, y = 0] = translate.split(" ").map(value => parseFloat(value) || 0);
  return { x, y };
};

/** Measures where CSS anchor positioning places the overlay and returns the translate that moves it to the target position */
export const getCssAnchorTranslate = (overlay: HTMLElement, target: Calculated): Point => {
  const margins = getMargins(overlay);
  const applied = parseTranslate(overlay.style.translate);
  const rect = overlay.getBoundingClientRect();
  return {
    x: target.left - window.scrollX + margins.left - (rect.left - applied.x),
    y: target.top - window.scrollY + margins.top - (rect.top - applied.y),
  };
};

/**
 * Keeps the overlay at the given placement with CSS anchor positioning. The browser moves it together with the anchor
 * in the same frame as a scroll, which JS cannot do since the scroll events arrive a frame after the scroll is painted.
 * The translate corrects it to the position calculated on open, e.g. the shift into the viewport.
 */
export const getCssAnchorStyle = (placement: OverlayPosition, anchorName: string, translate: Point): CSSProperties => {
  const side = getSide(placement);
  const edge = getAlignment(placement).toLowerCase() as "" | "left" | "right";
  const vertical = side === "top" || side === "bottom";

  return {
    positionAnchor: anchorName,
    // hides it while the anchor is completely clipped by a scroll container, so it does not float over unrelated content
    positionVisibility: "anchors-visible",
    top: "auto",
    left: "auto",
    translate: `${translate.x}px ${translate.y}px`,
    // the inset on the opposite side touches the anchor, e.g. bottom: anchor(top) for the top placements
    [OPPOSITE_SIDE[side]]: `anchor(${side})`,
    // the aligned edge is pinned to the same edge of the anchor, otherwise it is centered on the cross axis
    ...(!vertical ? { alignSelf: "anchor-center" } : edge ? { [edge]: `anchor(${edge})` } : { justifySelf: "anchor-center" }),
  };
};
