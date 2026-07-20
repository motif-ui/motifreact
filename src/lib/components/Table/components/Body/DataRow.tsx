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
  rowIndex: number;
  isStripe?: boolean;
  hoveredRowIndex?: number;
  onHover?: (rowIndex?: number) => void;
};

const DataRow = (props: Props) => {
  const { rowNumberStatic, row, rowIndex, isStripe, hoveredRowIndex, onHover } = props;
  const { columns, showFixedRowNumbers, selectable, selectHandler, rowColorCallback, spannedCellsMap } = useContext(TableContext);

  const className = sanitizeModuleClasses(styles, isStripe && "stripedRow", row.isSelected && "selected", rowColorCallback?.(row.data));

  return (
    <tr className={className} onMouseEnter={onHover && (() => onHover(rowIndex))} onMouseLeave={onHover && (() => onHover(undefined))}>
      {selectable && (
        <td className={styles.selectable}>
          <Checkbox size="sm" onChange={() => selectHandler?.({ row })} checked={row.isSelected} />
        </td>
      )}
      {showFixedRowNumbers ? <td>{rowNumberStatic}</td> : null}
      {columns.map((column, cIndex) => {
        const span = spannedCellsMap.get(`${rowIndex}-${cIndex}`);
        return (
          span && (
            <DataCell
              key={`${row.motifIndex}-${cIndex}`}
              column={column}
              rowData={row.data}
              span={span}
              rowIndex={rowIndex}
              hoveredRowIndex={hoveredRowIndex}
            />
          )
        );
      })}
    </tr>
  );
};

export default DataRow;
