import { ReactNode, useContext, useMemo } from "react";
import { TableContext } from "@/components/Table/TableContext";
import { Column, RowBackground } from "@/components/Table/types";
import { getColSpan, getRenderableHeaderColumns } from "@/components/Table/cellSpan";
import { getValueByChainedKey } from "../../../../../utils/utils";
import styles from "../../Table.module.scss";

type Props = {
  background: RowBackground;
  customFooter?: () => ReactNode;
};

const ColumnFootArea = ({ background, customFooter }: Props) => {
  const { originalRows, columns, showFixedRowNumbers, selectable, numberOfVisibleColumns } = useContext(TableContext);

  const columnsConsideringExtraCols = useMemo(
    () =>
      columns.some(column => column.footer)
        ? [...(selectable ? [{ title: "" }] : []), ...(showFixedRowNumbers ? [{ title: "#" }] : []), ...columns]
        : undefined,
    [columns, showFixedRowNumbers, selectable],
  );

  const colspanInfoList = useMemo(
    () =>
      columnsConsideringExtraCols?.reduceRight(
        (acc, column, index, arr) => {
          const columnSpan = getColSpan(column, arr.length - index) ?? 1;
          if (column.footer) {
            return [{ colSpan: 0, title: column.footer.title }, ...acc];
          } else {
            if (!acc.length) return [{ colSpan: columnSpan }];

            const [lastItem, ...rest] = acc;
            return [{ colSpan: lastItem.colSpan + columnSpan, title: lastItem.title }, { colSpan: 0 }, ...rest];
          }
        },
        [] as { colSpan: number; title?: string }[],
      ),
    [columnsConsideringExtraCols],
  );

  const getFooterValue = ({ title, dataKey, footer }: Column) => {
    const { type } = footer || {};
    switch (type) {
      case "avg":
        return originalRows
          ? (originalRows.reduce((acc, row) => acc + getValueByChainedKey<number>(row.data, dataKey), 0) / originalRows.length).toFixed(2)
          : undefined;
      case "sum":
        return originalRows?.reduce((acc, row) => acc + getValueByChainedKey<number>(row.data, dataKey), 0);
      case "title":
        return title;
      default:
        return undefined;
    }
  };

  const footerCells = columnsConsideringExtraCols
    ? getRenderableHeaderColumns(columnsConsideringExtraCols).map(({ column, index }) => {
        const info = colspanInfoList?.[index];
        if (!info || (!column.footer && !info.colSpan)) {
          return null;
        }

        const { colSpan, title } = info;
        return (
          <th key={"foot_td" + index} {...(colSpan && { colSpan })}>
            {column.footer ? (column.footer.render?.(getFooterValue(column)) ?? getFooterValue(column)) : colSpan > 0 && title ? title : ""}
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
