import { ReactElement } from "react";
import { RowProps } from "./components/Row";
import { StandardProps, Size7 } from "../../types";

export type GridProps = {
  colProps?: StandardProps;
  children: ReactElement<RowProps> | (ReactElement<RowProps> | null | boolean)[] | null | boolean;
} & GridDefaultableProps;

export type GridDefaultableProps = {
  fluid?: boolean;
  leanToEdge?: boolean;
  gutter?: Size7;
  gutterX?: Size7;
  gutterY?: Size7;
};
