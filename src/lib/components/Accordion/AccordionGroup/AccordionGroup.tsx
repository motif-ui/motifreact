"use client";
import { createContext, useState } from "react";
import styles from "../Accordion.module.scss";
import { AccordionGroupContextProps, AccordionGroupProps } from "@/components/Accordion/types";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

export const AccordionGroupContext = createContext<AccordionGroupContextProps>({ groupEnabled: false });

const AccordionGroup = (props: PropsWithRef<AccordionGroupProps, HTMLDivElement>) => {
  const { children, multiExpand, condensed, ref } = props;
  const [expandedIndex, setExpandedIndex] = useState<number>();
  const classNames = sanitizeModuleClasses(styles, "group", condensed && "group_condensed");

  return (
    <div className={classNames} ref={ref}>
      <AccordionGroupContext value={{ expandedIndex, multiExpand, setExpandedIndex, groupEnabled: true }}>{children}</AccordionGroupContext>
    </div>
  );
};

AccordionGroup.displayName = "AccordionGroup";
export default AccordionGroup;
