import HeaderCell from "@/components/Table/components/Head/HeaderCell";
import { ReactNode, useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";
import { RowBackground } from "@/components/Table/types";
import styles from "../../Table.module.scss";
import HeaderRow from "@/components/Table/components/Head/HeaderRow";
import FilterColumnsRow from "@/components/Table/components/Head/FilterColumnsRow";
import RowSelectionCell from "@/components/Table/components/Head/RowSelectionCell";
import { getRenderableHeaderColumns } from "@/components/Table/cellSpan";

type Props = {
  background: RowBackground;
  header?: ReactNode;
};

const TableHead = ({ background, header }: Props) => {
  const { columns, showFixedRowNumbers, selectable, filterableTable, filterableColumns, numberOfVisibleColumns } = useContext(TableContext);

  return (
    <thead className={styles[background]} data-testid="TableHead">
      {(filterableTable || header) && <HeaderRow colspan={numberOfVisibleColumns} header={header} />}
      <tr>
        {selectable && <RowSelectionCell />}
        {showFixedRowNumbers && <th>#</th>}
        {getRenderableHeaderColumns(columns).map(({ column, index, colSpan }) => (
          <HeaderCell key={"0-" + index} index={index} column={column} colSpan={colSpan} />
        ))}
      </tr>
      {filterableColumns && <FilterColumnsRow />}
    </thead>
  );
};

export default TableHead;
