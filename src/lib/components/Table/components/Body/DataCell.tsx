import { getSpanProps } from "@/components/Table/helper";
import { Column, ResolvedCellSpan } from "@/components/Table/types";
import { getValueByChainedKey } from "../../../../../utils/utils";

type Props = {
  column: Column;
  rowData: object;
  span: ResolvedCellSpan;
};

const DataCell = (props: Props) => {
  const { column, rowData, span } = props;
  const data = getValueByChainedKey<never>(rowData, column.dataKey);

  return <td {...getSpanProps(span.colSpan, span.rowSpan)}>{column.render?.(data) ?? (data as string)}</td>;
};

export default DataCell;
