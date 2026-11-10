import { memo } from "react";
import Button from "../../ButtonV2/Button";
import { VariantV2 } from "../../../types";
import { AlertModalButtonProps } from "../types";
import styles from "../AlertModalV2.module.scss";

type Props = {
  actionButton?: AlertModalButtonProps;
  alternateButton?: AlertModalButtonProps;
  variant?: VariantV2;
};

const AlertModalActions = memo((props: Props) => {
  const { alternateButton, actionButton, variant } = props;

  return (
    <div data-testid="alertModalActions" className={styles.alertModalActions}>
      {alternateButton && (
        <Button
          pill
          onClick={alternateButton.onClick}
          shape="outline"
          variant="neutral"
          label={alternateButton.text}
          icon={alternateButton.icon}
          iconPosition={alternateButton.iconPosition}
        />
      )}
      {actionButton && (
        <Button
          pill
          onClick={actionButton.onClick}
          variant={variant}
          label={actionButton.text}
          icon={actionButton.icon}
          iconPosition={actionButton.iconPosition}
        />
      )}
    </div>
  );
});

export default AlertModalActions;
