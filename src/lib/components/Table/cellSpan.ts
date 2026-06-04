import { Column, RowDetail } from "@/components/Table/types";

export type ResolvedCellSpan = {
  colSpan: number;
  rowSpan: number;
};

export type SpannedCellKey = `${number}-${number}`;
export type SpannedCellsMap = Map<SpannedCellKey, ResolvedCellSpan | undefined>;

export type RenderableColumn = {
  column: Column;
  index: number;
  colSpan?: number;
};

const clampSpanValue = (span: number | undefined, maxSpan?: number): number => {
  if (!span || !Number.isFinite(span)) return 1;
  const clamped = Math.max(Math.floor(span), 1);
  return maxSpan ? Math.min(clamped, Math.max(Math.floor(maxSpan), 1)) : clamped;
};

export const resolveCellSpan = (
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

  rows.forEach(row => {
    columns.forEach((column, colIndex) => {
      const cellKey: SpannedCellKey = `${row.motifIndex}-${colIndex}`;
      if (map.has(cellKey)) return;

      const remainingRowsCount = rows.filter(r => r.motifIndex >= row.motifIndex).length;
      const span = resolveCellSpan(column, row.data, {
        maxColSpan: columns.length - colIndex,
        maxRowSpan: remainingRowsCount,
      });
      const { colSpan, rowSpan } = span;
      map.set(cellKey, span);

      for (let c = 1; c < colSpan; c++) {
        map.set(`${row.motifIndex}-${colIndex + c}`, undefined);
      }

      for (let r = 1; r < rowSpan; r++) {
        for (let c = 0; c < colSpan; c++) {
          map.set(`${row.motifIndex + r}-${colIndex + c}`, undefined);
        }
      }
    });
  });

  return map;
};
