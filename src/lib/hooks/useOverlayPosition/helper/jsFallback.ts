import { Position } from "../types.ts";

/* ************
  JS positioning, the fallback for the browsers without CSS anchor positioning. The overlay follows the anchor on the scroll
  events, which arrive a frame after the scroll is painted, so it lags a frame behind the anchor in a scrolling container.
  The overlay is expected to be positioned in the document, e.g. rendered in a body that is not positioned.
  ************ */

/** Writes the position to the overlay element. Its margin box is positioned in document coordinates, or on the screen when it is fixed. */
export const placeWithJs = (overlay: HTMLElement, { x, y, margins, fixed }: Position) => {
  overlay.style.top = `${y + (fixed ? 0 : window.scrollY) - margins.top}px`;
  overlay.style.left = `${x + (fixed ? 0 : window.scrollX) - margins.left}px`;
};

/** The ancestors that move the element when they are scrolled. The page's own scroll is not included. */
export const getScrollAncestors = (element: Element | null): Element[] => {
  if (!element || element === document.body || element === document.documentElement) return [];
  const { overflow, overflowX, overflowY } = getComputedStyle(element);
  const scrolls = /auto|scroll|overlay|hidden/.test(overflow + overflowX + overflowY);
  return [...(scrolls ? [element] : []), ...getScrollAncestors(element.parentElement)];
};
