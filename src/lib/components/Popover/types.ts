import { RefObject } from "react";
import { OverlayCloseReason } from "../../types";

export type PopoverProps = {
  /**
   *
   * Ref of the element that the popover will be attached to.
   *
   */
  anchorRef: RefObject<HTMLElement | null>;
  /**
   *
   * Controls the visibility. When it is not given, the popover is uncontrolled and is toggled by clicking the anchor.
   *
   */
  open?: boolean;
  /**
   *
   * Initial visibility when the popover is uncontrolled.
   *
   */
  defaultOpen?: boolean;
  /**
   *
   * Called once when the popover closes, with the reason. When it is controlled, it is also called when a close is requested
   * by an outside click, Escape or scroll; the popover stays open until the open prop becomes false.
   *
   */
  onClose?: (reason: OverlayCloseReason) => void;
  /**
   *
   * Closes the popover when clicked outside of it and its anchor. Defaults to true when uncontrolled, false when controlled.
   *
   */
  closeOnOutsideClick?: boolean;
  /**
   *
   * Closes the popover when Escape is pressed. Defaults to true when uncontrolled, false when controlled.
   *
   */
  closeOnEscape?: boolean;
  /**
   *
   * Closes the popover when the page or a container of the anchor is scrolled.
   *
   */
  closeOnScroll?: boolean;
  /**
   *
   * Keeps the popover in the screen while scrolling, instead of moving together with the anchor.
   *
   */
  keepInView?: boolean;
} & PopoverDefaultableProps;

export type PopoverDefaultableProps = {
  elevated?: boolean;
  placeOn?: "top" | "bottom" | "right" | "left" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  variant?: "light" | "primary" | "dark";
  spacing?: "withGap" | "callout" | "noSpace";
};
