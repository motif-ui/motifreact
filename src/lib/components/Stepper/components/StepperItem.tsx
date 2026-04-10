import { memo, useCallback } from "react";
import Icon from "../../Icon";
import styles from "../Stepper.module.scss";
import { StepperItemComponentProps } from "../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const StepperItem = memo((props: StepperItemComponentProps) => {
  const {
    title,
    icon = "motif_ui",
    variant = "primary",
    disabled,
    stepType,
    index,
    status,
    itemOrientation,
    onStepClick,
    isClickable,
  } = props;

  const handleClick = useCallback(() => {
    onStepClick?.(index);
  }, [onStepClick, index]);

  const itemClasses = sanitizeModuleClasses(
    styles,
    "item",
    variant,
    status === "error" ? "statusError" : status,
    disabled && "disabled",
    isClickable && "clickable",
    itemOrientation && `item-${itemOrientation}`,
  );

  const renderStep = () =>
    stepType === "dot" ? (
      <span className={styles.stepDot} />
    ) : status === "completed" ? (
      <Icon name="check" className={styles.stepIcon} />
    ) : status === "error" ? (
      <Icon name="priority_high" className={styles.stepIcon} />
    ) : stepType === "icon" ? (
      <Icon name={icon} className={styles.stepIcon} />
    ) : (
      <span className={styles.stepNumber}>{index + 1}</span>
    );

  return (
    <div className={itemClasses} tabIndex={isClickable ? 0 : undefined} onClick={isClickable ? handleClick : undefined}>
      <div className={styles.stepHeader}>
        {stepType !== "none" && (
          <div className={styles.stepIndicator}>
            {renderStep()}
            {stepType === "dot" && (status === "completed" || status === "error") && (
              <Icon name={status === "completed" ? "check" : "error"} className={styles.dotStatusIcon} />
            )}
          </div>
        )}
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
        </div>
      </div>
    </div>
  );
});

export default StepperItem;
