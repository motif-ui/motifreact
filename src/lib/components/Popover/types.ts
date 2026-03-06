import { RefObject } from "react";

export type PopoverProps = {
  /**
   *
   * Ref of the element that the popover will be attached to.
   *
   */
  anchorRef: RefObject<HTMLElement | null>;
  open?: boolean;
  onClose?: () => void;
} & PopoverDefaultableProps;

export type PopoverDefaultableProps = {
  elevated?: boolean;
  placeOn?: "top" | "bottom" | "right" | "left" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  variant?: "light" | "primary" | "dark";
  spacing?: "withGap" | "callout" | "noSpace";
};
