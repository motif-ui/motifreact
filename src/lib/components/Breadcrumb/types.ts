import type { IconGlobalType } from "../../types";

export type BreadcrumbProps = {
  items: { label: string; path?: string }[];
} & BreadcrumbDefaultableProps;

export type BreadcrumbDefaultableProps = {
  homeIcon?: IconGlobalType;
  maxVisibleItems?: number;
  collapsedPosition?: "left" | "right";
};
