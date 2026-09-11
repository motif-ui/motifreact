import { memo } from "react";
import styles from "../AlertModal.module.scss";
import { IconGlobalType, Variant } from "../../../types";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";

type Props = {
  title: string;
  text?: string;
  icon?: IconGlobalType;
  variant?: Variant;
};

const AlertModalContent = memo(({ title, text, icon, variant }: Props) => {
  return (
    <div data-testid="alertModalContent" className={styles.alertModalContent}>
      {icon && <GlobalIconWrapper icon={icon} variant={variant} size="xl2" />}
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        {text && <span className={styles.text}>{text}</span>}
      </div>
    </div>
  );
});

export default AlertModalContent;
