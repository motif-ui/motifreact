import { OverlayPlaceOn } from "../../../types.ts";
import { Position } from "../types.ts";
import { getAlignment, getSide, OPPOSITE_SIDE } from "./placement.ts";

/* ************
  CSS anchor positioning, used where the browser supports it. The browser moves the overlay together with the anchor
  in the same frame as a scroll, which JS cannot do since the scroll events arrive a frame after the scroll is painted.
  ************ */

export const supportsCssAnchor = () =>
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("anchor-name: --a") &&
  CSS.supports("top: anchor(bottom)");

export const INSETS = ["top", "right", "bottom", "left"] as const;

/** The insets and the self alignment that keep the overlay at the placement next to the anchor, as CSS properties */
export const getCssAnchorInsets = (placement: OverlayPlaceOn): Record<string, string> => {
  const side = getSide(placement);
  const edge = getAlignment(placement).toLowerCase() as "" | "left" | "right";
  const vertical = side === "top" || side === "bottom";

  return {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
    // the inset on the opposite side touches the anchor, e.g. bottom: anchor(top) for the top placements
    [OPPOSITE_SIDE[side]]: `anchor(${side})`,
    // the aligned edge is pinned to the same edge of the anchor, otherwise it is centered on the cross axis
    ...(edge && { [edge]: `anchor(${edge})` }),
    "justify-self": vertical && !edge ? "anchor-center" : "",
    "align-self": vertical ? "" : "anchor-center",
  };
};

/**
 * Keeps the overlay at the placement with CSS anchor positioning, written to the overlay element.
 * The translate moves it to the calculated position, e.g. shifted into the viewport. It is measured once here,
 * so whatever CSS places differently from the calculation, e.g. a margin on the aligned edge, is corrected.
 */
export const placeWithCssAnchor = (overlay: HTMLElement, anchorName: string, position: Position) => {
  const { style } = overlay;
  style.setProperty("position-anchor", anchorName);
  // hides it while the anchor is completely clipped by a scroll container, so it does not float over unrelated content
  style.setProperty("position-visibility", "anchors-visible");
  Object.entries(getCssAnchorInsets(position.placement)).forEach(([property, value]) => style.setProperty(property, value));
  style.translate = "";

  const rect = overlay.getBoundingClientRect();
  style.translate = `${position.x - rect.left}px ${position.y - rect.top}px`;
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
