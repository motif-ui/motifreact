import { memo } from "react";
import styles from "../AlertModal.module.scss";
import { IconGlobalType } from "src/lib/types";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { Variant } from "src/lib/types";

type Props = {
  title: string;
  text?: string;
  icon?: IconGlobalType;
  className?: string;
  variant?: Variant;
  testId?: string;
};

const AlertModalContent = memo(({ title, text, icon, className, variant, testId }: Props) => {
  return (
    <div className={className} data-testid="alertModalContent">
      {icon && (
        <span data-testid={testId && `${testId}-icon`}>
          <GlobalIconWrapper icon={icon} className={styles.icon} variant={variant} size="xl3" />
        </span>
      )}
      <div className={styles.textContent}>
        <span className={styles.title} data-testid={testId && `${testId}-title`}>
          {title}
        </span>
        {text && (
          <span className={styles.text} data-testid={testId && `${testId}-text`}>
            {text}
          </span>
        )}
      </div>
    </div>
  );
});

export default AlertModalContent;
