"use client";

import styles from "../../Table.module.scss";
import InputText from "@/components/Motif/InputText/InputText";
import { TableContext } from "@/components/Table/TableContext";
import { ReactNode, useContext } from "react";
import { useMotifContext } from "../../../../motif/context/MotifProvider";

type Props = {
  colspan: number;
  header?: ReactNode;
};

const HeaderRow = ({ colspan, header }: Props) => {
  const { filterableTable, filterPlaceholder, filterOnKeyPress, mainFilterInputValue, setMainFilterInputValue, applyFilter } =
    useContext(TableContext);
  const { t } = useMotifContext();

  return (
    <tr className={styles.headerRow}>
      <th colSpan={colspan}>
        {typeof header === "string" || filterableTable ? (
          <div className={styles.headerRowContent}>
            {header && (typeof header === "string" ? <span className={styles.header}>{header}</span> : header)}
            {filterableTable && (
              <InputText
                value={mainFilterInputValue}
                buttonRight={{ name: "search", onClick: applyFilter }}
                clearable
                className={styles.filterInput}
                placeholder={filterPlaceholder ?? t("g.search")}
                size="sm"
                onChange={val => {
                  setMainFilterInputValue(val as string);
                  filterOnKeyPress && applyFilter();
                }}
                onKeyUp={e => e.key === "Enter" && applyFilter()}
                onClearClick={applyFilter}
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
