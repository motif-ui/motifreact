import styles from "../../Table.module.scss";
import Pagination from "@/components/Pagination";
import { useContext } from "react";
import { TableContext } from "@/components/Table/TableContext";
import RowNumberMessage from "@/components/Table/components/Foot/RowNumberMessage";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

type Props = {
  loading?: boolean;
  hideTotalRecordsMessage?: boolean;
};

const FooterForNumbers = ({ loading, hideTotalRecordsMessage }: Props) => {
  const { originalRows, pagination, usableRows, totalRecords, currentPage, setCurrentPage } = useContext(TableContext);

  const paginationPosition = pagination?.position || "center";
  const className = sanitizeModuleClasses(
    styles,
    "footerForNumbers",
    !hideTotalRecordsMessage && "hasNumbers",
    pagination && `hasPagination-${paginationPosition}`,
  );

  return (
    <div className={className} data-testid="FooterForNumbers">
      {!hideTotalRecordsMessage && totalRecords > 0 && <RowNumberMessage />}
      {pagination && (
        <div className={styles.pagination}>
          {!loading && originalRows && (
            <Pagination
              total={usableRows?.length ?? 0}
              current={currentPage}
              pageSize={pagination.rowsPerPage}
              onChange={setCurrentPage}
              size="sm"
            />
          )}
        </div>
      )}
      {pagination && !hideTotalRecordsMessage && paginationPosition === "center" && <div style={{ flex: 1 }} />}
    </div>
  );
};

export default FooterForNumbers;
