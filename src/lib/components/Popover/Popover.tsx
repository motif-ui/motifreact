"use client";

import styles from "./Popover.module.scss";
import { useEffect, useRef, useCallback } from "react";
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
  const popoverRef = useRef<HTMLDivElement>(null);
  const { startShowing, startHiding, attached, positionStyle, visible } = usePopoverPosition(anchorRef, popoverRef, placeOn, 300);

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      popoverRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  useEffect(() => {
    if (open) {
      startShowing();
    } else {
      startHiding();
      onClose?.();
    }
  }, [onClose, open, startHiding, startShowing]);

  useEffect(() => {
    const handleResize = () => {
      if (attached) {
        onClose?.();
        startHiding(true);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [attached, onClose, startHiding]);

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
