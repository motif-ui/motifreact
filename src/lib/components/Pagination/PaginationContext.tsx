import { createContext, useContext } from "react";

export type PaginationContextType = {
  currentPage: number;
  numberOfPages: number;
  onPageChange: (page: number) => void;
};

export const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);
  if (!context) throw new Error("usePaginationContext must be used within PaginationContext");

  return context;
};
