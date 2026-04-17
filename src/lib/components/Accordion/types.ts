import { ReactElement } from "react";

export type AccordionGroupProps = {
  multiExpand?: boolean;
  condensed?: boolean;
  children: (ReactElement<AccordionProps> | null | boolean)[];
};

export type AccordionGroupContextProps = {
  groupEnabled: boolean;
  multiExpand?: boolean;
  expandedIndex?: number;
  setExpandedIndex?: (index: number) => void;
};

export type AccordionProps = {
  title: string;
  index?: number;
  text?: string;
  icon?: string | ReactElement;
  onToggle?: () => void;
} & AccordionDefaultableProps;

export type AccordionDefaultableProps = {
  expanded?: boolean;
};
