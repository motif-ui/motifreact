import { Dispatch, ReactNode, SetStateAction } from "react";

export type TableProps<T = object> = {
  columns: Column[];
  data?: T[];
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  footer?: () => ReactNode;
  loading?: boolean;
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
};

export type Sorting = {
  desc?: boolean;
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
  showFixedRowNumbers?: boolean;
  pagination?: Pagination;
  selectable?: boolean;
  selectionKey?: string;
  onSelect?: (selection: { all: object[]; current?: object }) => void;
  filterableTable?: boolean;
  reflectDataChanges?: boolean;
  rowColorCallback?: (rowData: object) => RowColor | undefined;
};

export type TableContextType = {
  originalRows?: RowDetail[];
  usableRows?: RowDetail[];
  visibleRows?: RowDetail[];
  totalRecords: number;
  columns: Column[];
  updateSortState: (columnIndex: number) => void;
  columnStates: ColumState[];
  showFixedRowNumbers?: boolean;
  currentPage: number;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  pagination?: Pagination;
  selectable?: boolean;
  selectHandler?: (selection: { row?: RowDetail; all?: "select" | "deselect" }) => void;
  filterableTable?: boolean;
  filterableColumns?: boolean;
  updateFilterState: (query: string, columnIndex?: number) => void;
  setMainFilterQuery: (query: string) => void;
  numberOfVisibleColumns: number;
  rowColorCallback?: (rowData: object) => RowColor | undefined;
};

export type ColumState = {
  lastSortDirection?: "asc" | "desc";
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
  setMainFilterQuery: () => {},
  columns: [],
  columnStates: [],
  currentPage: 1,
  numberOfVisibleColumns: 0,
};

//
//
// Other
//

export type RowColor = "primary" | "secondary" | "light" | "success" | "danger" | "warning" | "info";
