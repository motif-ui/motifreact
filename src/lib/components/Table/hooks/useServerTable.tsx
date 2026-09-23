"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { getValueByChainedKey } from "src/utils/utils";
import { Fetcher, Sort, UseServerTableOptions } from "@/components/Table/hooks/types";
import { requestReducer } from "@/components/Table/hooks/requestReducer";

const createUrlFetcher =
  <T,>({ url, method = "GET", queryStringKeys = {}, itemsKey, totalCount = {} }: UseServerTableOptions): Fetcher<T> =>
  async ({ page, pageSize, sort, filters, signal }) => {
    const { page: pageKey, pageSize: pageSizeKey, sortBy, sortOrder, query: queryKey, columnFilter } = queryStringKeys;
    const { dataKey: sortKey, direction } = sort;
    const { main, columns } = filters;

    const params = new URLSearchParams();
    if (pageSize != null && pageKey && pageSizeKey) {
      params.set(pageKey, String(page));
      params.set(pageSizeKey, String(pageSize));
    }
    if (sortKey && direction && sortBy && sortOrder) {
      params.set(sortBy, sortKey);
      params.set(sortOrder, direction);
    }
    main && queryKey && params.set(queryKey, main);
    columnFilter &&
      Object.entries(columns)
        .filter(([, value]) => value)
        .forEach(([columnKey, value]) => params.set(columnFilter(columnKey), value));

    const response = await fetch(method === "GET" ? `${url}?${params}` : `${url}`, {
      method,
      ...(method === "POST" && {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(params.entries())),
      }),
      signal,
    });
    if (!response.ok) throw new Error(`useServerTable: request to ${response.url} failed with status ${response.status}`);

    const body = (await response.json()) as object;
    const data = (itemsKey ? getValueByChainedKey<T[] | undefined>(body, itemsKey) : (body as T[])) ?? [];
    const { bodyKey, headerKey } = totalCount;
    const totalRecords = bodyKey
      ? Number(getValueByChainedKey(body, bodyKey))
      : headerKey
        ? Number(response.headers.get(headerKey))
        : data.length;

    return { data, totalRecords };
  };

const useServerTable = <T,>(options: UseServerTableOptions = {}, fetcher?: Fetcher<T>) => {
  const { url, pageSize, filterKeyPressRequestDelay = 500 } = options;
  if (!fetcher && !url) throw new Error("useServerTable: provide either `options.url` or a `fetcher`.");

  const [{ page, sort, filters, debouncedFilters }, dispatch] = useReducer(requestReducer, {
    page: 1,
    sort: {},
    filters: { main: "", columns: {} },
    debouncedFilters: { main: "", columns: {} },
  });
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [data, setData] = useState<T[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const resolvedFetcher = fetcher ?? createUrlFetcher<T>(options);
  const fetcherRef = useRef(resolvedFetcher);
  fetcherRef.current = resolvedFetcher;

  useEffect(() => {
    debounceTimeoutRef.current = setTimeout(() => dispatch({ type: "debounceElapsed" }), filterKeyPressRequestDelay);
    return () => clearTimeout(debounceTimeoutRef.current);
  }, [filters, filterKeyPressRequestDelay]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);

    fetcherRef
      .current({ page, pageSize, sort, filters: debouncedFilters, signal })
      .then(result => {
        if (!signal.aborted) {
          setData(result.data);
          setTotalRecords(result.totalRecords);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") throw error;
      })
      .finally(() => {
        !signal.aborted && setLoading(false);
      });

    return () => controller.abort();
  }, [page, pageSize, sort, debouncedFilters]);

  const onPageChange = useCallback((newPage: number) => dispatch({ type: "setPage", page: newPage }), []);

  const onSortChange = useCallback((newSort: Sort) => dispatch({ type: "sort", sort: newSort }), []);

  const onFilterChange = useCallback((query: string, immediate?: boolean) => {
    if (immediate) clearTimeout(debounceTimeoutRef.current);
    dispatch({ type: "filter", query, immediate });
  }, []);

  const onColumnFilterChange = useCallback(({ dataKey, query }: { dataKey?: string; query: string }) => {
    dataKey && dispatch({ type: "columnFilter", dataKey, query });
  }, []);

  return { data, totalRecords, loading, page, onPageChange, onSortChange, onFilterChange, onColumnFilterChange };
};

export default useServerTable;
