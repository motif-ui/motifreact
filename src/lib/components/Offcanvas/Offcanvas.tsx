"use client";

import styles from "./Offcanvas.module.scss";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import useModalOverlay from "../../hooks/useModalOverlay";
import { PropsWithRef } from "../../types";
import { OffcanvasProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { mergeRefs } from "../../../utils/reactUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { MotifIconButton } from "@/components/Motif/Icon";

const Offcanvas = (props: PropsWithRef<OffcanvasProps, HTMLDivElement>) => {
  const {
    title,
    open,
    onClose,
    onAfterClose,
    children,
    position = "left",
    size = "md",
    closable,
    removeBackdrop,
    includePadding,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Offcanvas", props);

  const { attached, visible, hide, rootRef, dialogRef, insideProps } = useModalOverlay<HTMLElement>({
    open: !!open,
    onClose,
    onAfterClose,
    duration: 300,
    closeOnOutsideClick: closable,
    closeOnEscape: closable,
  });
  const mergedRef = useMemo(() => mergeRefs(rootRef, ref), [rootRef, ref]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    visible && "show",
    position,
    size,
    removeBackdrop && "removeBackdrop",
    includePadding && "includePadding",
  ]);

  return (
    attached &&
    createPortal(
      <div data-testid="offcanvasBackdrop" className={classNames} style={style} ref={mergedRef}>
        <aside className={styles.offcanvas} ref={dialogRef} tabIndex={-1} {...insideProps}>
          {(title || closable) && (
            <div className={styles.header}>
              {title && <span className={styles.headerTitle}>{title}</span>}
              {closable && <MotifIconButton name="close" onClick={() => hide("closeButton")} size="lg" className={styles.closeButton} />}
            </div>
          )}
          <div className={styles.content}>{children}</div>
        </aside>
      </div>,
      document.body,
    )
  );
};

Offcanvas.displayName = "Offcanvas";
export default Offcanvas;
