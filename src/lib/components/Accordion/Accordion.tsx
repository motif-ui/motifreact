"use client";
import { useCallback, useContext, useEffect } from "react";
import styles from "./Accordion.module.scss";
import GlobalIconWrapper from "../Motif/GlobalIconWrapper/GlobalIconWrapper";
import AccordionGroup, { AccordionGroupContext } from "./AccordionGroup/AccordionGroup";
import { AccordionProps } from "./types";
import { PropsWithRefAndChildren } from "../../types";
import { MotifIcon } from "@/components/Motif/Icon";
import useToggle from "../../hooks/useToggle";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const AccordionComponent = (props: PropsWithRefAndChildren<AccordionProps, HTMLDivElement>) => {
  const {
    title,
    expanded = false,
    icon,
    onToggle,
    children,
    text,
    index,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Accordion", props);
  const { expandedIndex, setExpandedIndex, multiExpand, groupEnabled } = useContext(AccordionGroupContext);
  const initialOpen = groupEnabled && !multiExpand ? expandedIndex === index : expanded;
  const { visible: open, toggle } = useToggle(initialOpen);

  if (groupEnabled && index === undefined) {
    throw new Error("Accordion component must have an index prop when used inside AccordionGroup");
  }

  useEffect(() => {
    if (groupEnabled && !multiExpand && index !== undefined) {
      expanded ? setExpandedIndex?.(index) : setExpandedIndex?.(-1);
    } else {
      toggle(expanded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  useEffect(() => {
    if (groupEnabled && !multiExpand && expandedIndex !== undefined) {
      expandedIndex === -1 && expanded ? setExpandedIndex?.(index!) : toggle(expandedIndex === index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedIndex, groupEnabled, index, multiExpand, toggle]);

  const toggleAccordion = useCallback(() => {
    groupEnabled && !multiExpand ? setExpandedIndex?.(open ? -1 : index!) : toggle();
    onToggle?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupEnabled, index, multiExpand, onToggle, open, setExpandedIndex]);

  const classNames = sanitizeModuleRootClasses(styles, className, [open && "expanded"]);

  return (
    <div className={classNames} style={style} ref={ref} data-testid="accordionItem">
      <button type="button" className={styles.header} onClick={toggleAccordion}>
        {icon && <GlobalIconWrapper icon={icon} className={styles.icon} />}
        <span className={styles.title}>{title}</span>
        <MotifIcon className={styles.collapseIcon} size="lg" name="keyboard_arrow_down" />
      </button>
      <div className={styles.content}>
        <div className={styles.contentOverflowContainer}>{text ? <span className={styles.textContent}>{text}</span> : children}</div>
      </div>
    </div>
  );
};

AccordionComponent.displayName = "Accordion";
const Accordion = Object.assign(AccordionComponent, { Group: AccordionGroup });
export default Accordion;
