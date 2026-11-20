import type { IconGlobalType, VariantV2 } from "../../types";

export type TimelineVariant = VariantV2;
export type TimelineMarkerType = "dot" | "number" | "icon";

export type TimelineItemProps = {
  title?: string;
  content?: string;
  icon?: IconGlobalType;
  variant?: TimelineVariant;
  disabled?: boolean;
  appearance?: "filled" | "outlined";
};

export type TimelineDefaultableProps = {
  markerType?: TimelineMarkerType;
  textAlign?: "start" | "center" | "end";
  variant?: TimelineVariant;
};

export type TimelineProps = {
  /**
   * ```
   * {
   *   title?: string;
   *   content?: string;
   *   icon?: IconGlobalType;
   *   variant?: VariantV2;
   *   disabled?: boolean;
   *   appearance?: string;
   * }[]
   * ```
   */
  items: TimelineItemProps[];
  orientation?: "vertical" | "horizontal";
  contentPosition?: "before" | "after" | "alternate";
} & TimelineDefaultableProps;
