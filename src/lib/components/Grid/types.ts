import { ReactElement } from "react";
import { RowProps } from "./components/Row";
import { StandardProps, Size4LG } from "../../types";

export type GridProps = {
  colProps?: StandardProps;
  children: ReactElement<RowProps> | (ReactElement<RowProps> | null | boolean)[] | null | boolean;
} & GridDefaultableProps;

export type GridDefaultableProps = {
  fluid?: boolean;
  leanToEdge?: boolean;
  gutter?: Size4LG;
  gutterX?: Size4LG;
  gutterY?: Size4LG;
};
