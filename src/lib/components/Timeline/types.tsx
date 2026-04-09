export type TimelineVariant = "primary" | "danger" | "success" | "warning" | "light" | "secondary";
export type TimelineMarkerType = "dot" | "number" | "icon";

export type TimelineItemProps = {
  title?: string;
  content?: string;
  icon?: string;
  variant?: TimelineVariant;
  disabled?: boolean;
  appearance?: "filled" | "outlined";
};

export type TimelineDefaultableProps = {
  markerType?: "dot" | "number" | "icon";
  textAlign?: "start" | "center" | "end";
  variant?: TimelineVariant;
};

export type TimelineProps = {
  /**
   * ```
   * {
   *   title?: string;
   *   content?: string;
   *   icon?: string;
   *   variant?: string;
   *   disabled?: boolean;
   *   appearance?: string;
   * }[]
   * ```
   */
  items: TimelineItemProps[];
  orientation?: "vertical" | "horizontal";
  contentPosition?: "before" | "after" | "alternate";
} & TimelineDefaultableProps;
