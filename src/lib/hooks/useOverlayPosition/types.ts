import type { CSSProperties } from "react";
import { OverlayPlaceOn } from "../../types";

export type OverlayPositionProps = {
  placement: OverlayPlaceOn;
  /** Position is calculated only while enabled, typically while the overlay is attached */
  enabled: boolean;
  /** Limits the overlay's width to the space at its placement, so long content wraps instead of overflowing the screen */
  limitWidth?: boolean;
};

export type OverlayPositionReturn = {
  style: CSSProperties;
  /** The placement chosen on open, e.g. the opposite side when the given one does not fit */
  placement: OverlayPlaceOn;
};

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Box = { top: number; right: number; bottom: number; left: number };
/** A placement tried for the overlay, with its viewport coordinates and how much it overflows the viewport */
export type PlacementCandidate = { candidate: OverlayPlaceOn; coords: Point; overflow: number; size: Size; maxWidth?: number };
/**
 * The overlay's position: its margin box in document coordinates, as if it were positioned in the document itself,
 * with the placement it is calculated for. The shift applied to fit it into the viewport, the max width (with limitWidth),
 * the size and the margins are kept while the overlay follows the anchor, so the overlay is not measured on each scroll.
 */
export type Calculated = {
  placement: OverlayPlaceOn;
  top: number;
  left: number;
  shift: Point;
  maxWidth?: number;
  size: Size;
  margins: Box;
};

/**
 * fit: chooses the placement and the shift to fit into the viewport, e.g. on open
 * follow: keeps them, so the overlay moves with the anchor, e.g. on scroll
 * refit: keeps the placement and shifts it horizontally into the viewport again, e.g. when its content grows
 */
export type PositionMode = "fit" | "follow" | "refit";
