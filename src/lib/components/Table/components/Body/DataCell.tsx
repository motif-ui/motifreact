import { Column } from "@/components/Table/types";
import { getValueByChainedKey } from "../../../../../utils/utils";

type Props = {
  column: Column;
  rowData: object;
};

const DataCell = (props: Props) => {
  const { column, rowData } = props;
  const data = getValueByChainedKey<never>(rowData, column.dataKey);

  return <td>{column.render?.(data) ?? (data as string)}</td>;
};

export default DataCell;
