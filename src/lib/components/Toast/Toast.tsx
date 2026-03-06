"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Toast.module.scss";
import Icon from "@/components/Icon";
import { MotifIconButton } from "@/components/Motif/Icon";
import useTimeout from "../../hooks/useTimeout";
import { PropsWithRef } from "../../types";
import { ToastProps } from "@/components/Toast/types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import ProgressBar from "@/components/ProgressBar";

const Toast = (props: PropsWithRef<ToastProps, HTMLDivElement>) => {
  const {
    variant: toastVariant,
    title,
    content,
    duration,
    closable,
    icon,
    onDismiss,
    position,
    maxContentLength,
    ref,
    id,
    style,
    className,
  } = props;
  const variant = toastVariant === "error" ? "danger" : toastVariant;

  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const closingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toastClasses = sanitizeModuleRootClasses(styles, className, [variant, closing && "closing"]);

  const handleDismiss = useCallback(() => {
    setClosing(true);
    closingTimeoutRef.current = setTimeout(() => {
      setDismissed(true);
      onDismiss(id, position);
    }, 300);
  }, [id, position, onDismiss]);

  const timer = useTimeout(handleDismiss, duration);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const clear = () => {
      closingTimeoutRef.current && clearTimeout(closingTimeoutRef.current);
      timer.clear();
    };

    if (closable) {
      timer.start();
      return () => {
        clear();
      };
    } else {
      clear();
    }
  }, [closable, duration, timer]);

  const handleEnter = useCallback(() => {
    timer.pause();
    setPaused(true);
  }, [timer]);

  const handleLeave = useCallback(() => {
    timer.start();
    setPaused(false);
  }, [timer]);

  const handlers = useMemo(
    () =>
      closable && {
        onMouseEnter: handleEnter,
        onMouseLeave: handleLeave,
        onTouchStart: handleEnter,
        onTouchEnd: handleLeave,
      },
    [closable, handleEnter, handleLeave],
  );

  return (
    !dismissed && (
      <div ref={ref} className={toastClasses} data-testid="toast" style={style} {...handlers}>
        {icon && <Icon name={icon} className={styles.icon} variant={variant} size="xxl" />}

        <div className={styles.contentContainer}>
          {title && <span className={styles.title}>{title}</span>}
          <span className={styles.content}>
            {maxContentLength !== undefined && maxContentLength > 0 && maxContentLength < content.length
              ? content.substring(0, maxContentLength).concat("...")
              : content}
          </span>
        </div>

        {closable && <MotifIconButton name="close" onClick={handleDismiss} size="lg" />}

        <ProgressBar size="sm" variant={variant} className={styles.progress} countdown={{ duration, paused }} />
      </div>
    )
  );
};

Toast.displayName = "Toast";
export default Toast;
