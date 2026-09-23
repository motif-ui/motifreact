import { Dispatch, ReactNode, SetStateAction } from "react";

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

export type TableProps<T = object> = {
  /**
   * ```
   * {
   *   title: string;
   *   dataKey?: string;
   *   sorting?: Sorting;
   *   render?: (data: never) => ReactNode;
   *   footer?: Footer;
   *   width?: string;
   *   filter?: boolean;
   *   filterPlaceholder?: string;
   *   colSpan?: number | ((rowData: object) => number);
   *   rowSpan?: number | ((rowData: object) => number);
   * }[]
   * ```
   */
  columns: Column[];
  data?: T[];
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  footer?: () => ReactNode;
  loading?: boolean;
  totalRecords?: number;
  onSortChange?: (sort: { dataKey?: string; direction?: SortDirection }) => void;
  onFilterChange?: (query: string, immediate?: boolean) => void;
  onColumnFilterChange?: (filter: { dataKey?: string; query: string }) => void;
  onPageChange?: (page: number) => void;
  selectable?: boolean;
  selectionKey?: string;
  onSelect?: (selection: { all: T[]; current?: T }) => void;
  reflectDataChanges?: boolean;
  rowColorCallback?: (rowData: T) => RowColor | undefined;
} & TableDefaultableProps;

export type TableDefaultableProps = {
  border?: "cellBorders" | "rowBorders";
  hoverable?: boolean;
  striped?: boolean;
  headerColsBackground?: RowBackground;
  footerColsBackground?: RowBackground;
  pagination?: Pagination;
  showFixedRowNumbers?: boolean;
  emptyMessage?: ReactNode;
  filterableTable?: boolean;
  filterPlaceholder?: string;
  disableFilterOnKeyPress?: boolean;
  hideTotalRecords?: boolean;
  distributeColsEvenly?: boolean;
  fluid?: boolean;
};

export type Column = {
  title: string;
  dataKey?: string;
  sorting?: Sorting;
  render?: (data: never) => ReactNode;
  footer?: Footer;
  width?: string;
  filter?: boolean;
  filterPlaceholder?: string;
  colSpan?: number | ((rowData: object) => number);
  rowSpan?: number | ((rowData: object) => number);
};

export type Sorting = {
  customSort?: (a: unknown, b: unknown) => number;
};

export type Pagination = {
  rowsPerPage: number;
  position?: "left" | "center" | "right";
};

export type Footer = {
  type?: "sum" | "avg" | "title";
  render?: <T>(data: T) => ReactNode;
  title?: string;
};

export type RowBackground = "transparent" | "solid" | "opposite";

//
//
// TableContext related types
//

export type TableContextProps = {
  columns: Column[];
  dataRaw?: object[];
  totalRecords?: number;
  onSortChange?: (sort: { dataKey?: string; direction?: SortDirection }) => void;
  onFilterChange?: (query: string, immediate?: boolean) => void;
  onColumnFilterChange?: (filter: { dataKey?: string; query: string }) => void;
  onPageChange?: (page: number) => void;
  showFixedRowNumbers?: boolean;
  pagination?: Pagination;
  selectable?: boolean;
  selectionKey?: string;
  onSelect?: (selection: { all: object[]; current?: object }) => void;
  filterableTable?: boolean;
  filterPlaceholder?: string;
  disableFilterOnKeyPress?: boolean;
  reflectDataChanges?: boolean;
  rowColorCallback?: (rowData: object) => RowColor | undefined;
};

export type TableContextType = {
  originalRows?: RowDetail[];
  usableRows?: RowDetail[];
  visibleRows?: RowDetail[];
  totalRecords: number;
  /** The raw `totalRecords` prop, unmerged with any fallback — undefined unless the consumer explicitly set it. */
  explicitTotalRecords?: number;
  columns: Column[];
  spannedCellsMap: SpannedCellsMap;
  updateSortState: (columnIndex: number) => void;
  columnStates: ColumnState[];
  showFixedRowNumbers?: boolean;
  currentPage: number;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  onPageChange?: (page: number) => void;
  pagination?: Pagination;
  selectable?: boolean;
  selectHandler?: (selection: { row?: RowDetail; all?: "select" | "deselect" }) => void;
  filterableTable?: boolean;
  filterPlaceholder?: string;
  disableFilterOnKeyPress?: boolean;
  filterableColumns?: boolean;
  updateFilterState: (query: string, columnIndex?: number) => void;
  mainFilterInputValue: string;
  setMainFilterInputValue: (value: string) => void;
  applyFilter: (forceImmediate?: boolean) => void;
  numberOfVisibleColumns: number;
  rowColorCallback?: (rowData: object) => RowColor | undefined;
};

export type ColumnState = {
  lastSortDirection?: SortDirection;
  filterQuery?: string;
};

export type RowDetail = {
  motifIndex: number;
  isSelected?: boolean;
  data: object;
};

export const TableContextDefaultValues: TableContextType = {
  totalRecords: 0,
  updateSortState: () => {},
  updateFilterState: () => {},
  mainFilterInputValue: "",
  setMainFilterInputValue: () => {},
  applyFilter: () => {},
  columns: [],
  columnStates: [],
  currentPage: 1,
  numberOfVisibleColumns: 0,
  spannedCellsMap: new Map(),
};

//
//
// Other
//

export type RowColor = "primary" | "secondary" | "light" | "success" | "danger" | "warning" | "info";
export type SortDirection = "asc" | "desc";
