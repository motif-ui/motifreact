import { ReactNode, useContext, useMemo } from "react";
import { TableContext } from "@/components/Table/TableContext";
import { Column, RowBackground } from "@/components/Table/types";
import { getRenderableHeaderColumns, getSpanProps } from "@/components/Table/helper";
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

  const getFooterValue = ({ title, dataKey, footer }: Column) => {
    const { type } = footer || {};
    switch (type) {
      case "avg":
        return originalRows?.length
          ? (originalRows.reduce((acc, row) => acc + getValueByChainedKey<number>(row.data, dataKey), 0) / originalRows.length).toFixed(2)
          : undefined;
      case "sum":
        return originalRows?.length
          ? originalRows.reduce((acc, row) => acc + getValueByChainedKey<number>(row.data, dataKey), 0)
          : undefined;
      case "title":
        return title;
      default:
        return undefined;
    }
  };

  const buildFooterCells = (columns: ReturnType<typeof getRenderableHeaderColumns>) =>
    columns.reduce<{ cells: ReactNode[]; pending: number }>(
      (acc, { column, index, colSpan }) => {
        return !column.footer
          ? { ...acc, pending: acc.pending + (colSpan ?? 1) }
          : {
              cells: [
                ...acc.cells,
                ...(acc.pending
                  ? [
                      <th key={`foot_label_${index}`} {...getSpanProps(acc.pending)}>
                        {column.footer.title}
                      </th>,
                    ]
                  : []),
                <th key={`foot_value_${index}`} {...getSpanProps(colSpan ?? 1)}>
                  {column.footer.render?.(getFooterValue(column)) ?? getFooterValue(column)}
                </th>,
              ],
              pending: 0,
            };
      },
      { cells: [], pending: 0 },
    ).cells;

  const footerCells = columnsConsideringExtraCols ? buildFooterCells(getRenderableHeaderColumns(columnsConsideringExtraCols)) : undefined;

  return (
    <tfoot className={styles[background]} data-testid="TableFooter">
      {footerCells && <tr>{footerCells.filter(Boolean)}</tr>}
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
