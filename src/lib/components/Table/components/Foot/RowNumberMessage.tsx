import styles from "../../Table.module.scss";
import { memo, useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";
import { useMotifContext } from "src/lib/motif/context/MotifProvider";

const RowNumberMessage = memo(() => {
  const { t } = useMotifContext();
  const { selectedIds, selectable, totalRecords } = useContext(TableContext);

  const message = selectable
    ? t("table.selectedRecords", { selected: selectedIds.size })
    : t("table.totalRecords", { total: totalRecords });

  return <span className={styles.totalRecordsLabel}>{message}</span>;
});

export default RowNumberMessage;
