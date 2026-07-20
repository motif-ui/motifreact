import styles from "../../Table.module.scss";
import { getSpanProps } from "@/components/Table/helper";
import { Column, ResolvedCellSpan } from "@/components/Table/types";
import { sanitizeModuleClasses } from "src/utils/cssUtils";
import { getValueByChainedKey } from "../../../../../utils/utils";

type Props = {
  column: Column;
  rowData: object;
  span: ResolvedCellSpan;
  rowIndex: number;
  hoveredRowIndex?: number;
};

const DataCell = (props: Props) => {
  const { column, rowData, span, rowIndex, hoveredRowIndex } = props;
  const data = getValueByChainedKey<never>(rowData, column.dataKey);

  const isHovered = hoveredRowIndex != null && hoveredRowIndex >= rowIndex && hoveredRowIndex < rowIndex + span.rowSpan;

  return (
    <td {...getSpanProps(span.colSpan, span.rowSpan)} className={sanitizeModuleClasses(styles, isHovered && "hovered")}>
      {column.render?.(data) ?? (data as string)}
    </td>
  );
};

export default DataCell;
