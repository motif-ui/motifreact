import { OverlayPlaceOn } from "../../../types.ts";
import { Box, Point, Position, Size } from "../types.ts";
import { clamp } from "src/utils/utils.ts";

/* ************
  Chooses where the overlay is placed next to its anchor. Shared by the CSS anchor positioning and the JS fallback.
  ************ */

type Candidate = { placement: OverlayPlaceOn; coords: Point; size: Size; maxWidth?: number };

export const OPPOSITE_SIDE = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

export const getSide = (placement: OverlayPlaceOn) =>
  placement.startsWith("top") ? "top" : placement.startsWith("bottom") ? "bottom" : (placement as "left" | "right");

/** The edge the overlay is aligned to on the cross axis, empty when it is centered */
export const getAlignment = (placement: OverlayPlaceOn) => placement.slice(getSide(placement).length) as "" | "Left" | "Right";

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
export const getCandidates = (placement: OverlayPlaceOn): OverlayPlaceOn[] => {
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  if (!alignment) return [placement, OPPOSITE_SIDE[side]];

  const otherAlignment = alignment === "Left" ? "Right" : "Left";
  return [
    placement,
    `${side}${otherAlignment}`,
    `${OPPOSITE_SIDE[side]}${alignment}`,
    `${OPPOSITE_SIDE[side]}${otherAlignment}`,
  ] as OverlayPlaceOn[];
};

/** Viewport coordinates of the overlay's border box at the placement. The margin facing the anchor is the gap between them. */
export const getCoords = (placement: OverlayPlaceOn, anchor: DOMRect, { width, height }: Size, margins: Box): Point => {
  const side = getSide(placement);
  const alignment = getAlignment(placement);

  if (side === "left" || side === "right") {
    return {
      x: side === "left" ? anchor.left - margins.right - width : anchor.right + margins.left,
      y: anchor.top + anchor.height / 2 - height / 2,
    };
  }
  return {
    x: alignment === "Left" ? anchor.left : alignment === "Right" ? anchor.right - width : anchor.left + anchor.width / 2 - width / 2,
    y: side === "top" ? anchor.top - margins.bottom - height : anchor.bottom + margins.top,
  };
};

/** The widest the overlay's border box can be at the placement without its margin box overflowing the viewport horizontally */
const getMaxWidth = (placement: OverlayPlaceOn, anchor: DOMRect, viewport: Box, margins: Box) => {
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const space =
    side === "left"
      ? anchor.left - margins.right - margins.left - viewport.left
      : side === "right"
        ? viewport.right - anchor.right - margins.left - margins.right
        : alignment === "Left"
          ? viewport.right - margins.right - anchor.left
          : alignment === "Right"
            ? anchor.right - margins.left - viewport.left
            : viewport.right - viewport.left - margins.left - margins.right;
  return Math.max(0, space);
};

/**
 * Measures the overlay, after limiting its width when a max width is given.
 * Content that cannot shrink, e.g. a fixed width form, may overflow the limited box, so its scroll size is taken into account.
 */
const measure = (overlay: HTMLElement, maxWidth?: number): Size => {
  if (maxWidth !== undefined) overlay.style.maxWidth = `${maxWidth}px`;
  return { width: Math.max(overlay.offsetWidth, overlay.scrollWidth), height: Math.max(overlay.offsetHeight, overlay.scrollHeight) };
};

/**
 * The narrowest the overlay's content can get, e.g. its longest word or a fixed width form.
 * Measured with a zero max width, where the content overflows the overlay at its minimum width.
 * A narrower limit would make the content overflow instead of wrapping it.
 */
const measureMinWidth = (overlay: HTMLElement) => {
  overlay.style.maxWidth = "0px";
  return overlay.scrollWidth;
};

/** The x of the overlay's border box that keeps its margin box in the viewport horizontally, or at its left edge when it is wider */
const clampIntoViewportX = (x: number, width: number, viewport: Box, margins: Box) => {
  const left = viewport.left + margins.left;
  return clamp(x, left, Math.max(left, viewport.right - margins.right - width));
};

/** How far the margin box overflows the viewport on each axis */
const getOverflow = ({ coords, size }: Candidate, viewport: Box, margins: Box) => {
  const left = coords.x - margins.left;
  const top = coords.y - margins.top;
  const right = coords.x + size.width + margins.right;
  const bottom = coords.y + size.height + margins.bottom;
  return {
    x: Math.max(0, viewport.left - left) + Math.max(0, right - viewport.right),
    y: Math.max(0, viewport.top - top) + Math.max(0, bottom - viewport.bottom),
    width: right - left,
    height: bottom - top,
  };
};

// Overflows below a pixel come from subpixel positions of an overlay touching an edge, so they do not count
const fits = (overflow: number) => overflow < 1;

/**
 * Picks the placement for the overlay, in this order:
 * 1. the first candidate that fits into the viewport as it is, e.g. bottomLeft or bottomRight near the right edge
 * 2. the first one that fits into the viewport on its side and can be shifted into it along the anchor, e.g. a wide top popover
 *    or a tall right tooltip near the bottom edge
 * 3. otherwise the one that overflows the viewport the least, kept in the viewport even if it covers the anchor
 * It is always shifted along the anchor into the viewport: horizontally for the top and bottom placements, vertically for
 * the left and right ones. Only the last step shifts it across the anchor too, covering it.
 * With limitWidth, each candidate is measured with its width limited to the space at that placement, so long content wraps
 * and the candidate is judged by its wrapped size. The limit never goes below the content's minimum width.
 */
