"use client";

import styles from "./AlertModal.module.scss";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PropsWithRef } from "../../types";
import { AlertModalProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import useOutsideClick from "../../hooks/useOutsideClick";
import useDomReady from "../../hooks/useDomReady";
import AlertModalActions from "./components/AlertModalActions";
import AlertModalContent from "./components/AlertModalContent";

const AlertModal = (props: PropsWithRef<AlertModalProps, HTMLDivElement>) => {
  const {
    title,
    subtitle,
    icon,
    size = "md",
    open,
    onClose,
    buttonAction,
    buttonsPosition = "center",
    contentPosition = "center",
    removeBackdrop,
    enableDivider = true,
    bordered,
    elevated,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("AlertModal", props);

  const domReady = useDomReady();
  const [visible, setVisible] = useState(open);
  const [attached, setAttached] = useState(open);

  const handleCloseAnimation = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setAttached(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  const modalRef = useOutsideClick<HTMLDivElement>(() => {
    onClose && handleCloseAnimation();
  });

  useEffect(() => {
    if (open) {
      setAttached(true);
      setTimeout(() => setVisible(true), 50);
    } else {
      attached && handleCloseAnimation();
    }
  }, [open, attached, handleCloseAnimation]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    visible && "show",
    removeBackdrop && "noBackdrop",
    bordered && "bordered",
    elevated && "elevated",
    size,
  ]);

  return (
    attached &&
    domReady &&
    createPortal(
      <div data-testid="alertModalBackdrop" className={classNames} style={style} ref={ref}>
        <div className={styles.alertModal} ref={modalRef}>
          <AlertModalContent title={title} subtitle={subtitle} contentPosition={contentPosition} icon={icon} />
          <AlertModalActions buttonAction={buttonAction} buttonsPosition={buttonsPosition} enableDivider={enableDivider} />
        </div>
      </div>,
      document.body,
    )
  );
};

AlertModal.displayName = "AlertModal";
export default AlertModal;
