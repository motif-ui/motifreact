"use client";

import styles from "./Modal.module.scss";
import useControlledVisibility from "../../hooks/useControlledVisibility";
import ModalHeader from "./components/ModalHeader";
import { PropsWithRef } from "../../types";
import ModalActions from "./components/ModalActions";
import useOutsideClick from "../../hooks/useOutsideClick";
import BrowserPortal from "../../../utils/BrowserPortal";
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

  const { visible, attached, hide } = useControlledVisibility({ open, onClose, duration: 300 });

  const modalRef = useOutsideClick<HTMLDivElement>(() => closable && hide());

  const classNames = sanitizeModuleRootClasses(styles, className, [
    visible && "show",
    maximizable && "maximized",
    noContentPadding && "noContentPadding",
    size,
  ]);
  return (
    attached && (
      <BrowserPortal>
        <div data-testid="modalBackdrop" className={classNames} style={style} ref={ref}>
          <div className={styles.modal} ref={modalRef}>
            {closable && <MotifIconButton name="close" onClick={hide} size="xxl" className={styles.closeButton} />}
            <ModalHeader title={title} subtitle={subtitle} />
            <div className={styles.content}> {children}</div>
            <ModalActions actionButton={actionButton} alternateButton={alternateButton} buttons={buttons} />
          </div>
        </div>
      </BrowserPortal>
    )
  );
};

Modal.displayName = "Modal";
export default Modal;
