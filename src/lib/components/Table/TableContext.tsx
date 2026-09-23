"use client";

import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { foldNormalize, getNextItemInArray, getTextFromNode, getValueByChainedKey } from "../../../utils/utils";
import { sortByType, SORT_DIRECTIONS, getSpannedCellsMap } from "@/components/Table/helper";
import { ColumnState, RowDetail, TableContextDefaultValues, TableContextProps, TableContextType } from "@/components/Table/types";
import { useMotifContext } from "../../motif/context/MotifProvider";

export const TableContext = createContext<TableContextType>(TableContextDefaultValues);

export const TableProvider = (props: PropsWithChildren<TableContextProps>) => {
  const { locale } = useMotifContext();
  const {
    dataRaw,
    columns,
    totalRecords,
    onSortChange,
    onFilterChange,
    onColumnFilterChange,
    showFixedRowNumbers,
    pagination,
    selectable,
    selectionKey,
    onSelect,
    filterableTable,
    filterPlaceholder,
    filterOnKeyPress,
    reflectDataChanges,
    rowColorCallback,
  } = props;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appliedMainFilterQuery, setAppliedMainFilterQuery] = useState<string>("");
  const [mainFilterInputValue, setMainFilterInputValueState] = useState<string>("");
  const mainFilterInputValueRef = useRef(mainFilterInputValue);

  const setMainFilterInputValue = useCallback((value: string) => {
    mainFilterInputValueRef.current = value;
    setMainFilterInputValueState(value);
  }, []);

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
  const [columnStates, setColumnStates] = useState<ColumnState[]>(columns.map(() => ({})));

  // Data that is used in the table. It can be sorted, filtered, paginated etc. (derived from originalRows)
  const usableRows = useMemo(() => {
    if (!originalRows) return undefined;

    const normalize = (s: string) => foldNormalize(s, locale);
    const normalizedMainQuery = appliedMainFilterQuery && normalize(appliedMainFilterQuery);
    const normalizedColumnQueries = columnStates.map(s => s.filterQuery && normalize(s.filterQuery));

    const filteredRows = originalRows.filter(row => {
      const columnMatches =
        !!onColumnFilterChange ||
        !columns.some((column, index) => {
          const data = getValueByChainedKey<never>(row.data, column.dataKey);
          const contentToBeSearched = !column.render ? data : getTextFromNode(column.render(data));
          const columnQuery = normalizedColumnQueries[index];
          return !!columnQuery && !normalize(contentToBeSearched).includes(columnQuery);
        });

      const mainFilterMatches =
        normalizedMainQuery && !onFilterChange
          ? columns.some(column => {
              const data = getValueByChainedKey<never>(row.data, column.dataKey);
              const contentToBeSearched = !column.render ? data : getTextFromNode(column.render(data));
              return normalize(contentToBeSearched).includes(normalizedMainQuery);
            })
          : true;

      return columnMatches && mainFilterMatches;
    });

    // Sort
    return columns.reduce((acc, column, index) => {
      const sortDirection = columnStates[index]?.lastSortDirection;
      return sortDirection && !onSortChange
        ? acc.sort((a, b) => {
            const data1 = getValueByChainedKey(sortDirection === "asc" ? a.data : b.data, column.dataKey);
            const data2 = getValueByChainedKey(sortDirection === "asc" ? b.data : a.data, column.dataKey);
            return column.sorting?.customSort?.(data1, data2) ?? sortByType(data1, data2, typeof data1);
          })
        : acc;
    }, filteredRows);
  }, [originalRows, columnStates, columns, appliedMainFilterQuery, locale, onSortChange, onFilterChange, onColumnFilterChange]);

  // Data that is visible in the table. It can be less than usableRows if pagination is enabled.
  const visibleRows = useMemo(
    () => (pagination ? usableRows?.slice((currentPage - 1) * pagination.rowsPerPage, currentPage * pagination.rowsPerPage) : usableRows),
    [currentPage, usableRows, pagination],
  );

  const spannedCellsMap = useMemo(() => getSpannedCellsMap(columns, visibleRows), [columns, visibleRows]);

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
        const sortDirection = getNextItemInArray(SORT_DIRECTIONS, columnStates[columnIndex]?.lastSortDirection);
        setColumnStates(prev => prev.map((c, index) => (index === columnIndex ? { ...c, lastSortDirection: sortDirection } : c)));
        setCurrentPage(1);
        onSortChange?.({ dataKey: columns[columnIndex]?.dataKey, direction: sortDirection });
      }
    },
    [usableRows?.length, columnStates, columns, onSortChange],
  );

  const updateFilterState = useCallback(
    (query: string, columnIndex?: number) => {
      if (columnIndex !== undefined) {
        setColumnStates(prev => prev.map((c, index) => (index === columnIndex ? { ...c, filterQuery: query } : c)));
        setCurrentPage(1);
        onColumnFilterChange?.({ dataKey: columns[columnIndex]?.dataKey, query });
      }
    },
    [columns, onColumnFilterChange],
  );

  const applyFilter = useCallback(() => {
    if (mainFilterInputValueRef.current === appliedMainFilterQuery) return;
    setAppliedMainFilterQuery(mainFilterInputValueRef.current);
    setCurrentPage(1);
    onFilterChange?.(mainFilterInputValueRef.current);
  }, [appliedMainFilterQuery, onFilterChange]);

  const contextValue = useMemo(
    () => ({
      originalRows,
      usableRows,
      updateSortState,
      visibleRows,
      columns,
      spannedCellsMap,
      columnStates,
      showFixedRowNumbers,
      setCurrentPage,
      currentPage,
      pagination,
      selectable,
      selectHandler,
      filterableTable,
      filterPlaceholder,
      filterOnKeyPress,
      filterableColumns: columns.some(c => c.filter),
      updateFilterState,
      totalRecords: totalRecords ?? originalRows?.length ?? 0,
      mainFilterInputValue,
      setMainFilterInputValue,
      applyFilter,
      numberOfVisibleColumns: columns.length + (selectable ? 1 : 0) + (showFixedRowNumbers ? 1 : 0),
      rowColorCallback,
    }),
    [
      originalRows,
      usableRows,
      updateSortState,
      visibleRows,
      columns,
      spannedCellsMap,
      columnStates,
      showFixedRowNumbers,
      currentPage,
      pagination,
      selectable,
      selectHandler,
      filterableTable,
      filterPlaceholder,
      filterOnKeyPress,
      updateFilterState,
      mainFilterInputValue,
      setMainFilterInputValue,
      applyFilter,
      rowColorCallback,
      totalRecords,
    ],
  );

  return <TableContext value={contextValue}>{props.children}</TableContext>;
};
