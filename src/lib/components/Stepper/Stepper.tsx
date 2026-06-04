"use client";

import { Children, FC, ReactElement, cloneElement, useCallback, useEffect, useState } from "react";
import styles from "./Stepper.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { StepperItemInternalProps, StepperItemProps, StepperProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils.ts";
import StepperItem from "./components/StepperItem";
import StepperCounter from "./components/StepperCounter";
import StepperNavigation from "./components/StepperNavigation";
import { StepperContext } from "./StepperContext";

const Stepper = (props: PropsWithRefAndChildren<StepperProps, HTMLDivElement>) => {
  const {
    children,
    defaultActiveStep = 0,
    hideNavigation,
    showCount,
    variant = "primary",
    stepType = "number",
    orientation = "horizontal",
    itemOrientation = "vertical",
    onStepClick,
    onStepChange,
    onFinishClick,
    finishButtonLabel,
    onNextClick,
    onPrevClick,
    state: externalState,
    className,
    ref,
    style,
  } = usePropsWithThemeDefaults("Stepper", props);

  const [internalStep, setInternalStep] = useState(defaultActiveStep);
  const [internalStepData, setInternalStepDataState] = useState<Partial<Record<number, Record<string, unknown>>>>({});
  const internalSetStepData = useCallback(
    (index: number, data: Record<string, unknown>) => setInternalStepDataState(prev => ({ ...prev, [index]: { ...prev[index], ...data } })),
    [],
  );
  const stepData = externalState ? externalState.stepData : internalStepData;
  const setStepData = externalState ? externalState.setStepData : internalSetStepData;

  const stepItems = Children.toArray(children) as ReactElement<StepperItemProps>[];
  const count = stepItems.length;
  const disabledSteps = stepItems.map(item => !!item.props.disabled);

  const rawActiveStep = externalState ? externalState.activeStep : internalStep;
  const resolvedStep = disabledSteps.findIndex((d, i) => i > rawActiveStep && !d);
  const activeStep = externalState && disabledSteps[rawActiveStep] && resolvedStep !== -1 ? resolvedStep : rawActiveStep;

  const goToStep = useCallback(
    (index: number) => {
      if (!disabledSteps[index]) {
        const clamped = Math.max(0, Math.min(index, count - 1));
        externalState ? externalState.goToStep(clamped) : setInternalStep(clamped);
        onStepChange?.(clamped);
      }
    },
    [disabledSteps, count, externalState, onStepChange],
  );

  const goToNextStep = useCallback(() => {
    const next = disabledSteps.findIndex((disabled, i) => i > activeStep && !disabled);
    next !== -1 && goToStep(next);
  }, [activeStep, disabledSteps, goToStep]);

  const goToPrevStep = useCallback(() => {
    const prev = disabledSteps.findLastIndex((disabled, i) => i < activeStep && !disabled);
    prev !== -1 && goToStep(prev);
  }, [activeStep, disabledSteps, goToStep]);

  useEffect(() => {
    if (externalState && disabledSteps[externalState.activeStep]) {
      const resolved = disabledSteps.findIndex((disabled, i) => i > externalState.activeStep && !disabled);
      resolved !== -1 && externalState.goToStep(resolved);
    }
  }, [externalState?.activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeContent = stepItems[activeStep]?.props.children;
  const classNames = sanitizeModuleRootClasses(styles, className, [orientation, stepType, `${itemOrientation}-items`]);

  return (
    <StepperContext
      value={{
        activeStep,
        count,
        variant,
        stepType,
        itemOrientation,
        onStepClick,
        goToStep,
        goToNextStep,
        goToPrevStep,
        disabledSteps,
        stepData,
        setStepData,
      }}
    >
      <div ref={ref} style={style} className={classNames}>
        {showCount && <StepperCounter />}
        <div className={styles.stepList}>
          {Children.map(children, (child, idx) => cloneElement(child as ReactElement<StepperItemInternalProps>, { key: idx, index: idx }))}
        </div>
        {activeContent && (
          <div className={styles.stepContent}>
            <div>{activeContent}</div>
            {!hideNavigation && (
              <StepperNavigation
                onFinishClick={onFinishClick}
                finishButtonLabel={finishButtonLabel}
                onNextClick={onNextClick}
                onPrevClick={onPrevClick}
              />
            )}
          </div>
        )}
      </div>
    </StepperContext>
  );
};

const StepperWithItem = Object.assign(Stepper, {
  displayName: "Stepper",
  Item: Object.assign(StepperItem as FC<StepperItemProps>, { displayName: "Stepper.Item" }),
});
export default StepperWithItem;
