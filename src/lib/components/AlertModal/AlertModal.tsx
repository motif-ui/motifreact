"use client";

import styles from "./AlertModal.module.scss";
import { createPortal } from "react-dom";
import { PropsWithRef } from "../../types";
import { AlertModalProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import useOutsideClick from "../../hooks/useOutsideClick";
import useDomReady from "../../hooks/useDomReady";
import useControlledVisibility from "../../hooks/useControlledVisibility";
import AlertModalActions from "./components/AlertModalActions";
import AlertModalContent from "./components/AlertModalContent";

const AlertModal = (props: PropsWithRef<AlertModalProps, HTMLDivElement>) => {
  const {
    title,
    text,
    icon,
    size = "md",
    open,
    onClose,
    actionButton,
    alternateButton,
    buttonsPosition = "center",
    contentPosition = "center",
    removeBackdrop,
    enableDivider,
    bordered,
    elevated,
    closable,
    variant = "primary",
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("AlertModal", props);

  const domReady = useDomReady();
  const { visible, attached, hide } = useControlledVisibility({ open, onClose, duration: 300 });

  const modalRef = useOutsideClick<HTMLDivElement>(() => {
    closable && hide();
  });

  const classNames = sanitizeModuleRootClasses(styles, className, [
    visible && "show",
    !removeBackdrop && "backdrop",
    bordered && "bordered",
    elevated && "elevated",
    enableDivider && "withDivider",
    `content_${contentPosition}`,
    `actions_${buttonsPosition}`,
    size,
  ]);

  return (
    attached &&
    domReady &&
    createPortal(
      <div data-testid="alertModalBackdrop" className={classNames} style={style} ref={ref}>
        <div className={styles.alertModalContainer} ref={modalRef}>
          <AlertModalContent title={title} text={text} icon={icon} variant={variant} />
          {(actionButton || alternateButton) && (
            <AlertModalActions actionButton={actionButton} alternateButton={alternateButton} variant={variant} />
          )}
        </div>
      </div>,
      document.body,
    )
  );
};

AlertModal.displayName = "AlertModal";
export default AlertModal;
