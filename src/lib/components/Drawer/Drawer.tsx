"use client";

import styles from "./Drawer.module.scss";
import { createPortal } from "react-dom";
import useModalOverlay from "../../hooks/useModalOverlay";
import { PropsWithRefAndChildren } from "../../types";
import { DrawerProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { MotifIconButton } from "@/components/Motif/Icon";

const Drawer = (props: PropsWithRefAndChildren<DrawerProps, HTMLDivElement>) => {
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
  } = usePropsWithThemeDefaults("Drawer", props);

  const { attached, visible, hide, rootRef, dialogRef, insideProps } = useModalOverlay<HTMLElement>({
    open: !!open,
    rootRef: ref,
    onClose,
    onAfterClose,
    duration: 300,
    closeOnOutsideClick: closable,
    closeOnEscape: closable,
  });

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
      <div data-testid="drawerBackdrop" className={classNames} style={style} ref={rootRef}>
        <aside className={styles.drawer} ref={dialogRef} tabIndex={-1} {...insideProps}>
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

Drawer.displayName = "Drawer";
export default Drawer;
