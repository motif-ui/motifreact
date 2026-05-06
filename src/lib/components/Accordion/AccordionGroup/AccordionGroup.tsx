"use client";
import { createContext, useState, Children, isValidElement } from "react";
import styles from "../Accordion.module.scss";
import { AccordionGroupContextProps, AccordionGroupProps, AccordionProps } from "@/components/Accordion/types";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

export const AccordionGroupContext = createContext<AccordionGroupContextProps>({ groupEnabled: false });

const AccordionGroup = (props: PropsWithRef<AccordionGroupProps, HTMLDivElement>) => {
  const { children, multiExpand, condensed, ref } = props;

  const initialExpandedIndex = multiExpand
    ? undefined
    : Children.toArray(children).reduce<number | undefined>(
        (lowest, child) =>
          isValidElement<AccordionProps>(child) &&
          child.props.expanded &&
          child.props.index !== undefined &&
          (lowest === undefined || child.props.index < lowest)
            ? child.props.index
            : lowest,
        undefined,
      );

  const [expandedIndex, setExpandedIndex] = useState<number | undefined>(initialExpandedIndex);
  const classNames = sanitizeModuleClasses(styles, "group", condensed && "group_condensed");

  return (
    <div className={classNames} ref={ref}>
      <AccordionGroupContext value={{ expandedIndex, multiExpand, setExpandedIndex, groupEnabled: true }}>{children}</AccordionGroupContext>
    </div>
  );
};

AccordionGroup.displayName = "AccordionGroup";
export default AccordionGroup;
