"use client";

import styles from "./Popover.module.scss";
import { useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { PropsWithRefAndChildren } from "../../types";
import useAnchoredOverlay from "../../hooks/useAnchoredOverlay";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { PopoverProps } from "./types";

const CARET_OFFSET = 6;

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
  const {
    attached,
    visible,
    style: positionStyle,
    placement,
    overlayRef: popoverRef,
  } = useAnchoredOverlay({ anchorRef, placement: placeOn, open: !!open, onClose, duration: 300 });

  useLayoutEffect(() => {
    // Points the caret to the anchor's center, also when the popover is shifted to stay in the screen
    if (!attached || !popoverRef.current || !anchorRef.current) return;
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const anchorRect = anchorRef.current.getBoundingClientRect();

    if (placement === "left" || placement === "right") {
      popoverRef.current.style.setProperty("--caret-top", `${anchorRect.top + anchorRect.height / 2 - popoverRect.top - CARET_OFFSET}px`);
    } else {
      popoverRef.current.style.setProperty("--caret-left", `${anchorRect.left + anchorRect.width / 2 - popoverRect.left - CARET_OFFSET}px`);
    }
  }, [attached, positionStyle, placement, anchorRef, popoverRef]);

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
    placement,
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
