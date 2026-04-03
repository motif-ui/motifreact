import { memo } from "react";
import Icon from "../../Icon";
import styles from "../Stepper.module.scss";
import { StepperItemOrientation, StepperItemProps, StepperItemStatus, StepperStepType } from "../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = Omit<StepperItemProps, "error"> & {
  stepType: StepperStepType;
  index: number;
  status: StepperItemStatus;
  itemOrientation?: StepperItemOrientation;
  onStepClick?: () => void;
};

const StepperItem = memo((props: Props) => {
  const { title, icon = "motif_ui", variant = "primary", disabled, stepType, index, status, itemOrientation, onStepClick } = props;

  const isClickable = !!onStepClick && !disabled;

  const itemClasses = sanitizeModuleClasses(
    styles,
    "item",
    variant,
    status,
    status === "error" && "statusError",
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
    <div className={itemClasses} tabIndex={isClickable ? 0 : undefined} onClick={isClickable ? onStepClick : undefined}>
      <div className={styles.stepHeader}>
        {stepType !== "none" && <div className={styles.stepIndicator}>{renderStep()}</div>}
        {stepType === "dot" && (status === "completed" || status === "error") && (
          <Icon name={status === "completed" ? "check" : "error"} className={styles.dotStatusIcon} />
        )}
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
        </div>
      </div>
    </div>
  );
});

export default StepperItem;
