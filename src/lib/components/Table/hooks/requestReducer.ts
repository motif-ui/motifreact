import { Filters, Sort } from "@/components/Table/hooks/types";

export type RequestState = {
  page: number;
  sort: Sort;
  filters: Filters;
  debouncedFilters: Filters;
  pageResetPending: boolean;
};

export type RequestAction =
  | { type: "setPage"; page: number }
  | { type: "sort"; sort: Sort }
  | { type: "filter"; query: string; immediate?: boolean }
  | { type: "columnFilter"; dataKey: string; query: string }
  | { type: "debounceElapsed" };

export const requestReducer = (state: RequestState, action: RequestAction): RequestState => {
  const { filters, debouncedFilters } = state;

  switch (action.type) {
    case "setPage":
      return { ...state, page: action.page };
    case "sort":
      return { ...state, sort: action.sort, page: 1 };
    case "filter": {
      const nextFilters = { ...filters, main: action.query };
      return action.immediate
        ? { ...state, filters: nextFilters, debouncedFilters: nextFilters, page: 1, pageResetPending: false }
        : { ...state, filters: nextFilters, pageResetPending: true };
    }
    case "columnFilter": {
      const nextFilters = { ...filters, columns: { ...filters.columns, [action.dataKey]: action.query } };
      return { ...state, filters: nextFilters, pageResetPending: true };
    }
    case "debounceElapsed": {
      const unchanged =
        filters.main === debouncedFilters.main && JSON.stringify(filters.columns) === JSON.stringify(debouncedFilters.columns);
      if (unchanged && !state.pageResetPending) return state;
      return { ...state, debouncedFilters: filters, page: state.pageResetPending ? 1 : state.page, pageResetPending: false };
    }
  }
};
