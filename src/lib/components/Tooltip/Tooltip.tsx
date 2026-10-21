"use client";

import { cloneElement, Children, ReactElement, RefObject, useEffect, useMemo, useRef } from "react";
import styles from "./Tooltip.module.scss";
import { createPortal } from "react-dom";
import { TooltipProps } from "./types";
import { PropsWithRefAndChildren } from "../../types";
import useAnchoredOverlay from "../../hooks/useAnchoredOverlay";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { mergeRefs } from "../../../utils/reactUtils";

const Tooltip = (props: PropsWithRefAndChildren<TooltipProps, HTMLDivElement>) => {
  const {
    text,
    title,
    size = "md",
    position = "top",
    variant = "light",
    children,
    style,
    className,
    ref,
  } = usePropsWithThemeDefaults("Tooltip", props);

  const anchorRef = useRef<HTMLElement>(null);
  const {
    attached,
    visible,
    style: positionStyle,
    placement,
    overlayRef: tooltipRef,
    show,
    hide,
  } = useAnchoredOverlay({ anchorRef, placement: position, limitWidth: true, duration: 250 });

  const mergedRef = useMemo(() => mergeRefs(tooltipRef, ref), [tooltipRef, ref]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!text.length || !anchor) return;
    const onMouseLeave = () => hide();
    anchor.addEventListener("mouseenter", show);
    anchor.addEventListener("mouseleave", onMouseLeave);
    return () => {
      anchor.removeEventListener("mouseenter", show);
      anchor.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [show, hide, text]);

  // The spot of the anchor that the triangle points to: the edge or the center that the position asks for.
  // It is kept when the tooltip is flipped to the other alignment or shifted to stay in the screen.
  const triangleSpot = position.endsWith("Left") ? "triangleLeft" : position.endsWith("Right") ? "triangleRight" : "triangleCenter";
  const classNames = sanitizeModuleRootClasses(styles, className, [size, placement, triangleSpot, visible && "visible", variant]);

  return (
    <>
      {cloneElement(Children.only(children) as ReactElement<{ ref: RefObject<HTMLElement | null> }>, { ref: anchorRef })}
      {!!text.length &&
        attached &&
        createPortal(
          <div className={classNames} data-testid="tooltipItem" style={{ ...style, ...positionStyle }} ref={mergedRef} role="tooltip">
            <div className={styles.triangle} />
            <div className={styles.textWrapper}>
              {title && <span className={styles.title}>{title}</span>}
              <span className={styles.text}>{text}</span>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

Tooltip.displayName = "Tooltip";
export default Tooltip;
