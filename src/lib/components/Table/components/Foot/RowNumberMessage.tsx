import styles from "../../Table.module.scss";
import { memo, useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";
import { useMotifContext } from "src/lib/motif/context/MotifProvider";

const RowNumberMessage = memo(() => {
  const { t } = useMotifContext();
  const { originalRows, selectable, totalRecords } = useContext(TableContext);

  const message = selectable
    ? t("table.totalSelectedRecords", { total: totalRecords, selected: originalRows?.filter(r => r.isSelected).length || 0 })
    : t("table.totalRecords", { total: totalRecords });

  return <span className={styles.totalRecordsLabel}>{message}</span>;
});

export default RowNumberMessage;
