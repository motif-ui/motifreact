import { RefObject } from "react";
import { OverlayCloseReason, OverlayPlaceOn } from "../../types";

export type PopoverProps = {
  /**
   * Ref of the element that the popover will be attached to.
   */
  anchorRef: RefObject<HTMLElement | null>;
  /**
   * Controls the visibility. When it is not given, the popover is uncontrolled and is toggled by clicking the anchor.
   */
  open?: boolean;
  /**
   * Initial visibility when the popover is uncontrolled.
   */
  defaultOpen?: boolean;
  /**
   * Called when the popover closes, with the reason. When controlled, it is called for each close request,
   * and the popover stays open until the open prop becomes false.
   */
  onClose?: (reason?: OverlayCloseReason) => void;
  /**
   * Closes the popover when clicked outside of it and its anchor.
   */
  closeOnOutsideClick?: boolean;
  /**
   * Closes the popover when Escape is pressed.
   */
  closeOnEscape?: boolean;
  /**
   *
   * Closes the popover when the page or a container of the anchor is scrolled.
   *
   */
  closeOnScroll?: boolean;
} & PopoverDefaultableProps;

export type PopoverDefaultableProps = {
  elevated?: boolean;
  placeOn?: OverlayPlaceOn;
  variant?: "light" | "primary" | "dark";
  spacing?: "withGap" | "callout" | "noSpace";
};
