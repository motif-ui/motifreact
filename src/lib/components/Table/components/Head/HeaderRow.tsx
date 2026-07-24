import styles from "../../Table.module.scss";
import InputText from "@/components/Motif/InputText/InputText";
import { TableContext } from "@/components/Table/TableContext";
import { ReactNode, useContext } from "react";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { useMotifContext } from "../../../../motif/context/MotifProvider";

type Props = {
  colspan: number;
  header?: ReactNode;
};

const HeaderRow = ({ colspan, header }: Props) => {
  const { setMainFilterQuery, filterableTable, filterPlaceholder } = useContext(TableContext);
  const { t } = useMotifContext();

  return (
    <tr className={styles.headerRow}>
      <th colSpan={colspan}>
        {typeof header === "string" || filterableTable ? (
          <div className={styles.headerRowContent}>
            {header && (typeof header === "string" ? <span className={styles.header}>{header}</span> : header)}
            {filterableTable && (
              <InputText
                iconRight={<MotifIcon name="search" />}
                className={styles.filterInput}
                placeholder={filterPlaceholder ?? t("g.search")}
                size="sm"
                onChange={val => setMainFilterQuery((val as string).toLowerCase())}
              />
            )}
          </div>
        ) : (
          header
        )}
      </th>
    </tr>
  );
};

export default HeaderRow;
