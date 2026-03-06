"use client";
import styles from "./DataView.module.scss";
import DataViewItem from "@/components/DataView/DataViewItem";
import { PropsWithRefAndChildren } from "../../types";
import { useMemo } from "react";
import { DataViewProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const DataViewComponent = (props: PropsWithRefAndChildren<DataViewProps, HTMLDivElement>) => {
  const {
    children,
    cols = 1,
    rowVariant = "plain",
    removeBorder,
    valueAlignment = "left",
    orientation = "horizontal",
    ref,
    style,
    className,
    sm = cols,
    md = sm,
    lg = md,
    xl = lg,
  } = usePropsWithThemeDefaults("DataView", props);

  const colKeys = useMemo(() => {
    return Object.entries({ xs: cols, sm, md, lg, xl }).map(([k, v]) => `${k}-${v}`);
  }, [cols, sm, md, lg, xl]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    valueAlignment + "Align",
    rowVariant !== "plain" && rowVariant,
    !removeBorder && "bordered",
    orientation,
    ...colKeys,
  ]);

  return (
    <div ref={ref} style={style} className={classNames}>
      {children}
    </div>
  );
};

const DataView = Object.assign(DataViewComponent, { Item: DataViewItem, displayName: "DataView" });
export default DataView;
