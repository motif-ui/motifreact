import type { ReactElement } from "react";

export type BreadcrumbProps = {
  items: { label: string; path?: string }[];
} & BreadcrumbDefaultableProps;

export type BreadcrumbDefaultableProps = {
  homeIcon?: string | ReactElement;
  maxVisibleItems?: number;
  collapsedPosition?: "left" | "right";
};
