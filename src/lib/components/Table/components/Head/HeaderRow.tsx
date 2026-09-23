"use client";

import styles from "../../Table.module.scss";
import InputText from "@/components/Motif/InputText/InputText";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { TableContext } from "@/components/Table/TableContext";
import { ReactNode, useContext } from "react";
import { useMotifContext } from "../../../../motif/context/MotifProvider";

type Props = {
  colspan: number;
  header?: ReactNode;
};

const HeaderRow = ({ colspan, header }: Props) => {
  const { filterableTable, filterPlaceholder, disableFilterOnKeyPress, mainFilterInputValue, setMainFilterInputValue, applyFilter } =
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
                {...(disableFilterOnKeyPress
                  ? { buttonRight: { name: "search", onClick: applyFilter }, onKeyUp: e => e.key === "Enter" && applyFilter() }
                  : { iconRight: <MotifIcon name="search" /> })}
                clearable
                className={styles.filterInput}
                placeholder={filterPlaceholder ?? t("g.search")}
                size="sm"
                onChange={val => {
                  setMainFilterInputValue(val as string);
                  !disableFilterOnKeyPress && applyFilter();
                }}
                onClearClick={() => applyFilter(true)}
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
