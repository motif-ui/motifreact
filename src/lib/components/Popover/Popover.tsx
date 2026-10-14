"use client";

import styles from "./Popover.module.scss";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { PropsWithRefAndChildren } from "../../types";
import useAnchoredOverlay from "../../hooks/useAnchoredOverlay";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { mergeRefs } from "../../../utils/reactUtils";
import { PopoverProps } from "./types";

const Popover = (props: PropsWithRefAndChildren<PopoverProps, HTMLDivElement>) => {
  const {
    anchorRef,
    children,
    open,
    defaultOpen,
    onClose,
    closeOnOutsideClick,
    closeOnEscape,
    closeOnScroll,
    variant = "light",
    placeOn = "bottom",
    spacing = "callout",
    elevated,
    ref,
    className,
    style,
  } = usePropsWithThemeDefaults("Popover", props);
  const uncontrolled = open === undefined;
  const {
    attached,
    visible,
    style: positionStyle,
    placement,
    overlayRef: popoverRef,
    insideProps,
  } = useAnchoredOverlay({
    anchorRef,
    placement: placeOn,
    limitWidth: true,
    toggleOnAnchorClick: uncontrolled,
    open,
    defaultOpen,
    onClose,
    duration: 300,
    closeOnOutsideClick: closeOnOutsideClick ?? uncontrolled,
    closeOnEscape: closeOnEscape ?? uncontrolled,
    closeOnScroll,
  });

  const mergedRef = useMemo(() => mergeRefs(popoverRef, ref), [popoverRef, ref]);

  const caretSpot = placeOn.endsWith("Left") ? "caretLeft" : placeOn.endsWith("Right") ? "caretRight" : "caretCenter";
  const classNames = sanitizeModuleRootClasses(styles, className, [
    spacing,
    placement,
    caretSpot,
    variant,
    visible && "visible",
    elevated && "elevated",
    typeof children === "string" && "justText",
  ]);

  return (
    attached &&
    createPortal(
      <div className={classNames} style={{ ...style, ...positionStyle }} ref={mergedRef} data-testid="popover" {...insideProps}>
        <div className={styles.popover}>{children}</div>
      </div>,
      document.body,
    )
  );
};

export default Popover;
