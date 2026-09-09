import { memo } from "react";
import styles from "../AlertModal.module.scss";
import Button from "../../Button";
import { Variant } from "../../../types";
import { AlertModalButtonPosition, AlertModalButtonProps } from "../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  actionButton?: AlertModalButtonProps;
  alternateButton?: AlertModalButtonProps;
  buttonsPosition?: AlertModalButtonPosition;
  enableDivider?: boolean;
  variant?: Variant;
};

const AlertModalActions = memo((props: Props) => {
  const { alternateButton, actionButton, buttonsPosition = "center", enableDivider, variant } = props;
  const className = sanitizeModuleClasses(styles, "actions", `actions_${buttonsPosition}`, enableDivider && "withDivider");

  return (
    <div data-testid="alertModalActions" className={className}>
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
