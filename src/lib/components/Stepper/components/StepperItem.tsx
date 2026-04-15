import { PropsWithChildren, memo, useCallback, useContext } from "react";
import Icon from "../../Icon";
import styles from "../Stepper.module.scss";
import { StepperContext } from "../StepperContext";
import { StepperItemProps } from "../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const StepperItem = memo((props: PropsWithChildren<StepperItemProps>) => {
  const { index = 0, title, icon = "motif_ui", variant: itemVariant, error, disabled } = props;
  const { activeStep, variant: contextVariant, stepType, itemOrientation = "horizontal", onStepClick } = useContext(StepperContext);

  const variant = itemVariant ?? contextVariant ?? "primary";
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
    <div className={itemClasses} {...(clickable && { tabIndex: 0, onClick: handleClick })}>
      <div className={styles.stepHeader}>
        {stepType !== "text" && <div className={styles.stepIndicator}>{renderStep()}</div>}
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
        </div>
      </div>
    </div>
  );
});

StepperItem.displayName = "StepperItem";
export default StepperItem;
