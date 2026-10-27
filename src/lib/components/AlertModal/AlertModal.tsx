"use client";

import styles from "./AlertModal.module.scss";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { PropsWithRef } from "../../types";
import { AlertModalProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { mergeRefs } from "../../../utils/reactUtils";
import useModalOverlay from "../../hooks/useModalOverlay";
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

  const { attached, visible, rootRef, dialogRef, insideProps } = useModalOverlay({
    open: !!open,
    onClose,
    duration: 300,
    closeOnOutsideClick: closable,
    closeOnEscape: closable,
  });
  const mergedRef = useMemo(() => mergeRefs(rootRef, ref), [rootRef, ref]);

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
    createPortal(
      <div data-testid="alertModalBackdrop" className={classNames} style={style} ref={mergedRef}>
        <div className={styles.alertModalContainer} ref={dialogRef} tabIndex={-1} {...insideProps}>
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
