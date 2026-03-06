import { memo } from "react";
import styles from "../Pagination.module.scss";
import { usePaginationContext } from "../PaginationContext";

const LastPageButtonGroup = memo(() => {
  const { currentPage, numberOfPages, onPageChange } = usePaginationContext();

  return (
    <>
      {currentPage <= numberOfPages - 3 && <span className={styles.separator} />}
      {currentPage <= numberOfPages - 2 && (
        <button onClick={() => onPageChange(numberOfPages)} className={styles.pageItem}>
          {numberOfPages}
        </button>
      )}
    </>
  );
});

export default LastPageButtonGroup;
