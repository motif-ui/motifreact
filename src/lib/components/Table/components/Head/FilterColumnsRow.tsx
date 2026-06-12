import styles from "../../Table.module.scss";
import FilterCell from "@/components/Table/components/Head/FilterCell";
import { useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";
import { getRenderableHeaderColumns, getSpanProps } from "@/components/Table/helper";

const FilterColumnsRow = () => {
  const { columns, showFixedRowNumbers, selectable } = useContext(TableContext);

  return (
    <tr className={styles.trColumnFilters}>
      {selectable && <th />}
      {showFixedRowNumbers && <th />}
      {getRenderableHeaderColumns(columns).map(({ column, index, colSpan }) => {
        const key = "0-filter" + index;
        return column.filter ? <FilterCell index={index} key={key} colSpan={colSpan} /> : <th key={key} {...getSpanProps(colSpan)} />;
      })}
    </tr>
  );
};

export default FilterColumnsRow;
