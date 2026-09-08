"use client";

import styles from "./Modal.module.scss";
import { useEffect, useRef } from "react";
import useToggle from "../../hooks/useToggle";
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

const animationOptions = { showTime: 50, hideTime: 300 };

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
  const { visible, toggleState, show, hide } = useToggle(false, animationOptions);
  const attached = visible || !!toggleState;
  const attachedRef = useRef(attached);
  attachedRef.current = attached;

  const prevToggleState = useRef(toggleState);
  useEffect(() => {
    if (prevToggleState.current === "hiding" && !toggleState) onClose?.();
    prevToggleState.current = toggleState;
  }, [toggleState, onClose]);

  const modalRef = useOutsideClick<HTMLDivElement>(() => closable && hide());

  useEffect(() => {
    if (open) show();
    else if (attachedRef.current) hide();
  }, [open, show, hide]);

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
          {closable && <MotifIconButton name="close" onClick={onClose} size="xl2" className={styles.closeButton} />}
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
