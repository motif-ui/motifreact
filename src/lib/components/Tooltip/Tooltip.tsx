"use client";

import { RefObject, useLayoutEffect } from "react";
import { cloneElement, Children, ReactElement, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "./Tooltip.module.scss";
import BrowserPortal from "../../../utils/BrowserPortal";
import { TooltipProps } from "./types";
import { PropsWithRefAndChildren } from "../../types";
import { usePositionTooltip } from "@/components/Tooltip/usePositionTooltip";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

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
    ref: outerRef,
  } = usePropsWithThemeDefaults("Tooltip", props);

  const ref = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLElement | undefined>(undefined);

  const [visible, setVisible] = useState(false);
  const [attached, setAttached] = useState(false);
  useImperativeHandle(outerRef, () => (attached ? ref.current : null) as HTMLDivElement, [attached]);
  const { resetPosition, tryToKeepTooltipInTheScreen, positionStyle, setTooltipPosition, lastTriedPosition } = usePositionTooltip(
    position,
    anchorRef,
    ref,
  );

  const onMouseEnter = useCallback(() => {
    setAttached(true);
    setTooltipPosition();
  }, [setTooltipPosition]);

  const onMouseLeave = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setAttached(false);
      resetPosition();
    }, 250);
  }, [resetPosition]);

  useLayoutEffect(() => {
    const readyToShow = tryToKeepTooltipInTheScreen();
    readyToShow && setVisible(true);
    // "positionStyle" is put into dep. array on purpose. This effect should run only when positionStyle changes
    // eslint-disable-next-line
  }, [positionStyle]);

  useEffect(() => {
    if (!text.length || !anchorRef.current) return;
    const child = anchorRef.current;
    child.addEventListener("mouseenter", onMouseEnter);
    child.addEventListener("mouseleave", onMouseLeave);
    return () => {
      child.removeEventListener("mouseenter", onMouseEnter);
      child.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [onMouseEnter, onMouseLeave, text]);

  useEffect(() => {
    if (!attached) return;
    window.addEventListener("resize", setTooltipPosition);
    return () => window.removeEventListener("resize", setTooltipPosition);
  }, [attached, setTooltipPosition]);

  const classNames = sanitizeModuleRootClasses(styles, className, [size, lastTriedPosition, visible && "visible", variant]);
  const mergedStyle = { ...positionStyle, ...style };

  return (
    <>
      {cloneElement(
        Children.only(children) as ReactElement<{
          ref: RefObject<HTMLElement | undefined>;
        }>,
        { ref: anchorRef },
      )}
      {!!text.length && attached && (
        <BrowserPortal>
          <div className={classNames} data-testid="tooltipItem" style={mergedStyle} ref={ref} role="tooltip">
            <div className={styles.triangle} />
            <div className={styles.textWrapper}>
              {title && <span className={styles.title}>{title}</span>}
              <span className={styles.text}>{text}</span>
            </div>
          </div>
        </BrowserPortal>
      )}
    </>
  );
};

Tooltip.displayName = "Tooltip";
export default Tooltip;
