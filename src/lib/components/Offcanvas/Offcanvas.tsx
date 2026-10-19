"use client";

import styles from "./Offcanvas.module.scss";
import { createPortal } from "react-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import useDomReady from "../../hooks/useDomReady";
import useVisibilityTransition from "../../hooks/useVisibilityTransition";
import { PropsWithRef } from "../../types";
import { OffcanvasProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { MotifIconButton } from "@/components/Motif/Icon";

const Offcanvas = (props: PropsWithRef<OffcanvasProps, HTMLDivElement>) => {
  const {
    title,
    open,
    onClose,
    children,
    position = "left",
    size = "md",
    closable = true,
    hideBackdrop,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Offcanvas", props);

  const domReady = useDomReady();
  const { attached, visible } = useVisibilityTransition(!!open, 300);

  const offcanvasRef = useOutsideClick<HTMLDivElement>(() => closable && onClose?.());

  const classNames = sanitizeModuleRootClasses(styles, className, [visible && "show", position, size, hideBackdrop && "hideBackdrop"]);

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
