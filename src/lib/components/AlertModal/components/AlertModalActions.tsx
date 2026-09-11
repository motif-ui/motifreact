import { memo } from "react";
import Button from "../../Button";
import { Variant } from "../../../types";
import { AlertModalButtonProps } from "../types";
import styles from "../AlertModal.module.scss";

type Props = {
  actionButton?: AlertModalButtonProps;
  alternateButton?: AlertModalButtonProps;
  variant?: Variant;
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
          variant="secondary"
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
