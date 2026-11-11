import { memo } from "react";
import styles from "../AlertModal.module.scss";
import { IconGlobalType } from "../../../types";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";

type Props = {
  title: string;
  text?: string;
  icon?: IconGlobalType;
};

const AlertModalContent = memo(({ title, text, icon }: Props) => {
  return (
    <div data-testid="alertModalContent" className={styles.alertModalContent}>
      {icon && <GlobalIconWrapper icon={icon} className={styles.icon} size="xxxl" />}
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        {text && <span className={styles.text}>{text}</span>}
      </div>
    </div>
  );
});

export default AlertModalContent;
