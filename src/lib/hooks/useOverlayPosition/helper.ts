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

const getOverflowX = ({ x }: Point, { width }: Size, box: Box) => Math.max(0, box.left - x) + Math.max(0, x + width - box.right);
const getOverflowY = ({ y }: Point, { height }: Size, box: Box) => Math.max(0, box.top - y) + Math.max(0, y + height - box.bottom);

/**
 * The scrollable area of the page in viewport coordinates. The overlay is taken out of the layout while measuring,
 * since it is absolutely positioned in the document and may otherwise extend the page by itself.
 */
const getDocumentBox = (overlay: HTMLElement): Box => {
  const { display } = overlay.style;
  overlay.style.display = "none";
  const { scrollWidth, scrollHeight } = document.documentElement;
  overlay.style.display = display;
  return { top: -window.scrollY, left: -window.scrollX, right: scrollWidth - window.scrollX, bottom: scrollHeight - window.scrollY };
};

// Overflows below a pixel come from subpixel positions of an overlay touching an edge, so they do not count
const fits = (overflow: number) => overflow < 1;

/** The candidate with the lowest score, the earlier one on equal scores since the candidates are in the order of preference */
const pickBest = (candidates: PlacementCandidate[], score: (candidate: PlacementCandidate) => number) =>
  candidates.reduce((best, candidate) => (score(candidate) < score(best) ? candidate : best));

/** The widest the overlay's border box can be at the placement without overflowing the viewport horizontally */
const getMaxWidth = (placement: OverlayPosition, anchor: DOMRect, viewport: Box, margins: Box) => {
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const space =
    side === "left"
      ? anchor.left - margins.right - viewport.left
      : side === "right"
        ? viewport.right - anchor.right - margins.left
        : alignment === "Left"
          ? viewport.right - anchor.left
          : alignment === "Right"
            ? anchor.right - viewport.left
            : viewport.right - viewport.left;
  return Math.max(0, space);
};

/**
 * The narrowest the overlay's content can get, e.g. its longest word or a fixed width form. Measured with a zero max width,
 * where the content overflows at its minimum width. A narrower limit would cut it off instead of wrapping it.
 * The direct children are measured too, since a wrapper with overflow: hidden (like the Popover's) shrinks to zero
 * and keeps its content's overflow inside, so the overlay itself does not see it.
 */
const measureMinWidth = (overlay: HTMLElement) => {
  overlay.style.maxWidth = "0px";
  const px = (value: string) => parseFloat(value) || 0;
  const style = getComputedStyle(overlay);
  const ownSpace = px(style.paddingLeft) + px(style.paddingRight) + px(style.borderLeftWidth) + px(style.borderRightWidth);
  const childWidths = Array.from(overlay.children, child => {
    const { marginLeft, marginRight } = getComputedStyle(child);
    const borders = (child as HTMLElement).offsetWidth - child.clientWidth;
    return child.scrollWidth + borders + px(marginLeft) + px(marginRight);
  });
  return Math.max(overlay.scrollWidth, ownSpace + Math.max(0, ...childWidths));
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
 * Picks the placement for the overlay, in this order, so the whole content can be seen:
 * 1. the first candidate that fits into the viewport as it is, e.g. bottomLeft or bottomRight near the right edge
 * 2. the first one that fits into the viewport on its side and can be shifted into it along the anchor, e.g. a wide top popover
 * 3. the first one that fits vertically into the page, so it opens next to the anchor and the page can be scrolled to it
 * 4. otherwise the one that overflows the viewport the least, kept in the viewport even if it covers the anchor
 * It is always shifted horizontally into the viewport, and vertically only in the last step.
 * With limitWidth, each candidate is measured with its width limited to the space at that placement, so long content wraps
 * and the candidate is judged by its wrapped size. The limit never goes below the content's minimum width, so content that
 * cannot wrap makes the candidate overflow and another one is chosen, instead of being cut off. Returns the shift and the max width too, so they are kept while following.
 */
const fitIntoViewport = (placement: OverlayPosition, anchorRect: DOMRect, overlay: HTMLElement, margins: Box, limitWidth: boolean) => {
  const viewport = getViewport();
  const minWidth = limitWidth ? measureMinWidth(overlay) : 0;
  const candidates = getCandidates(placement).map<PlacementCandidate>(candidate => {
    const maxWidth = limitWidth ? Math.max(getMaxWidth(candidate, anchorRect, viewport, margins), minWidth) : undefined;
    const size = measure(overlay, maxWidth);
    const coords = getCoords(candidate, anchorRect, size, margins);
    return { candidate, coords, size, maxWidth, overflow: getOverflowX(coords, size, viewport) + getOverflowY(coords, size, viewport) };
  });

  const fitsOnItsSide = ({ candidate, coords, size }: PlacementCandidate) => {
    const vertical = ["top", "bottom"].includes(getSide(candidate));
    return vertical
      ? fits(getOverflowY(coords, size, viewport)) && size.width <= viewport.right - viewport.left + 1
      : fits(getOverflowX(coords, size, viewport)) && size.height <= viewport.bottom - viewport.top + 1;
  };
  const inViewport = candidates.find(({ overflow }) => fits(overflow)) ?? candidates.find(fitsOnItsSide);
  const page = inViewport ? undefined : getDocumentBox(overlay);
  const inPage = page && candidates.filter(({ coords, size }) => fits(getOverflowY(coords, size, page)));
  const best =
    inViewport ??
    (inPage?.length ? pickBest(inPage, ({ coords, size }) => getOverflowX(coords, size, viewport)) : pickBest(candidates, c => c.overflow));
  const keepInViewportVertically = !inViewport && !inPage?.length;

  // The last measured candidate may not be the chosen one, so the chosen max width is applied again
  if (limitWidth) measure(overlay, best.maxWidth);

  const { size } = best;
  const coords = {
    x: clamp(best.coords.x, viewport.left, Math.max(viewport.left, viewport.right - size.width)),
    y: keepInViewportVertically ? clamp(best.coords.y, viewport.top, Math.max(viewport.top, viewport.bottom - size.height)) : best.coords.y,
  };
  return {
    placement: best.candidate,
    coords,
    size,
    maxWidth: best.maxWidth,
    shift: { x: coords.x - best.coords.x, y: coords.y - best.coords.y },
  };
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
  limitWidth: boolean,
  previous?: Calculated,
): Calculated => {
  const anchorRect = anchor.getBoundingClientRect();
  const margins = getMargins(overlay);
  const fitted = fitIntoView ? fitIntoViewport(placement, anchorRect, overlay, margins, limitWidth) : undefined;
  const size = fitted?.size ?? measure(overlay);
  const shift = fitted?.shift ?? previous?.shift ?? { x: 0, y: 0 };
  const maxWidth = fitted ? fitted.maxWidth : previous?.maxWidth;
  const resolvedPlacement = fitted?.placement ?? previous?.placement ?? placement;
  const anchoredCoords = getCoords(resolvedPlacement, anchorRect, size, margins);
  const coords = fitted?.coords ?? { x: anchoredCoords.x + shift.x, y: anchoredCoords.y + shift.y };

  // The overlay is absolutely positioned in the document, so the margin box is positioned with document coordinates
  return {
    placement: resolvedPlacement,
    top: coords.y + window.scrollY - margins.top,
    left: coords.x + window.scrollX - margins.left,
    shift,
    maxWidth,
  };
};

export const isSamePosition = (a: Calculated | undefined, b: Calculated) =>
  a?.placement === b.placement && a.top === b.top && a.left === b.left && a.maxWidth === b.maxWidth;

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
