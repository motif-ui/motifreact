"use client";

import { Children, ReactElement } from "react";
import styles from "./Stepper.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { StepperItemProps, StepperProps } from "./types";
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

  const stepItems = Children.toArray(children) as ReactElement<StepperItemProps>[];

  const classNames = sanitizeModuleRootClasses(styles, className, [
    orientation,
    stepType,
    `itemOrientation-${itemOrientation}`,
    `connectorAlign-${connectorAlign}`,
    `count-${variant ?? "primary"}`,
  ]);

  return (
    <StepperContext value={{ activeStep, variant, stepType, itemOrientation, onStepClick }}>
      <div ref={ref} style={style} className={classNames}>
        {showCount && <StepperCounter activeStep={activeStep} count={stepItems.length} orientation={orientation} />}
        <div className={styles.stepList}>
          {stepItems.map((item, idx) => (
            <StepperItem key={idx} index={idx} {...item.props} />
          ))}
        </div>
      </div>
    </StepperContext>
  );
};

Stepper.displayName = "Stepper";
const StepperWithItem = Object.assign(Stepper, { Item: StepperItem });
export default StepperWithItem;
