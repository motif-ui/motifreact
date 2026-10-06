export type OverlayPosition = "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" | "right" | "left";
export type OverlayPositionProps = {
  placement: OverlayPosition;
  /** Position is calculated only while enabled, typically while the overlay is attached */
  enabled: boolean;
};

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Box = { top: number; right: number; bottom: number; left: number };
/** A placement tried for the overlay, with its viewport coordinates and how much it overflows the viewport */
export type PlacementCandidate = { candidate: OverlayPosition; coords: Point; overflow: number };
/**
 * Position of the overlay's margin box in document coordinates, with the placement it is calculated for
 * and the shift applied to fit it into the viewport, which is kept while the overlay follows the anchor
 */
export type Calculated = { placement: OverlayPosition; top: number; left: number; shift: Point };
