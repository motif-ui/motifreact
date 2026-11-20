import styles from "../Grid.module.scss";
import { ReactElement } from "react";
import { ColProps } from "./Col";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleClassesWithOptions } from "../../../../utils/cssUtils";
import { GapProps } from "../types";
import { getGapClasses } from "../helper";

export type RowProps = {
  justifyCols?: "start" | "center" | "end" | "evenly" | "apart";
  colsAuto?: boolean;
  stretchItems?: boolean;
  children: ReactElement<ColProps> | (ReactElement<ColProps> | null | boolean)[] | null | boolean;
} & GapProps;

const Row = (props: PropsWithRef<RowProps, HTMLDivElement>) => {
  const { children, justifyCols = "start", colsAuto, stretchItems, gap, rowGap, columnGap, className, style, ref } = props;
  const classNames = sanitizeModuleClassesWithOptions(
    styles,
    { externalClasses: [className] },
    "row",
    justifyCols,
    colsAuto && "colsAuto",
    stretchItems && "stretchItems",
    getGapClasses({ gap, rowGap, columnGap }),
  );
  return (
    <div className={classNames} style={style} data-testid="grid-row" ref={ref}>
      {children}
    </div>
  );
};

Row.displayName = "Row";
export default Row;
