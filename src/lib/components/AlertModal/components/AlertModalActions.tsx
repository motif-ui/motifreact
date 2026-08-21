import { ReactElement } from "react";
import { ButtonProps } from "../../Button/types";
import Divider from "../../Divider/Divider";
import styles from "../AlertModal.module.scss";
import { AlertModalButtonsPosition } from "../types";

type Props = {
  buttonAction?: ReactElement<ButtonProps>[];
  buttonsPosition?: AlertModalButtonsPosition;
  enableDivider?: boolean;
};

const AlertModalActions = ({ buttonAction, buttonsPosition = "center", enableDivider = true }: Props) => {
  if (!buttonAction?.length) return null;
  const classNames = `${styles.actions} ${styles[buttonsPosition]}`;

  return (
    <>
      {enableDivider && <Divider className={styles.divider} />}
      <div className={classNames}>{buttonAction}</div>
    </>
  );
};

export default AlertModalActions;
