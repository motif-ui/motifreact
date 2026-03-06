import { ReactElement } from "react";
import { RowProps } from "./components/Row";
import { StandardProps } from "../../types";

export type GridProps = {
  colProps?: StandardProps;
  children: ReactElement<RowProps> | (ReactElement<RowProps> | null | boolean)[] | null | boolean;
} & GridDefaultableProps;

export type GridDefaultableProps = {
  fluid?: boolean;
  leanToEdge?: boolean;
};
