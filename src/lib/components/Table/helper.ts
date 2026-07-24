import { Column, RowDetail, ResolvedCellSpan, RenderableColumn, SpannedCellKey, SpannedCellsMap } from "@/components/Table/types";
import { getValueByChainedKey } from "src/utils/utils";

// Constants
export const SORT_DIRECTIONS: ("asc" | "desc" | undefined)[] = ["asc", "desc", undefined] as const;

// Cell Span Utils
const clampSpanValue = (span: number | undefined, maxSpan?: number): number => {
  if (!span || !Number.isFinite(span)) return 1;
  const clamped = Math.max(Math.floor(span), 1);
  return maxSpan != null ? Math.min(clamped, Math.max(Math.floor(maxSpan), 1)) : clamped;
};

const resolveCellSpan = (
  column: Column,
  rowData: object,
  limits?: {
    maxColSpan?: number;
    maxRowSpan?: number;
  },
): ResolvedCellSpan => ({
  colSpan: clampSpanValue(typeof column.colSpan === "function" ? column.colSpan(rowData) : column.colSpan, limits?.maxColSpan),
  rowSpan: clampSpanValue(typeof column.rowSpan === "function" ? column.rowSpan(rowData) : column.rowSpan, limits?.maxRowSpan),
});

export const getColSpan = (column: Column, maxColSpan?: number) => {
  if (typeof column.colSpan !== "number") return undefined;

  const colSpan = clampSpanValue(column.colSpan, maxColSpan);
  return colSpan > 1 ? colSpan : undefined;
};

export const getSpanProps = (colSpan?: number, rowSpan?: number) => ({
  ...(colSpan && colSpan > 1 ? { colSpan } : {}),
  ...(rowSpan && rowSpan > 1 ? { rowSpan } : {}),
});

export const getRenderableHeaderColumns = (columns: Column[]) => {
  const renderableColumns: RenderableColumn[] = [];

  for (let index = 0; index < columns.length; index++) {
    if (renderableColumns.length) {
      const previousColumn = renderableColumns[renderableColumns.length - 1];
      if (previousColumn.index + (previousColumn.colSpan ?? 1) > index) continue;
    }

    renderableColumns.push({
      column: columns[index],
      index,
      colSpan: getColSpan(columns[index], columns.length - index),
    });
  }

  return renderableColumns;
};

export const getSpannedCellsMap = (columns: Column[], rows?: RowDetail[]): SpannedCellsMap => {
  const map = new Map<SpannedCellKey, ResolvedCellSpan | undefined>();
  if (!rows) return map;

  rows.forEach((row, rowIndex) => {
    const remainingRowsCount = rows.length - rowIndex;
    columns.forEach((column, colIndex) => {
      const cellKey: SpannedCellKey = `${rowIndex}-${colIndex}`;
      if (map.has(cellKey)) return;

      const span = resolveCellSpan(column, row.data, {
        maxColSpan: columns.length - colIndex,
        maxRowSpan: remainingRowsCount,
      });
      const { colSpan, rowSpan } = span;
      map.set(cellKey, span);

      for (let c = 1; c < colSpan; c++) {
        map.set(`${rowIndex}-${colIndex + c}`, undefined);
      }

      for (let r = 1; r < rowSpan; r++) {
        for (let c = 0; c < colSpan; c++) {
          map.set(`${rowIndex + r}-${colIndex + c}`, undefined);
        }
      }
    });
  });

  return map;
};

export const hasRowSpan = (spannedCellsMap: SpannedCellsMap): boolean => {
  let found = false;
  spannedCellsMap.forEach(span => {
    if (span && span.rowSpan > 1) found = true;
  });
  return found;
};

export const getRowStripeGroups = (spannedCellsMap: SpannedCellsMap, rowCount: number): number[] => {
  const continuationRows = new Set<number>();

  spannedCellsMap.forEach((span, key) => {
    if (!span || span.rowSpan <= 1) return;

    const rowIndex = Number(key.split("-")[0]);
    for (let r = 1; r < span.rowSpan; r++) {
      continuationRows.add(rowIndex + r);
    }
  });

  const groups: number[] = [];
  let group = 0;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    if (rowIndex > 0 && !continuationRows.has(rowIndex)) group++;
    groups[rowIndex] = group;
  }

  return groups;
};

// Sorting Utils
export const sortByType = (a: unknown, b: unknown, type: string) => {
  switch (type) {
    case "string":
      return sortStrings(a as string, b as string);
    case "number":
      return sortNumbers(a as number, b as number);
    case "boolean":
      return sortBoolean(a as boolean, b as boolean);
    case "object":
      return sortObjects(a, b);
    default:
      return 0;
  }
};

const sortStrings = (s1: string, s2: string) => s1.localeCompare(s2);

const sortNumbers = (n1: number, n2: number) => n1 - n2;

const sortBoolean = (b1: boolean, b2: boolean) => (b1 === b2 ? 0 : b1 ? 1 : -1);

const sortObjects = (a: unknown, b: unknown) => {
  if (!a || !b) {
    return a === b ? 0 : !a ? -1 : 1;
  }
  return 0;
};

// Footer Utils
export const getFooterValue = ({ title, dataKey, footer }: Column, originalRows: RowDetail[] | undefined) => {
  const { type } = footer || {};
  switch (type) {
    case "avg":
      return originalRows?.length
        ? (originalRows.reduce((acc, row) => acc + getValueByChainedKey<number>(row.data, dataKey), 0) / originalRows.length).toFixed(2)
        : undefined;
    case "sum":
      return originalRows?.reduce((acc, row) => acc + getValueByChainedKey<number>(row.data, dataKey), 0);
    case "title":
      return title;
    default:
      return undefined;
  }
};
