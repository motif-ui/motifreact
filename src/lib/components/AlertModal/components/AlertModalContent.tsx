import { ReactElement } from "react";
import styles from "../AlertModal.module.scss";
import { AlertModalContentPosition } from "../types";

type Props = {
  title: string;
  subtitle?: string;
  contentPosition?: AlertModalContentPosition;
  icon?: ReactElement;
};

const AlertModalContent = ({ title, subtitle, contentPosition = "center", icon }: Props) => {
  const bodyClasses = `${styles.content} ${styles[contentPosition]}`;

  return (
    <div className={bodyClasses}>
      {icon}
      <div className={styles.textContent}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
};

export default AlertModalContent;
