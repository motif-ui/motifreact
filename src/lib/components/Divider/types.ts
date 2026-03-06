import { Size3 } from "../../types";

export type DividerProps = {
  orientation?: "vertical" | "horizontal";
  size?: Size3;
  gap?: Size3;
  shape?: "dotted" | "dashed" | "solid";
};
