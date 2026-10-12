import type { CSSProperties } from "react";
import { OverlayPlaceOn } from "../../types";
import { Box, Calculated, PlacementCandidate, Point, PositionMode, Size } from "./types";
import { clamp } from "src/utils/utils";

const OPPOSITE_SIDE = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

const getSide = (placement: OverlayPlaceOn) =>
  placement.startsWith("top") ? "top" : placement.startsWith("bottom") ? "bottom" : (placement as "left" | "right");

/** The edge the overlay is aligned to on the cross axis, empty when it is centered */
const getAlignment = (placement: OverlayPlaceOn) => placement.slice(getSide(placement).length) as "" | "Left" | "Right";

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
const getCandidates = (placement: OverlayPlaceOn): OverlayPlaceOn[] => {
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

/**
 * Viewport coordinates of the overlay's border box for the given placement.
 * The overlay's margin on the side facing the anchor is used as the gap between them.
 */
const getCoords = (placement: OverlayPlaceOn, anchor: DOMRect, { width, height }: Size, margins: Box): Point => {
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

/** The x of the overlay's border box that keeps its margin box in the viewport horizontally, or at its left edge when it is wider */
const clampIntoViewportX = (x: number, width: number, viewport: Box, margins: Box) => {
  const left = viewport.left + margins.left;
  return clamp(x, left, Math.max(left, viewport.right - margins.right - width));
};

// Overflows below a pixel come from subpixel positions of an overlay touching an edge, so they do not count
const fits = (overflow: number) => overflow < 1;

/** The candidate with the lowest score, the earlier one on equal scores since the candidates are in the order of preference */
const pickBest = (candidates: PlacementCandidate[], score: (candidate: PlacementCandidate) => number) =>
  candidates.reduce((best, candidate) => (score(candidate) < score(best) ? candidate : best));

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
const fitIntoViewport = (placement: OverlayPlaceOn, anchorRect: DOMRect, overlay: HTMLElement, margins: Box, limitWidth: boolean) => {
  const viewport = getViewport();
  // The margin box is fitted, so the margins that do not face the anchor keep the overlay away from the viewport's edges
  const outer = ({ coords, size }: Pick<PlacementCandidate, "coords" | "size">) => ({
    coords: { x: coords.x - margins.left, y: coords.y - margins.top },
    size: { width: size.width + margins.left + margins.right, height: size.height + margins.top + margins.bottom },
  });
  const overflowX = (candidate: Pick<PlacementCandidate, "coords" | "size">, box: Box) => {
    const { coords, size } = outer(candidate);
    return getOverflowX(coords, size, box);
  };
  const overflowY = (candidate: Pick<PlacementCandidate, "coords" | "size">, box: Box) => {
    const { coords, size } = outer(candidate);
    return getOverflowY(coords, size, box);
  };

  const minWidth = limitWidth ? measureMinWidth(overlay) : 0;
  // Each measurement makes the browser lay out the page, so candidates with the same width limit share one,
  // e.g. bottomLeft and topLeft, or all of them when the limit is the content's minimum width
  const sizes = new Map<number | undefined, Size>();
  const measureWith = (maxWidth?: number) => {
    const size = sizes.get(maxWidth) ?? measure(overlay, maxWidth);
    sizes.set(maxWidth, size);
    return size;
  };
  const candidates = getCandidates(placement).map<PlacementCandidate>(candidate => {
    const maxWidth = limitWidth ? Math.max(getMaxWidth(candidate, anchorRect, viewport, margins), minWidth) : undefined;
    const size = measureWith(maxWidth);
    const coords = getCoords(candidate, anchorRect, size, margins);
    return { candidate, coords, size, maxWidth, overflow: overflowX({ coords, size }, viewport) + overflowY({ coords, size }, viewport) };
  });

  const fitsOnItsSide = (candidate: PlacementCandidate) => {
    const vertical = ["top", "bottom"].includes(getSide(candidate.candidate));
    const { size } = outer(candidate);
    return vertical
      ? fits(overflowY(candidate, viewport)) && size.width <= viewport.right - viewport.left + 1
      : fits(overflowX(candidate, viewport)) && size.height <= viewport.bottom - viewport.top + 1;
  };
  /**
   * How far the candidate overflows horizontally. One wider than the viewport is placed at the viewport's left edge
   * whatever its alignment, so only its unavoidable overflow counts, and the order of preference decides between them.
   */
  const unavoidableOverflowX = (candidate: PlacementCandidate) => {
    const { width } = outer(candidate).size;
    const viewportWidth = viewport.right - viewport.left;
    return width > viewportWidth ? width - viewportWidth : overflowX(candidate, viewport);
  };
  const inViewport = candidates.find(({ overflow }) => fits(overflow)) ?? candidates.find(fitsOnItsSide);
  const page = inViewport ? undefined : getDocumentBox(overlay);
  const inPage = page && candidates.filter(candidate => fits(overflowY(candidate, page)));
  const best =
    inViewport ??
    (inPage?.length
      ? pickBest(inPage, unavoidableOverflowX)
      : pickBest(candidates, candidate => unavoidableOverflowX(candidate) + overflowY(candidate, viewport)));
  const keepInViewportVertically = !inViewport && !inPage?.length;

  // The last measured candidate may not be the chosen one, so the chosen max width is applied again. Its size is known already.
  if (limitWidth) overlay.style.maxWidth = `${best.maxWidth}px`;

  const { size } = best;
  const top = viewport.top + margins.top;
  const coords = {
    x: clampIntoViewportX(best.coords.x, size.width, viewport, margins),
    y: keepInViewportVertically ? clamp(best.coords.y, top, Math.max(top, viewport.bottom - margins.bottom - size.height)) : best.coords.y,
  };
  return {
    placement: best.candidate,
    coords,
    size,
    maxWidth: best.maxWidth,
    shift: { x: coords.x - best.coords.x, y: coords.y - best.coords.y },
  };
};

/** Calculates the overlay's position next to the anchor, see PositionMode for what is kept from the previous one */
export const calculatePosition = (
  anchor: HTMLElement,
  overlay: HTMLElement,
  placement: OverlayPlaceOn,
  mode: PositionMode,
  limitWidth: boolean,
  previous?: Calculated,
): Calculated => {
  const anchorRect = anchor.getBoundingClientRect();
  // While following, the overlay keeps its size and margins, which are measured again when it is resized or fitted
  const following = mode === "follow" && previous;
  const margins = following ? previous.margins : getMargins(overlay);
  const fitted = mode === "fit" || !previous ? fitIntoViewport(placement, anchorRect, overlay, margins, limitWidth) : undefined;
  const resolvedPlacement = fitted?.placement ?? previous?.placement ?? placement;
  const viewport = getViewport();
  // A resized overlay is limited again, since its content may need more or less room than on open
  const refitMaxWidth =
    !fitted && mode === "refit" && limitWidth
      ? Math.max(getMaxWidth(resolvedPlacement, anchorRect, viewport, margins), measureMinWidth(overlay))
      : undefined;
  const size = fitted?.size ?? (following ? previous.size : measure(overlay, refitMaxWidth));
  const maxWidth = fitted ? fitted.maxWidth : (refitMaxWidth ?? previous?.maxWidth);
  const anchoredCoords = getCoords(resolvedPlacement, anchorRect, size, margins);
  const previousShift = previous?.shift ?? { x: 0, y: 0 };
  const shift =
    fitted?.shift ??
    (mode === "refit"
      ? { x: clampIntoViewportX(anchoredCoords.x, size.width, viewport, margins) - anchoredCoords.x, y: previousShift.y }
      : previousShift);
  const coords = fitted?.coords ?? { x: anchoredCoords.x + shift.x, y: anchoredCoords.y + shift.y };

  // The overlay is absolutely positioned in the document, so the margin box is positioned with document coordinates
  return {
    placement: resolvedPlacement,
    top: coords.y + window.scrollY - margins.top,
    left: coords.x + window.scrollX - margins.left,
    shift,
    maxWidth,
    size,
    margins,
  };
};

export const isSamePosition = (a: Calculated | undefined, b: Calculated) =>
  a?.placement === b.placement && a.top === b.top && a.left === b.left && a.maxWidth === b.maxWidth;

/**
 * Writes where the anchor's edges are relative to the overlay's border box as CSS variables, e.g. for a caret pointing
 * to the anchor: --overlay-anchor-left, --overlay-anchor-right, --overlay-anchor-top and --overlay-anchor-bottom.
 */
export const setAnchorOffsets = (anchor: HTMLElement, overlay: HTMLElement) => {
  const anchorRect = anchor.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  overlay.style.setProperty("--overlay-anchor-left", `${anchorRect.left - overlayRect.left}px`);
  overlay.style.setProperty("--overlay-anchor-right", `${anchorRect.right - overlayRect.left}px`);
  overlay.style.setProperty("--overlay-anchor-top", `${anchorRect.top - overlayRect.top}px`);
  overlay.style.setProperty("--overlay-anchor-bottom", `${anchorRect.bottom - overlayRect.top}px`);
};

/** The anchor names of the element, given by the page, by other overlays on the same anchor or by this one */
const getAnchorNames = (anchor: HTMLElement) => {
  const value = getComputedStyle(anchor).getPropertyValue("anchor-name").trim();
  return value && value !== "none" ? value.split(",").map(name => name.trim()) : [];
};

/** Adds the overlay's name to the anchor, keeping the names given by the page or by other overlays on the same anchor */
export const addAnchorName = (anchor: HTMLElement, name: string) => {
  const names = getAnchorNames(anchor);
  if (!names.includes(name)) anchor.style.setProperty("anchor-name", [...names, name].join(", "));
};

/** Removes the overlay's name from the anchor. The inline value is removed when only the names of the stylesheet remain. */
export const removeAnchorName = (anchor: HTMLElement, name: string) => {
  const remaining = getAnchorNames(anchor).filter(other => other !== name);
  anchor.style.removeProperty("anchor-name");
  const fromStylesheet = getAnchorNames(anchor);
  if (remaining.some(other => !fromStylesheet.includes(other))) anchor.style.setProperty("anchor-name", remaining.join(", "));
};

/** The ancestors that move the element when they are scrolled. The page's own scroll is not included. */
export const getScrollAncestors = (element: Element | null): Element[] => {
  if (!element || element === document.body || element === document.documentElement) return [];
  const { overflow, overflowX, overflowY } = getComputedStyle(element);
  const scrolls = /auto|scroll|overlay|hidden/.test(overflow + overflowX + overflowY);
  return [...(scrolls ? [element] : []), ...getScrollAncestors(element.parentElement)];
};

/**
 * Where the overlay's containing block starts in document coordinates, e.g. a positioned body with a margin.
 * Measured from where the overlay is placed when its position is written with the given origin.
 */
export const getContainingBlockOrigin = (overlay: HTMLElement, target: Calculated, origin: Point): Point => {
  const rect = overlay.getBoundingClientRect();
  // An overlay without a box, e.g. an empty one or in an environment without layout, gives no position to measure
  if (!rect.width && !rect.height) return origin;
  return {
    x: origin.x + rect.left - (target.left + target.margins.left - window.scrollX),
    y: origin.y + rect.top - (target.top + target.margins.top - window.scrollY),
  };
};

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
export const getCssAnchorStyle = (placement: OverlayPlaceOn, anchorName: string, translate: Point): CSSProperties => {
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
