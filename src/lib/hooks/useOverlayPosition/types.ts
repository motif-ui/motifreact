import type { CSSProperties } from "react";
import { OverlayPlaceOn } from "../../types";

export type OverlayPositionProps = {
  placement: OverlayPlaceOn;
  /** Position is calculated only while enabled, typically while the overlay is attached */
  enabled: boolean;
  /**
   * Limits the overlay's width to the space at its placement, so long content wraps instead of overflowing the screen.
   * A max width in px given by the overlay's stylesheet, e.g. of a tooltip, is kept when it is narrower.
   */
  limitWidth?: boolean;
  /** Makes the overlay as wide as its anchor, e.g. a list under a select, also when the anchor resizes */
  matchAnchorWidth?: boolean;
};

export type OverlayPositionReturn = {
  /** Hides the overlay until it is positioned. The position itself is written to the overlay element. */
  style: CSSProperties;
  /** The placement chosen on open, e.g. the opposite side when the given one does not fit */
  placement: OverlayPlaceOn;
};

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Box = { top: number; right: number; bottom: number; left: number };

/**
 * The overlay's position, calculated on open and kept while it is open.
 * - x, y: viewport coordinates of its border box when it is calculated
 * - shift: how far it is moved from its placement to fit into the viewport
 * - margins: the overlay's CSS margins. The one facing the anchor is the gap, the others keep it away from the viewport's edges.
 * - fixed: whether it is fixed on the screen like its anchor, e.g. in a modal, otherwise it is positioned in the document
 * The size and the margins are kept, so the overlay is not measured again while it follows the anchor.
 */
export type Position = {
  placement: OverlayPlaceOn;
  fixed: boolean;
  x: number;
  y: number;
  shift: Point;
  size: Size;
  margins: Box;
  maxWidth?: number;
};
