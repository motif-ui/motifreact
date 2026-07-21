import styles from "../Grid.module.scss";
import { ReactElement } from "react";
import { ColProps } from "./Col";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

export type RowProps = {
  justifyCols?: "start" | "center" | "end" | "evenly";
  colsAuto?: boolean;
  children: ReactElement<ColProps> | (ReactElement<ColProps> | null | boolean)[] | null | boolean;
};

const Row = (props: PropsWithRef<RowProps, HTMLDivElement>) => {
  const { children, justifyCols = "start", colsAuto, ref } = props;
  const classNames = sanitizeModuleClasses(styles, "row", justifyCols, colsAuto && "colsAuto");
  return (
    <div className={classNames} data-testid="grid-row" ref={ref}>
      {children}
    </div>
  );
};

Row.displayName = "Row";
export default Row;
