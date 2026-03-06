import { Size4SM } from "../../types";

export type Position = "top" | "bottom" | "right" | "left" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export type TooltipProps = {
  title?: string;
  text: string;
} & TooltipDefaultableProps;

export type TooltipDefaultableProps = {
  size?: Size4SM;
  variant?: "light" | "dark";
  position?: Position;
};
