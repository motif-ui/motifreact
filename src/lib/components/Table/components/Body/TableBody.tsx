import { memo, ReactNode, useContext, useMemo } from "react";
import { TableContext } from "@/components/Table/TableContext";
import styles from "../../Table.module.scss";
import Skeleton from "@/components/Skeleton";
import DataRow from "@/components/Table/components/Body/DataRow";
import { getContinuationRows, getRowStripeGroups } from "@/components/Table/helper";
import { sanitizeModuleClasses } from "src/utils/cssUtils";

type Props = {
  loading?: boolean;
  emptyMessage?: ReactNode;
  striped?: boolean;
};

const TableBody = memo((props: Props) => {
  const { loading, emptyMessage, striped } = props;
  const { visibleRows, numberOfVisibleColumns, spannedCellsMap } = useContext(TableContext);

  const stripeGroups = useMemo(
    () => striped && getRowStripeGroups(spannedCellsMap, visibleRows?.length ?? 0),
    [striped, spannedCellsMap, visibleRows?.length],
  );

  const continuationRows = useMemo(() => getContinuationRows(spannedCellsMap), [spannedCellsMap]);

  const className = sanitizeModuleClasses(styles, striped && "striped");
  return (
    <tbody className={className} data-testid="TableBody">
      {loading ? (
        <tr className={styles.loading}>
          <td colSpan={numberOfVisibleColumns}>
            <Skeleton />
          </td>
        </tr>
      ) : !visibleRows?.length ? (
        <tr className={styles.emptyData}>
          <td role="status" colSpan={numberOfVisibleColumns}>
            {emptyMessage ?? "No data"}
          </td>
        </tr>
      ) : (
        visibleRows.map((row, index) => (
          <DataRow
            key={row.motifIndex}
            rowNumberStatic={index + 1}
            row={row}
            rowIndex={index}
            isStripe={!!stripeGroups && stripeGroups[index] % 2 === 1}
            isGroupContinuation={continuationRows.has(index)}
          />
        ))
      )}
    </tbody>
  );
});

export default TableBody;
