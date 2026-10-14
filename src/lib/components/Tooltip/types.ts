import { OverlayPlaceOn, Size4SM } from "../../types";

export type TooltipProps = {
  title?: string;
  text: string;
} & TooltipDefaultableProps;

export type TooltipDefaultableProps = {
  size?: Size4SM;
  variant?: "light" | "dark";
  position?: OverlayPlaceOn;
};
