import { useCallback, useContext } from "react";
import Icon from "../../Icon";
import styles from "../Stepper.module.scss";
import { StepperContext } from "../StepperContext";
import { StepperItemInternalProps } from "../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const StepperItem = (props: StepperItemInternalProps) => {
  const { index, title, icon = "motif_ui", variant: itemVariant, error, disabled } = props;
  const { activeStep, variant: contextVariant, stepType, itemOrientation, onStepClick } = useContext(StepperContext);

  const variant = itemVariant ?? contextVariant;
  const status = error ? "error" : index < activeStep ? "completed" : index === activeStep ? "active" : "upcoming";
  const clickable = !!onStepClick && !disabled && (index < activeStep || index === activeStep + 1);

  const handleClick = useCallback(() => {
    onStepClick?.(index);
  }, [onStepClick, index]);

  const itemClasses = sanitizeModuleClasses(
    styles,
    "item",
    variant,
    status === "error" ? "statusError" : status,
    disabled && "disabled",
    clickable && "clickable",
    `item-${itemOrientation}`,
  );

  const renderStep = () =>
    stepType === "dot" ? (
      <>
        <span className={styles.stepDot} />
        {(status === "completed" || status === "error") && (
          <Icon name={status === "completed" ? "check" : "error"} className={styles.dotStatusIcon} />
        )}
      </>
    ) : stepType !== "text" && (status === "completed" || status === "error" || stepType === "icon") ? (
      <Icon name={status === "completed" ? "check" : status === "error" ? "priority_high" : icon} className={styles.stepIcon} />
    ) : (
      stepType === "number" && <span className={styles.stepNumber}>{index + 1}</span>
    );

  return (
    <div className={itemClasses} {...(clickable && { tabIndex: 0, onClick: handleClick })}>
      <div className={styles.stepHeader}>
        <div className={styles.stepIndicator}>{renderStep()}</div>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
};

StepperItem.displayName = "StepperItem";
export default StepperItem;
