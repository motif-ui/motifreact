"use client";

import styles from "./Offcanvas.module.scss";
import "@styles/viewTransitions.scss";
import { startTransition, useEffect, useState, ViewTransition } from "react";
import { createPortal } from "react-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import useDomReady from "../../hooks/useDomReady";
import { PropsWithRef } from "../../types";
import { OffcanvasProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { MotifIconButton } from "@/components/Motif/Icon";
import { BACKDROP_TRANSITION_CLASS, SLIDE_TRANSITION_CLASSES } from "@styles/viewTransitions";

const Offcanvas = (props: PropsWithRef<OffcanvasProps, HTMLDivElement>) => {
  const {
    title,
    open,
    onClose,
    children,
    position = "left",
    size = "md",
    closable = true,
    hideBackdrop = false,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Offcanvas", props);

  const domReady = useDomReady();
  const [attached, setAttached] = useState(open);

  const offcanvasRef = useOutsideClick<HTMLDivElement>(() => closable && onClose?.());

  useEffect(() => {
    startTransition(() => setAttached(open));
  }, [open]);

  const classNames = sanitizeModuleRootClasses(styles, className, [position, size, hideBackdrop && "hideBackdrop"]);
  const slideTransitionClass = SLIDE_TRANSITION_CLASSES[position];

  return (
    attached &&
    domReady &&
    createPortal(
      <ViewTransition enter={BACKDROP_TRANSITION_CLASS} exit={BACKDROP_TRANSITION_CLASS}>
        <div data-testid="offcanvasBackdrop" className={classNames} style={style} ref={ref}>
          <ViewTransition enter={slideTransitionClass} exit={slideTransitionClass}>
            <div className={styles.offcanvas} ref={offcanvasRef}>
              {(title || closable) && (
                <div className={styles.header}>
                  {title && <span className={styles.headerTitle}>{title}</span>}
                  {closable && <MotifIconButton name="close" onClick={onClose} size={size} className={styles.closeButton} />}
                </div>
              )}
              <div className={styles.content}>{children}</div>
            </div>
          </ViewTransition>
        </div>
      </ViewTransition>,
      document.body,
    )
  );
};

Offcanvas.displayName = "Offcanvas";
export default Offcanvas;
