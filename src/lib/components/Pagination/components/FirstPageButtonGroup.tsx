import { memo } from "react";
import styles from "../Pagination.module.scss";
import { usePaginationContext } from "../PaginationContext";

const FirstPageButtonGroup = memo(() => {
  const { currentPage, onPageChange } = usePaginationContext();

  return (
    <>
      {currentPage > 2 && (
        <button onClick={() => onPageChange(1)} className={styles.pageItem}>
          1
        </button>
      )}
      {currentPage > 3 && <span className={styles.separator} />}
    </>
  );
});

export default FirstPageButtonGroup;
