"use client";

import { Children, FC, ReactElement, cloneElement } from "react";
import styles from "./Stepper.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { StepperItemInternalProps, StepperItemProps, StepperProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import StepperItem from "./components/StepperItem";
import StepperCounter from "./components/StepperCounter";
import { StepperContext } from "./StepperContext";

const Stepper = (props: PropsWithRefAndChildren<StepperProps, HTMLDivElement>) => {
  const {
    children,
    activeStep = 0,
    showCount,
    variant = "primary",
    stepType = "number",
    orientation = "horizontal",
    itemOrientation = "vertical",
    onStepClick,
    className,
    ref,
    style,
  } = usePropsWithThemeDefaults("Stepper", props);

  const stepItems = Children.toArray(children) as ReactElement<StepperItemProps>[];
  const activeContent = stepItems[activeStep]?.props.children;

  const classNames = sanitizeModuleRootClasses(styles, className, [orientation, stepType, `${itemOrientation}-items`]);

  return (
    <StepperContext value={{ activeStep, count: stepItems.length, variant, stepType, itemOrientation, onStepClick }}>
      <div ref={ref} style={style} className={classNames}>
        {showCount && <StepperCounter activeStep={activeStep} />}
        <div className={styles.stepList}>
          {stepItems.map((item, idx) => cloneElement(item as ReactElement<StepperItemInternalProps>, { key: idx, index: idx }))}
        </div>
        {activeContent && <div className={styles.stepContent}>{activeContent}</div>}
      </div>
    </StepperContext>
  );
};

const StepperWithItem = Object.assign(Stepper, {
  displayName: "Stepper",
  Item: StepperItem as unknown as FC<StepperItemProps>,
});
export default StepperWithItem;