const choosePlacement = (placement: OverlayPlaceOn, anchor: DOMRect, overlay: HTMLElement, margins: Box, limitWidth: boolean) => {
  const viewport = getViewport();
  const viewportWidth = viewport.right - viewport.left;
  const viewportHeight = viewport.bottom - viewport.top;
  const minWidth = limitWidth ? measureMinWidth(overlay) : 0;
  // Each measurement makes the browser lay out the page, so candidates with the same width limit share one
  const sizes = new Map<number | undefined, Size>();
  const measureWith = (maxWidth?: number) => {
    const size = sizes.get(maxWidth) ?? measure(overlay, maxWidth);
    sizes.set(maxWidth, size);
    return size;
  };

  const candidates = getCandidates(placement).map(candidate => {
    const maxWidth = limitWidth ? Math.max(getMaxWidth(candidate, anchor, viewport, margins), minWidth) : undefined;
    const size = measureWith(maxWidth);
    const result: Candidate = { placement: candidate, coords: getCoords(candidate, anchor, size, margins), size, maxWidth };
    return { ...result, overflow: getOverflow(result, viewport, margins) };
  });

  const fitsOnItsSide = ({ placement: candidate, overflow }: (typeof candidates)[number]) =>
    ["top", "bottom"].includes(getSide(candidate))
      ? fits(overflow.y) && overflow.width <= viewportWidth + 1
      : fits(overflow.x) && overflow.height <= viewportHeight + 1;
  // One wider than the viewport is placed at its left edge whatever its alignment, so only its unavoidable overflow counts
  const score = ({ overflow }: (typeof candidates)[number]) =>
    (overflow.width > viewportWidth ? overflow.width - viewportWidth : overflow.x) + overflow.y;

  const inViewport = candidates.find(({ overflow }) => fits(overflow.x + overflow.y)) ?? candidates.find(fitsOnItsSide);
  // The earlier candidate wins on equal scores, since the candidates are in the order of preference
  const best = inViewport ?? candidates.reduce((best, candidate) => (score(candidate) < score(best) ? candidate : best));

  // The last measured candidate may not be the chosen one, so the chosen max width is applied again. Its size is known already.
  if (limitWidth) overlay.style.maxWidth = `${best.maxWidth}px`;

  const top = viewport.top + margins.top;
  const x = clampIntoViewportX(best.coords.x, best.size.width, viewport, margins);
  const alongAnchorIsVertical = ["left", "right"].includes(getSide(best.placement));
  const y =
    inViewport && !alongAnchorIsVertical
      ? best.coords.y
      : clamp(best.coords.y, top, Math.max(top, viewport.bottom - margins.bottom - best.size.height));
  return { ...best, x, y, shift: { x: x - best.coords.x, y: y - best.coords.y } };
};

/**
 * Whether the element is fixed on the screen, e.g. in a modal or a fixed header. A page scroll does not move it,
 * so an overlay on it is fixed too, otherwise the overlay would scroll with the page and leave its anchor.
 */
export const isFixed = (element: HTMLElement | null): boolean =>
  !!element && (getComputedStyle(element).position === "fixed" || isFixed(element.parentElement));

/**
 * Calculates the overlay's position next to the anchor by measuring the overlay.
 * Without a previous position, the placement is chosen, e.g. on open. With one, its placement is kept and the overlay is
 * shifted horizontally into the viewport again, e.g. when its content resizes it.
 */
export const calculatePosition = (
  anchor: HTMLElement,
  overlay: HTMLElement,
  placement: OverlayPlaceOn,
  limitWidth: boolean,
  fixed: boolean,
  keep?: Position,
): Position => {
  const anchorRect = anchor.getBoundingClientRect();
  const margins = getMargins(overlay);
  if (!keep) {
    const { placement: chosen, x, y, shift, size, maxWidth } = choosePlacement(placement, anchorRect, overlay, margins, limitWidth);
    return { placement: chosen, fixed, x, y, shift, size, margins, maxWidth };
  }

  const viewport = getViewport();
  const maxWidth = limitWidth ? Math.max(getMaxWidth(keep.placement, anchorRect, viewport, margins), measureMinWidth(overlay)) : undefined;
  const size = measure(overlay, maxWidth);
  const coords = getCoords(keep.placement, anchorRect, size, margins);
  const x = clampIntoViewportX(coords.x, size.width, viewport, margins);
  const shift = { x: x - coords.x, y: keep.shift.y };
  return { placement: keep.placement, fixed, x, y: coords.y + shift.y, shift, size, margins, maxWidth };
};

/** Moves the position together with the anchor, keeping the overlay's size and the shift applied on open, without measuring it */
export const followAnchor = (anchor: HTMLElement, position: Position): Position => {
  const coords = getCoords(position.placement, anchor.getBoundingClientRect(), position.size, position.margins);
  return { ...position, x: coords.x + position.shift.x, y: coords.y + position.shift.y };
};

/**
 * Whether the overlay's size or margins differ from the ones it is positioned with, e.g. its content grew or the class of
 * the chosen placement changed its margins. ResizeObserver also notifies when it starts observing, and that notification
 * may arrive after the anchor has moved, e.g. by a scroll, so it is told apart this way.
 */
export const needsRefit = (overlay: HTMLElement, position?: Position) => {
  if (!position) return true;
  const differs = (a: number, b: number) => Math.abs(a - b) >= 0.5;
  const margins = getMargins(overlay);
  return (
    differs(Math.max(overlay.offsetWidth, overlay.scrollWidth), position.size.width) ||
    differs(Math.max(overlay.offsetHeight, overlay.scrollHeight), position.size.height) ||
    (["top", "right", "bottom", "left"] as const).some(side => differs(margins[side], position.margins[side]))
  );
};
