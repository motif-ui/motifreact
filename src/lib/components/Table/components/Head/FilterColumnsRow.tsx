import styles from "../../Table.module.scss";
import FilterCell from "@/components/Table/components/Head/FilterCell";
import { useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";

const FilterColumnsRow = () => {
  const { columns, showFixedRowNumbers, selectable } = useContext(TableContext);

  return (
    <tr className={styles.trColumnFilters}>
      {selectable && <th />}
      {showFixedRowNumbers && <th />}
      {columns.map((column, index) => {
        const key = "0-filter" + index;
        return column.filter ? <FilterCell index={index} key={key} /> : <th key={key} />;
      })}
    </tr>
  );
};

export default FilterColumnsRow;
