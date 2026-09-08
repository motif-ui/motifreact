import { memo } from "react";
import styles from "../AlertModal.module.scss";
import { IconGlobalType, Variant } from "../../../types";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";

type Props = {
  title: string;
  text?: string;
  icon?: IconGlobalType;
  className?: string;
  variant?: Variant;
};

const AlertModalContent = memo(({ title, text, icon, className, variant }: Props) => {
  return (
    <div className={className} data-testid="alertModalContent">
      {icon && <GlobalIconWrapper icon={icon} variant={variant} size="xl3" />}
      <div className={styles.textContent}>
        <span className={styles.title}>{title}</span>
        {text && <span className={styles.text}>{text}</span>}
      </div>
    </div>
  );
});

export default AlertModalContent;
