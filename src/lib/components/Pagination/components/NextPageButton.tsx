import { memo } from "react";
import styles from "../Pagination.module.scss";
import { MotifIcon } from "@/components/Motif/Icon";
import { usePaginationContext } from "../PaginationContext";

const NextPageButton = memo(() => {
  const { currentPage, numberOfPages, onPageChange } = usePaginationContext();

  return (
    <button
      onClick={() => onPageChange(currentPage + 1)}
      className={`${styles.pageItem} ${styles.arrowIcon}`}
      disabled={currentPage === numberOfPages}
    >
      <MotifIcon name="arrow_forward" size="lg" />
    </button>
  );
});

export default NextPageButton;
