"use client";

import styles from "./Offcanvas.module.scss";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import useDomReady from "../../hooks/useDomReady";
import { PropsWithRefAndChildren } from "../../types";
import { OffcanvasProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { MotifIconButton } from "@/components/Motif/Icon";

const Offcanvas = (props: PropsWithRefAndChildren<OffcanvasProps, HTMLDivElement>) => {
  const {
    title,
    open,
    onClose,
    children,
    position = "left",
    size = "md",
    closable = true,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Offcanvas", props);

  const domReady = useDomReady();
  const [visible, setVisible] = useState(open);
  const [attached, setAttached] = useState(open);

  const handleCloseWithAnimation = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setAttached(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  const offcanvasRef = useOutsideClick<HTMLDivElement>(() => closable && handleCloseWithAnimation());

  useEffect(() => {
    if (open) {
      setAttached(true);
      setTimeout(() => setVisible(true), 50);
    } else {
      attached && handleCloseWithAnimation();
    }
  }, [open, attached, handleCloseWithAnimation]);

  const classNames = sanitizeModuleRootClasses(styles, className, [visible && "show", position, size]);

  return (
    attached &&
    domReady &&
    createPortal(
      <div data-testid="offcanvasBackdrop" className={classNames} style={style} ref={ref}>
        <div className={styles.offcanvas} ref={offcanvasRef}>
          {(title || closable) && (
            <div className={styles.header}>
              {title && <span className={styles.headerTitle}>{title}</span>}
              {closable && <MotifIconButton name="close" onClick={onClose} size={size} className={styles.closeButton} />}
            </div>
          )}
          <div className={styles.content}>{children}</div>
        </div>
      </div>,
      document.body,
    )
  );
};

Offcanvas.displayName = "Offcanvas";
export default Offcanvas;
