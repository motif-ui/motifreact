"use client";

import { CSSProperties, Children, cloneElement, isValidElement, useCallback } from "react";
import styles from "./Stepper.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { StepperProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleClasses, sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import StepperItem from "./components/StepperItem";
import StepperPanel from "./components/StepperPanel";

const Stepper = (props: PropsWithRefAndChildren<StepperProps, HTMLDivElement>) => {
  const {
    items,
    children,
    activeStep = 0,
    showCount,
    variant,
    stepType = "number",
    orientation = "horizontal",
    itemOrientation = "vertical",
    connectorAlign = "center",
    onStepClick,
    className,
    ref,
    style,
  } = usePropsWithThemeDefaults("Stepper", props);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    orientation,
    stepType,
    `itemOrientation-${itemOrientation}`,
    `connectorAlign-${connectorAlign}`,
  ]);

  const activeVariant = items[activeStep]?.variant ?? variant ?? "primary";
  const countToken = activeVariant === "error" ? "danger" : activeVariant;
  const countClass = sanitizeModuleClasses(styles, "stepCount", orientation === "vertical" ? "stepCountVertical" : "stepCountHorizontal");

  const counterSpan = showCount && (
    <span className={countClass}>
      <span className={styles.stepCountActive}>{activeStep + 1}</span>
      {" / "}
      {items.length}
    </span>
  );

  const handleStepClick = useCallback(
    (idx: number) => {
      onStepClick?.(idx);
    },
    [onStepClick],
  );

  const panels = Children.map(children, child => {
    if (isValidElement<{ index: number }>(child)) {
      return cloneElement(child, { isActive: child.props.index === activeStep } as object);
    }
    return child;
  });

  return (
    <div
      ref={ref}
      style={{ ...style, "--stepper-count-color": `var(--theme-color-text-${countToken}-default)` } as CSSProperties}
      className={classNames}
    >
      {counterSpan}
      <div className={styles.stepList}>
        {items.map((item, idx) => (
          <StepperItem
            key={idx}
            {...item}
            variant={item.variant ?? variant}
            status={item.error ? "error" : idx < activeStep ? "completed" : idx === activeStep ? "active" : "upcoming"}
            stepType={stepType}
            index={idx}
            itemOrientation={itemOrientation}
            onStepClick={onStepClick ? handleStepClick : undefined}
            isClickable={!!onStepClick && !item.disabled && (idx < activeStep || idx === activeStep + 1)}
          />
        ))}
      </div>
      {panels}
    </div>
  );
};

Stepper.displayName = "Stepper";
const StepperWithPanel = Object.assign(Stepper, { Panel: StepperPanel });
export default StepperWithPanel;
