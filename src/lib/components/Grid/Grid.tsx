"use client";

import styles from "./Grid.module.scss";
import Row from "./components/Row";
import Col from "./components/Col";
import { PropsWithRef } from "../../types";
import { GridProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import GridContext from "@/components/Grid/GridContext";
import { useContext } from "react";

const GridComponent = (props: PropsWithRef<GridProps, HTMLDivElement>) => {
  const { fluid, leanToEdge, children, className, style, colProps = {}, ref } = usePropsWithThemeDefaults("Grid", props);
  const { isNested } = useContext(GridContext);
  const resolvedLeanToEdge = Boolean(leanToEdge ?? isNested);
  const classNames = sanitizeModuleRootClasses(styles, className, [fluid && "fluid", resolvedLeanToEdge && "leanToEdge"]);

  return (
    <GridContext value={{ ...colProps, isNested: true }}>
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
