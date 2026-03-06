import styles from "../../Table.module.scss";
import Checkbox from "@/components/Checkbox";
import DataCell from "@/components/Table/components/Body/DataCell";

import { useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";
import { RowDetail } from "@/components/Table/types";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

type Props = {
  rowNumberStatic: number;
  row: RowDetail;
};

const DataRow = (props: Props) => {
  const { rowNumberStatic, row } = props;
  const { columns, showFixedRowNumbers, selectable, selectHandler, rowColorCallback } = useContext(TableContext);

  const className = sanitizeModuleClasses(styles, row.isSelected && "selected", rowColorCallback?.(row.data));

  return (
    <tr className={className}>
      {selectable && (
        <td className={styles.selectable}>
          <Checkbox size="sm" onChange={() => selectHandler?.({ row })} checked={row.isSelected} />
        </td>
      )}
      {showFixedRowNumbers ? <td>{rowNumberStatic}</td> : null}
      {columns.map((column, cIndex) => (
        <DataCell key={row.motifIndex + "-" + cIndex} column={column} rowData={row.data} />
      ))}
    </tr>
  );
};

export default DataRow;
