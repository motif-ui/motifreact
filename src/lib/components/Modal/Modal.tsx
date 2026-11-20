"use client";

import styles from "./Modal.module.scss";
import ModalHeader from "./components/ModalHeader";
import { PropsWithRef } from "../../types";
import ModalActions from "./components/ModalActions";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import useModalOverlay from "../../hooks/useModalOverlay";
import { ModalProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { mergeRefs } from "../../../utils/reactUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { MotifIconButton } from "@/components/Motif/Icon";

const Modal = (props: PropsWithRef<ModalProps, HTMLDivElement>) => {
  const {
    title,
    subtitle,
    open,
    onClose,
    onAfterClose,
    children,
    maximizable,
    closable,
    size = "md",
    buttons,
    actionButton,
    alternateButton,
    noContentPadding,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Modal", props);

  const { attached, visible, hide, rootRef, dialogRef, insideProps } = useModalOverlay({
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
    maximizable && "maximized",
    noContentPadding && "noContentPadding",
    size,
  ]);
  return (
    attached &&
    createPortal(
      <div data-testid="modalBackdrop" className={classNames} style={style} ref={mergedRef}>
        <div className={styles.modal} ref={dialogRef} tabIndex={-1} {...insideProps}>
          {closable && <MotifIconButton name="close" onClick={() => hide("closeButton")} size="xxl" className={styles.closeButton} />}
          <ModalHeader title={title} subtitle={subtitle} />
          <div className={styles.content}> {children}</div>
          <ModalActions actionButton={actionButton} alternateButton={alternateButton} buttons={buttons} />
        </div>
      </div>,
      document.body,
    )
  );
};

Modal.displayName = "Modal";
export default Modal;
