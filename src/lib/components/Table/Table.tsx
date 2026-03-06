import { RowColor, TableProps } from "./types";
import { TableProvider } from "@/components/Table/TableContext";
import TableContainer from "@/components/Table/components/TableContainer";
import { PropsWithRef } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const Table = <T extends object>(props: PropsWithRef<TableProps<T>, HTMLDivElement>) => {
  const {
    columns,
    data,
    showFixedRowNumbers,
    pagination,
    selectable,
    selectionKey,
    onSelect,
    filterableTable,
    reflectDataChanges,
    rowColorCallback,
    ref,
    ...rest
  } = usePropsWithThemeDefaults("Table", props);

  return (
    <TableProvider
      columns={columns}
      dataRaw={data}
      showFixedRowNumbers={showFixedRowNumbers}
      pagination={pagination}
      selectable={selectable}
      selectionKey={selectionKey}
      onSelect={onSelect as (selection: { all: object[]; current?: object }) => void}
      filterableTable={filterableTable}
      reflectDataChanges={reflectDataChanges}
      rowColorCallback={rowColorCallback as (rowData: object) => RowColor | undefined}
    >
      <TableContainer {...rest} ref={ref} />
    </TableProvider>
  );
};

Table.displayName = "Table";
export default Table;
