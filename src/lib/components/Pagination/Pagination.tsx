"use client";

import { useCallback, useMemo } from "react";
import styles from "./Pagination.module.scss";
import { PaginationProps } from "./types";
import PrevPageButton from "./components/PrevPageButton";
import NextPageButton from "./components/NextPageButton";
import FirstPageButtonGroup from "./components/FirstPageButtonGroup";
import LastPageButtonGroup from "./components/LastPageButtonGroup";
import { PropsWithRef } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { PaginationContext } from "./PaginationContext";

const Pagination = (props: PropsWithRef<PaginationProps, HTMLDivElement>) => {
  const { total, current, pageSize, onChange, size = "md", className, style, ref } = usePropsWithThemeDefaults("Pagination", props);
  const numberOfPages = Math.ceil(total / pageSize);

  const handlePageChange = useCallback(
    (page: number) => {
      page > 0 && page <= numberOfPages && onChange?.(page);
    },
    [numberOfPages, onChange],
  );

  const visiblePages = useMemo(
    () => [current - 1, current, current + 1].filter(page => page > 0 && page <= numberOfPages),
    [current, numberOfPages],
  );

  const classNames = sanitizeModuleRootClasses(styles, className, [size]);

  const contextValue = useMemo(
    () => ({ currentPage: current, numberOfPages, onPageChange: handlePageChange }),
    [current, numberOfPages, handlePageChange],
  );

  return (
    numberOfPages > 1 && (
      <PaginationContext value={contextValue}>
        <div className={classNames} data-testid="pagination" ref={ref} style={style}>
          <PrevPageButton />
          <FirstPageButtonGroup />
          {visiblePages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`${styles.pageItem} ${page === current ? styles.active : ""}`}
            >
              {page}
            </button>
          ))}
          <LastPageButtonGroup />
          <NextPageButton />
        </div>
      </PaginationContext>
    )
  );
};

Pagination.displayName = "Pagination";
export default Pagination;
