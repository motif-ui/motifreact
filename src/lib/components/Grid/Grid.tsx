"use client";

import styles from "./Grid.module.scss";
import Row from "./components/Row";
import Col from "./components/Col";
import { PropsWithRef } from "../../types";
import { GridProps } from "./types";
import { getGapClasses, getSpacingClasses } from "./helper";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import GridContext from "@/components/Grid/GridContext";

const GridComponent = (props: PropsWithRef<GridProps, HTMLDivElement>) => {
  const {
    fluid,
    leanToEdge,
    gutter = "sm",
    padding,
    gap,
    rowGap,
    columnGap,
    children,
    className,
    style,
    colProps = {},
    ref,
  } = usePropsWithThemeDefaults("Grid", props);
  const classNames = sanitizeModuleRootClasses(styles, className, [
    fluid && "fluid",
    leanToEdge && "leanToEdge",
    // TODO: To be removed after gutter is removed - Deprecated gutter is the lowest priority value of both gap and padding, used for the breakpoints they have no value for
    getGapClasses({ gap, rowGap, columnGap }, gutter),
    getSpacingClasses("padding", padding, gutter),
  ]);

  return (
    <GridContext value={{ ...colProps }}>
      <div className={classNames} style={style} ref={ref}>
        {children}
      </div>
    </GridContext>
  );
};
const Grid = Object.assign(GridComponent, {
  displayName: "Grid",
  Row,
  Col,
});

export default Grid;
