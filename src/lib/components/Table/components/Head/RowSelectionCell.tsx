import styles from "../../Table.module.scss";
import Checkbox from "@/components/Checkbox";
import { useContext, useMemo } from "react";
import { TableContext } from "@/components/Table/TableContext";

const RowSelectionCell = () => {
  const { visibleRows, selectHandler } = useContext(TableContext);

  const selectedVisibleRows = useMemo(() => visibleRows?.filter(r => r.isSelected), [visibleRows]);
  const checked = !!visibleRows?.length && selectedVisibleRows?.length === visibleRows.length;
  const partialCheck = !checked && !!selectedVisibleRows?.length && selectedVisibleRows.length > 0;

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
