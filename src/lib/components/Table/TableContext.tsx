"use client";

import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { getNextItemInArray, getTextFromNode, getValueByChainedKey } from "../../../utils/utils";
import { sortByType } from "@/components/Table/sorting";
import { ColumState, RowDetail, TableContextDefaultValues, TableContextProps, TableContextType } from "@/components/Table/types";
import { SORT_DIRECTIONS } from "@/components/Table/constants";

export const TableContext = createContext<TableContextType>(TableContextDefaultValues);

export const TableProvider = (props: PropsWithChildren<TableContextProps>) => {
  const {
    dataRaw,
    columns,
    showFixedRowNumbers,
    pagination,
    selectable,
    selectionKey,
    onSelect,
    filterableTable,
    reflectDataChanges,
    rowColorCallback,
  } = props;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mainFilterQuery, setMainFilterQuery] = useState<string>("");

  const mapDataToMotifTableRow: (row: object, index: number) => RowDetail = useCallback(
    (row: object, index: number) => ({
      motifIndex: index,
      data: { "#": index + 1, ...row },
      isSelected: !!selectionKey && !!row[selectionKey as keyof typeof row],
    }),
    [selectionKey],
  );

  // Original data user provided. We only add some necessary internal props to it. It doesn't change at all.
  const [originalRows, setOriginalRows] = useState<RowDetail[] | undefined>(dataRaw?.map(mapDataToMotifTableRow));
  const [columnStates, setColumnStates] = useState<ColumState[]>(columns.map(() => ({})));

  // Data that is used in the table. It can be sorted, filtered, paginated etc. (derived from originalRows)
  const usableRows = useMemo(() => {
    if (!originalRows) return undefined;

    const filteredRows = originalRows.filter(row => {
      const columnMatches = !columns.some((column, index) => {
        const data = getValueByChainedKey<never>(row.data, column.dataKey);
        const contentToBeSearched = !column.render ? data : getTextFromNode(column.render(data));
        const columnQuery = columnStates[index]?.filterQuery;
        return columnQuery ? `${contentToBeSearched}`.toLowerCase().search(columnQuery) === -1 : false;
      });

      const mainFilterMatches = mainFilterQuery
        ? columns.some(column => {
            const data = getValueByChainedKey<never>(row.data, column.dataKey);
            const contentToBeSearched = !column.render ? data : getTextFromNode(column.render(data));
            return `${contentToBeSearched}`.toLowerCase().search(mainFilterQuery) > -1;
          })
        : true;

      return columnMatches && mainFilterMatches;
    });

    // Sort
    return columns.reduce((acc, column, index) => {
      const sortDirection = columnStates[index]?.lastSortDirection;
      return sortDirection
        ? acc.sort((a, b) => {
            const data1 = getValueByChainedKey(sortDirection === "asc" ? a.data : b.data, column.dataKey);
            const data2 = getValueByChainedKey(sortDirection === "asc" ? b.data : a.data, column.dataKey);
            return column.sorting?.customSort?.(data1, data2) ?? sortByType(data1, data2, typeof data1);
          })
        : acc;
    }, filteredRows);
  }, [originalRows, columnStates, columns, mainFilterQuery]);

  // Data that is visible in the table. It can be less than usableRows if pagination is enabled.
  const visibleRows = useMemo(
    () => (pagination ? usableRows?.slice((currentPage - 1) * pagination.rowsPerPage, currentPage * pagination.rowsPerPage) : usableRows),
    [currentPage, usableRows, pagination],
  );

  const refillOriginalRows = useCallback(() => {
    const mappedData = dataRaw?.map(mapDataToMotifTableRow);
    setOriginalRows(mappedData);
  }, [dataRaw, mapDataToMotifTableRow]);

  useEffect(() => {
    if ((dataRaw?.length && !originalRows?.length) || reflectDataChanges) {
      refillOriginalRows();
    }
  }, [dataRaw, originalRows?.length, refillOriginalRows, reflectDataChanges]);

  const selectHandler = useCallback(
    ({ row, all }: { row?: RowDetail; all?: "select" | "deselect" }) => {
      if (all === "select") {
        const selectedUsableRowsIndices = usableRows?.map(r => r.motifIndex);
        setOriginalRows(originalRows?.map(r => (selectedUsableRowsIndices?.includes(r.motifIndex) ? { ...r, isSelected: true } : r)));
        onSelect?.({
          all: usableRows!.map(r => r.data),
        });
      } else if (all === "deselect") {
        const deSelectedUsableRowIndices = usableRows?.map(r => r.motifIndex);
        setOriginalRows(originalRows?.map(r => (deSelectedUsableRowIndices?.includes(r.motifIndex) ? { ...r, isSelected: false } : r)));
        onSelect?.({
          all: [],
        });
      } else if (row) {
        const updatedOriginalRows = originalRows?.map(r => (r.motifIndex === row.motifIndex ? { ...r, isSelected: !r.isSelected } : r));
        onSelect?.({
          all: updatedOriginalRows?.filter(r => r.isSelected).map(r => r.data) || [],
          current: row.data,
        });
        setOriginalRows(updatedOriginalRows);
      }
    },
    [usableRows, onSelect, originalRows],
  );

  const updateSortState = useCallback(
    (columnIndex: number) => {
      if (usableRows?.length) {
        setColumnStates(prev => {
          const sortDirection = getNextItemInArray(SORT_DIRECTIONS, prev[columnIndex]?.lastSortDirection);
          return prev.map((c, index) => (index === columnIndex ? { ...c, lastSortDirection: sortDirection } : c));
        });
        setCurrentPage(1);
      }
    },
    [usableRows?.length],
  );

  const updateFilterState = useCallback((query: string, columnIndex?: number) => {
    if (columnIndex !== undefined) {
      setColumnStates(prev => prev.map((c, index) => (index === columnIndex ? { ...c, filterQuery: query } : c)));
      setCurrentPage(1);
    }
  }, []);

  const handleMainFilterChange = useCallback((query: string) => {
    setMainFilterQuery(query);
    setCurrentPage(1);
  }, []);

  const contextValue = useMemo(() => {
    return {
      originalRows,
      usableRows,
      updateSortState,
      visibleRows,
      columns,
      columnStates,
      showFixedRowNumbers,
      setCurrentPage,
      currentPage,
      pagination,
      selectable,
      selectHandler,
      filterableTable,
      filterableColumns: columns.some(c => c.filter),
      updateFilterState,
      totalRecords: originalRows?.length ?? 0,
      setMainFilterQuery: handleMainFilterChange,
      numberOfVisibleColumns: columns.length + (selectable ? 1 : 0) + (showFixedRowNumbers ? 1 : 0),
      rowColorCallback,
    };
  }, [
    originalRows,
    usableRows,
    updateSortState,
    visibleRows,
    columns,
    columnStates,
    showFixedRowNumbers,
    currentPage,
    pagination,
    selectable,
    selectHandler,
    filterableTable,
    updateFilterState,
    handleMainFilterChange,
    rowColorCallback,
  ]);

  return <TableContext value={contextValue}>{props.children}</TableContext>;
};
