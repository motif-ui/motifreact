import { PropsWithChildren, useCallback, useContext, useEffect, useRef } from "react";
import Icon from "../../Icon";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import styles from "../Stepper.module.scss";
import { StepperContext } from "@/components/Stepper/StepperContext.tsx";
import { StepperItemInternalProps } from "../types";
import { sanitizeModuleClasses } from "src/utils/cssUtils.ts";

const StepperItem = (props: PropsWithChildren<StepperItemInternalProps>) => {
  const { index, title, icon = "motif_ui", variant: itemVariant, error, disabled } = props;
  const { activeStep, variant: contextVariant, stepType, itemOrientation, onStepClick, goToStep } = useContext(StepperContext)!;

  const variant = itemVariant ?? contextVariant;
  const status = error ? "error" : index === activeStep ? "active" : !disabled && index < activeStep ? "completed" : "upcoming";
  const clickable = !disabled && status === "completed";

  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    status === "active" && itemRef.current?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [status]);

  const handleClick = useCallback(() => {
    goToStep(index);
    onStepClick?.(index);
  }, [goToStep, onStepClick, index]);

  const itemClasses = sanitizeModuleClasses(styles, "stepItem", variant, status, disabled && "disabled", clickable && "clickable");
  const stepHeaderClass = sanitizeModuleClasses(styles, "stepHeader", `item-${itemOrientation}`);

  const renderStep = () =>
    stepType === "dot" ? (
      status === "completed" || status === "error" ? (
        <Icon name={status === "completed" ? "check" : "error"} className={styles.dotStatusIcon} />
      ) : (
        <span className={`${styles.stepIndicator} ${styles.stepDot}`} />
      )
    ) : (
      <span className={styles.stepIndicator}>
        {stepType !== "text" && (status === "completed" || status === "error") ? (
          <Icon className={styles.stepIcon} name={status === "completed" ? "check" : "priority_high"} />
        ) : stepType === "icon" ? (
          <GlobalIconWrapper icon={icon} className={styles.stepIcon} />
        ) : (
          stepType === "number" && <span className={styles.stepNumber}>{index + 1}</span>
        )}
      </span>
    );

  return (
    <div ref={itemRef} className={itemClasses}>
      <div className={stepHeaderClass} {...(clickable && { tabIndex: 0, onClick: handleClick })}>
        {stepType !== "text" && renderStep()}
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
};

export default StepperItem;
