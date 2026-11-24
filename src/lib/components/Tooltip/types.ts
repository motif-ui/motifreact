import { OverlayPlaceOn, Size4SM } from "../../types";

export type TooltipProps = {
  title?: string;
  text: string;
} & TooltipDefaultableProps;

export type TooltipDefaultableProps = {
  size?: Size4SM;
  /**
   * The tooltip is dark in both modes by default; inverseColors puts it on the page's sunken surface (light gray on a
   * light page, near black on a dark one).
   */
  inverseColors?: boolean;
  position?: OverlayPlaceOn;
};
