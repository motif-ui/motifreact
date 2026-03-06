export type BreadcrumbProps = {
  items: { label: string; path?: string }[];
} & BreadcrumbDefaultableProps;

export type BreadcrumbDefaultableProps = {
  homeIcon?: string;
  maxVisibleItems?: number;
  collapsedPosition?: "left" | "right";
};
