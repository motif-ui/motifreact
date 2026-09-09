import { memo } from "react";
import styles from "../AlertModal.module.scss";
import { IconGlobalType, Variant } from "../../../types";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { sanitizeModuleClasses } from "src/utils/cssUtils";
import { AlertModalContentPosition } from "../types";

type Props = {
  title: string;
  text?: string;
  icon?: IconGlobalType;
  variant?: Variant;
  contentPosition?: AlertModalContentPosition;
};

const AlertModalContent = memo(({ title, text, icon, variant, contentPosition }: Props) => {
  const classNames = sanitizeModuleClasses(styles, "content", `content_${contentPosition}`);

  return (
    <div className={classNames} data-testid="alertModalContent">
      {icon && <GlobalIconWrapper icon={icon} variant={variant} size="xl3" />}
      <div className={styles.textContent}>
        <span className={styles.title}>{title}</span>
        {text && <span className={styles.text}>{text}</span>}
      </div>
    </div>
  );
});

export default AlertModalContent;
