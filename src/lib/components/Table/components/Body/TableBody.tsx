import { memo, ReactNode, useContext, useMemo, useState } from "react";
import { TableContext } from "@/components/Table/TableContext";
import styles from "../../Table.module.scss";
import Skeleton from "@/components/Skeleton";
import DataRow from "@/components/Table/components/Body/DataRow";
import { getRowStripeGroups, hasRowSpan } from "@/components/Table/helper";
import { sanitizeModuleClasses } from "src/utils/cssUtils";

type Props = {
  loading?: boolean;
  emptyMessage?: ReactNode;
  striped?: boolean;
  hoverable?: boolean;
};

const TableBody = memo((props: Props) => {
  const { loading, emptyMessage, striped, hoverable } = props;
  const { visibleRows, numberOfVisibleColumns, spannedCellsMap } = useContext(TableContext);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number>();

  const stripeGroups = useMemo(
    () => (striped ? getRowStripeGroups(spannedCellsMap, visibleRows?.length ?? 0) : undefined),
    [striped, spannedCellsMap, visibleRows?.length],
  );

  const trackHover = useMemo(() => !!hoverable && hasRowSpan(spannedCellsMap), [hoverable, spannedCellsMap]);

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
            isStripe={stripeGroups !== undefined && stripeGroups[index] % 2 === 1}
            hoveredRowIndex={trackHover ? hoveredRowIndex : undefined}
            onHover={trackHover ? setHoveredRowIndex : undefined}
          />
        ))
      )}
    </tbody>
  );
});

export default TableBody;
