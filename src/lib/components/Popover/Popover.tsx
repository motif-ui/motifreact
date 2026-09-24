"use client";

import styles from "./Popover.module.scss";
import { useCallback } from "react";
import { createPortal } from "react-dom";
import { PropsWithRefAndChildren } from "../../types";
import { usePopoverPosition } from "./hooks/usePopoverPosition";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { PopoverProps } from "./types";

const Popover = (props: PropsWithRefAndChildren<PopoverProps, HTMLDivElement>) => {
  const {
    anchorRef,
    children,
    open,
    onClose,
    variant = "light",
    placeOn = "bottom",
    spacing = "callout",
    elevated,
    ref,
    className,
    style,
  } = usePropsWithThemeDefaults("Popover", props);
  const { attached, visible, positionStyle, popoverRef } = usePopoverPosition(anchorRef, placeOn, open, onClose);

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      popoverRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [popoverRef, ref],
  );

  const classNames = sanitizeModuleRootClasses(styles, className, [
    spacing,
    placeOn,
    variant,
    visible && "visible",
    elevated && "elevated",
    typeof children === "string" && "justText",
  ]);

  return (
    attached &&
    createPortal(
      <div className={classNames} style={{ ...style, ...positionStyle }} ref={mergedRef} data-testid="popover">
        <div className={styles.popover}>{children}</div>
      </div>,
      document.body,
    )
  );
};

export default Popover;
