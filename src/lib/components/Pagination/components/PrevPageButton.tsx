import { memo } from "react";
import styles from "../Pagination.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { usePaginationContext } from "../PaginationContext";

const PrevPageButton = memo(() => {
  const { currentPage, onPageChange } = usePaginationContext();

  return (
    <button onClick={() => onPageChange(currentPage - 1)} className={`${styles.pageItem} ${styles.arrowIcon}`} disabled={currentPage === 1}>
      <MotifIcon name="arrow_back" size="lg" />
    </button>
  );
});

export default PrevPageButton;
