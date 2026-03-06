"use client";

import styles from "./Modal.module.scss";
import { useCallback, useEffect, useState } from "react";
import ModalHeader from "./components/ModalHeader";
import { PropsWithRef } from "../../types";
import ModalActions from "./components/ModalActions";
import { createPortal } from "react-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import useDomReady from "../../hooks/useDomReady";
import { ModalProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { MotifIconButton } from "@/components/Motif/Icon";

const Modal = (props: PropsWithRef<ModalProps, HTMLDivElement>) => {
  const {
    title,
    subtitle,
    open,
    onClose,
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

  const modalRef = useOutsideClick<HTMLDivElement>(() => closable && handleCloseWithAnimation());

  useEffect(() => {
    if (open) {
      setAttached(true);
      setTimeout(() => setVisible(true), 50);
    } else {
      attached && handleCloseWithAnimation();
    }
  }, [open, attached, handleCloseWithAnimation]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    visible && "show",
    maximizable && "maximized",
    noContentPadding && "noContentPadding",
    size,
  ]);
  return (
    attached &&
    domReady &&
    createPortal(
      <div data-testid="modalBackdrop" className={classNames} style={style} ref={ref}>
        <div className={styles.modal} ref={modalRef}>
          {closable && <MotifIconButton name="close" onClick={onClose} size="xxl" className={styles.closeButton} />}
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
