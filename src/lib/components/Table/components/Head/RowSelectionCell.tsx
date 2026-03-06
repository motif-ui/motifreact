import styles from "../../Table.module.scss";
import Checkbox from "@/components/Checkbox";
import { useContext, useMemo } from "react";
import { TableContext } from "@/components/Table/TableContext";

const RowSelectionCell = () => {
  const { usableRows, selectHandler } = useContext(TableContext);

  const selectedUsabledRows = useMemo(() => usableRows?.filter(r => r.isSelected), [usableRows]);
  const checked = !!usableRows?.length && selectedUsabledRows?.length === usableRows.length;
  const partialCheck = !checked && !!selectedUsabledRows?.length && selectedUsabledRows.length > 0;

  return (
    <th className={styles.selectable}>
      <Checkbox
        size="sm"
        checked={checked}
        partialCheck={partialCheck}
        onChange={() => selectHandler?.({ all: checked ? "deselect" : "select" })}
      />
    </th>
  );
};

export default RowSelectionCell;
