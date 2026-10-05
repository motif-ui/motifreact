export type OverlayPosition = "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" | "right" | "left";
export type OverlayPositionOptions = {
  placement: OverlayPosition;
  /** Position is calculated only while enabled, typically while the overlay is attached */
  enabled: boolean;
  /**
   * When false, the overlay moves together with the anchor on scroll and resize, even out of the screen.
   * When true, it is kept in the viewport by flipping to the opposite side or sticking to the edges.
   */
  keepInView?: boolean;
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
/**
 * How a new position is applied:
 * - render: a regular state update, used on open
 * - syncRender: a state update rendered before the browser paints, used when the placement or the shift may change
 * - dom: written to the overlay element directly, used while following the anchor, so the overlay and its content are not rendered
 */
export type ApplyMode = "render" | "syncRender" | "dom";
