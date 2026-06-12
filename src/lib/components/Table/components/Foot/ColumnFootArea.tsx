import { ReactNode, useContext, useMemo } from "react";
import { TableContext } from "@/components/Table/TableContext";
import { Column, RowBackground } from "@/components/Table/types";
import { getRenderableHeaderColumns } from "@/components/Table/helper";
import { getValueByChainedKey } from "../../../../../utils/utils";
import styles from "../../Table.module.scss";

type Props = {
  background: RowBackground;
  customFooter?: () => ReactNode;
};

const ColumnFootArea = ({ background, customFooter }: Props) => {
  const { usableRows, columns, showFixedRowNumbers, selectable, numberOfVisibleColumns } = useContext(TableContext);

  const columnsConsideringExtraCols = useMemo(
    () =>
      columns.some(column => column.footer)
        ? [...(selectable ? [{ title: "" }] : []), ...(showFixedRowNumbers ? [{ title: "#" }] : []), ...columns]
        : undefined,
    [columns, showFixedRowNumbers, selectable],
  );

  const getFooterValue = ({ title, dataKey, footer }: Column) => {
    const { type } = footer || {};
    switch (type) {
      case "avg":
        return usableRows
          ? (usableRows.reduce((acc, row) => acc + getValueByChainedKey<number>(row.data, dataKey), 0) / usableRows.length).toFixed(2)
          : undefined;
      case "sum":
        return usableRows?.reduce((acc, row) => acc + getValueByChainedKey<number>(row.data, dataKey), 0);
      case "title":
        return title;
      default:
        return undefined;
    }
  };

  const footerCells = columnsConsideringExtraCols
    ? getRenderableHeaderColumns(columnsConsideringExtraCols).map(({ column, colSpan: headerColSpan }) => {
        const actualColSpan = headerColSpan ?? 1;
        const footerValue = getFooterValue(column);
        const footerContent = column.footer ? (column.footer.render?.(footerValue) ?? footerValue) : "";
        const footerTitle = column.footer?.title;

        return (
          <th key={"foot_" + column.dataKey} {...(actualColSpan > 1 && { colSpan: actualColSpan })}>
            {footerTitle && <div>{footerTitle}</div>}
            {footerContent}
          </th>
        );
      })
    : undefined;

  return (
    <tfoot className={styles[background]} data-testid="TableFooter">
      {footerCells && <tr>{footerCells}</tr>}
      {customFooter && (
        <tr>
          <th className={styles.customFooter} colSpan={numberOfVisibleColumns}>
            {customFooter()}
          </th>
        </tr>
      )}
    </tfoot>
  );
};

export default ColumnFootArea;
