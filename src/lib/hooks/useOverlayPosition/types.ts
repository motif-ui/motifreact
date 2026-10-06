import type { CSSProperties } from "react";

export type OverlayPosition = "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" | "right" | "left";
export type OverlayPositionProps = {
  placement: OverlayPosition;
  /** Position is calculated only while enabled, typically while the overlay is attached */
  enabled: boolean;
  /** Limits the overlay's width to the space at its placement, so long content wraps instead of overflowing the screen */
  limitWidth?: boolean;
};

export type OverlayPositionReturn = {
  style: CSSProperties;
  /** The placement chosen on open, e.g. the opposite side when the given one does not fit */
  placement: OverlayPosition;
};

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Box = { top: number; right: number; bottom: number; left: number };
/** A placement tried for the overlay, with its viewport coordinates and how much it overflows the viewport */
export type PlacementCandidate = { candidate: OverlayPosition; coords: Point; overflow: number; size: Size; maxWidth?: number };
/**
 * Position of the overlay's margin box in document coordinates, with the placement it is calculated for.
 * The shift applied to fit it into the viewport and the max width (with limitWidth) are kept while the overlay follows the anchor.
 */
export type Calculated = { placement: OverlayPosition; top: number; left: number; shift: Point; maxWidth?: number };
