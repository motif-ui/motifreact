import styles from "../../Table.module.scss";
import { memo, useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";

const RowNumberMessage = memo(() => {
  const { originalRows, selectable, totalRecords } = useContext(TableContext);

  const message = selectable
    ? `Toplam ${totalRecords} veriden ${originalRows?.filter(r => r.isSelected).length || 0} tanesi seçildi.`
    : `Toplam ${totalRecords} veri bulunmaktadır.`;

  return <span className={styles.totalRecordsLabel}>{message}</span>;
});

export default RowNumberMessage;
