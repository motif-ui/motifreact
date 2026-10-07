import { SortDirection } from "@/components/Table/types";

export type Sort = { dataKey?: string; direction?: SortDirection };
export type Filters = { main: string; columns: Record<string, string> };

export type FetchState = { page: number; pageSize?: number; sort: Sort; filters: Filters; signal: AbortSignal };
export type FetchResult<T> = { data: T[]; totalRecords: number };
export type Fetcher<T> = (state: FetchState) => Promise<FetchResult<T>>;

/**
 * Query string key names for page/sort/filter values. Every field is independently optional and has no
 * default — a value (or pair, for `page`/`pageSize` and `sortBy`/`sortOrder`) is only ever sent when its
 * key name is actually configured here.
 */
export type QueryStringKeys = {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortOrder?: string;
  query?: string;
  columnFilter?: (dataKey: string) => string;
};

export type UseServerTableOptions = {
  /** Base request URL for the default fetch implementation. Ignored when a `fetcher` is given. */
  url?: string;
  /** HTTP method for the default fetch implementation. GET sends the built params as a query string, POST as a JSON body. Defaults to "GET". */
  method?: "GET" | "POST";
  /** Query string key names for page/sort/filter values. Every field is independently optional — nothing is sent unless its key name is configured. */
  queryStringKeys?: QueryStringKeys;
  /** Dotted path to the rows array inside the response body, if the body isn't a bare array. */
  itemsKey?: string;
  /** Where the total record count comes from — pick one. Neither has a default; without either, total falls back to `data.length`. */
  totalCount?: { bodyKey?: string; headerKey?: string };
  /** The page size to request. Without it, no pagination query string params are sent at all. */
  pageSize?: number;
  /** Debounce delay, in milliseconds, before a filter keystroke triggers a request. Defaults to 500. */
  filterKeyPressRequestDelay?: number;
};
