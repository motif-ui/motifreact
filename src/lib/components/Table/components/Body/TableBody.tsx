import { memo, ReactNode, useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";
import styles from "../../Table.module.scss";
import Skeleton from "@/components/Skeleton";
import DataRow from "@/components/Table/components/Body/DataRow";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

type Props = {
  loading?: boolean;
  emptyMessage?: ReactNode;
  striped?: boolean;
};

const TableBody = memo((props: Props) => {
  const { loading, emptyMessage, striped } = props;
  const { visibleRows, numberOfVisibleColumns } = useContext(TableContext);

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
        visibleRows.map((row, index) => <DataRow key={row.motifIndex} rowNumberStatic={index + 1} row={row} />)
      )}
    </tbody>
  );
});

export default TableBody;
