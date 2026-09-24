"use client";

import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { foldNormalize, getNextItemInArray, getTextFromNode, getValueByChainedKey } from "../../../utils/utils";
import { sortByType, SORT_DIRECTIONS, getSpannedCellsMap } from "@/components/Table/helper";
import {
  ColumnState,
  RowDetail,
  TableContextDefaultValues,
  TableContextProps,
  TableContextType,
  TableRowId,
} from "@/components/Table/types";
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
    onPageChange,
    showFixedRowNumbers,
    pagination,
    selectable,
    selectionKey,
    defaultSelectedIds,
    onSelectionChange,
    filterableTable,
    filterPlaceholder,
    disableFilterOnKeyPress,
    reflectDataChanges,
    rowColorCallback,
  } = props;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appliedMainFilterQuery, setAppliedMainFilterQuery] = useState<string>("");
  const [mainFilterInputValue, setMainFilterInputValueState] = useState<string>("");
  const mainFilterInputValueRef = useRef(mainFilterInputValue);
  const pendingDefaultIdsRef = useRef(new Set(defaultSelectedIds));
  const [selectedIds, setSelectedIds] = useState<Set<TableRowId>>(() => {
    const initial = new Set<TableRowId>();
    if (selectionKey) {
      dataRaw?.forEach(row => {
        const rowUniqueId = (row as Record<string, unknown>)[selectionKey] as TableRowId;
        pendingDefaultIdsRef.current.has(rowUniqueId) && initial.add(rowUniqueId);
      });
    }
    return initial;
  });

  const setMainFilterInputValue = useCallback((value: string) => {
    mainFilterInputValueRef.current = value;
    setMainFilterInputValueState(value);
  }, []);

  const mapDataToMotifTableRow: (row: object, index: number) => RowDetail = useCallback(
    (row: object, index: number) => ({
      motifIndex: index,
      data: { "#": index + 1, ...row },
    }),
    [],
  );

  const getRowId = useCallback(
    (row: RowDetail) => (selectionKey ? (row.data as Record<string, unknown>)[selectionKey] : row.motifIndex) as TableRowId,
    [selectionKey],
  );

  useEffect(() => {
    if (!selectionKey || !pendingDefaultIdsRef.current.size || !dataRaw) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      dataRaw.forEach(row => {
        const rowUniqueId = (row as Record<string, unknown>)[selectionKey] as TableRowId;
        pendingDefaultIdsRef.current.delete(rowUniqueId) && next.add(rowUniqueId);
      });
      return next.size === prev.size ? prev : next;
    });
  }, [dataRaw, selectionKey]);

  // Original data user provided. We only add some necessary internal props to it. It doesn't change at all,
  // unless reflectDataChanges is set — synced in-render (not via useEffect) so a dataRaw change is never
  // painted a frame late, which would otherwise flash the previous page's rows (and their selection state).
  const [originalRows, setOriginalRows] = useState<RowDetail[] | undefined>(() => dataRaw?.map(mapDataToMotifTableRow));
  const [prevDataRaw, setPrevDataRaw] = useState(dataRaw);
  if (dataRaw !== prevDataRaw) {
    setPrevDataRaw(dataRaw);
    ((dataRaw?.length && !originalRows?.length) || reflectDataChanges) && setOriginalRows(dataRaw?.map(mapDataToMotifTableRow));
  }
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
  // isSelected is derived here, fresh, from selectedIds — never stored on originalRows itself.
  const visibleRows = useMemo(() => {
    const sliced =
      pagination && totalRecords === undefined
        ? usableRows?.slice((currentPage - 1) * pagination.rowsPerPage, currentPage * pagination.rowsPerPage)
        : usableRows;
    return sliced?.map(row => ({ ...row, isSelected: selectedIds.has(getRowId(row)) }));
  }, [currentPage, usableRows, pagination, totalRecords, selectedIds, getRowId]);

  const spannedCellsMap = useMemo(() => getSpannedCellsMap(columns, visibleRows), [columns, visibleRows]);

  const selectHandler = useCallback(
    ({ row, all }: { row?: RowDetail; all?: "select" | "deselect" }) => {
      const next = new Set(selectedIds);

      if (all === "select") {
        const changedIds = (visibleRows ?? []).map(getRowId);
        changedIds.forEach(id => next.add(id));
        setSelectedIds(next);
        onSelectionChange?.(changedIds, true, Array.from(next));
      } else if (all === "deselect") {
        const changedIds = (visibleRows ?? []).map(getRowId);
        changedIds.forEach(id => next.delete(id));
        setSelectedIds(next);
        onSelectionChange?.(changedIds, false, Array.from(next));
      } else if (row) {
        const id = getRowId(row);
        const selected = !selectedIds.has(id);
        selected ? next.add(id) : next.delete(id);
        setSelectedIds(next);
        onSelectionChange?.([id], selected, Array.from(next));
      }
    },
    [selectedIds, visibleRows, getRowId, onSelectionChange],
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

  const applyFilter = useCallback(
    (forceImmediate?: boolean) => {
      if (mainFilterInputValueRef.current === appliedMainFilterQuery) return;
      setAppliedMainFilterQuery(mainFilterInputValueRef.current);
      setCurrentPage(1);
      onFilterChange?.(mainFilterInputValueRef.current, forceImmediate ?? disableFilterOnKeyPress);
    },
    [appliedMainFilterQuery, onFilterChange, disableFilterOnKeyPress],
  );

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
      onPageChange,
      pagination,
      selectable,
      selectHandler,
      filterableTable,
      filterPlaceholder,
      disableFilterOnKeyPress,
      filterableColumns: columns.some(c => c.filter),
      updateFilterState,
      totalRecords: totalRecords ?? originalRows?.length ?? 0,
      explicitTotalRecords: totalRecords,
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
      onPageChange,
      pagination,
      selectable,
      selectHandler,
      filterableTable,
      filterPlaceholder,
      disableFilterOnKeyPress,
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
