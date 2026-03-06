import { Size3 } from "../../types";

export type PaginationDefaultableProps = {
  size?: Size3;
};

export type PaginationProps = PaginationDefaultableProps & {
  total: number;
  current: number;
  pageSize: number;
  onChange?: (page: number) => void;
};
