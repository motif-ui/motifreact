import styles from "../../Table.module.scss";
import { MotifIconButton } from "@/components/Motif/Icon";
import { Column } from "@/components/Table/types";
import { useContext } from "react";
import { TableContext } from "../../TableContext";

type Props = {
  index: number;
  column: Column;
};

const HeaderCell = (props: Props) => {
  const { index, column } = props;
  const { updateSortState, columnStates } = useContext(TableContext);

  const lastSortDirection = columnStates[index]?.lastSortDirection;
  const iconName = lastSortDirection === "asc" ? "keyboard_arrow_up" : lastSortDirection === "desc" ? "keyboard_arrow_down" : "expand_all";

  return (
    <th {...(column.width && { style: { width: column.width } })}>
      <div className={styles.thContent}>
        <span>{column.title}</span>
        {column.sorting && (
          <MotifIconButton name={iconName} className={styles.sortButton} size="sm" onClick={() => updateSortState(index)} />
        )}
      </div>
    </th>
  );
};

export default HeaderCell;
