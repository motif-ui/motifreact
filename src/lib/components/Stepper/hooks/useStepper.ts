"use client";

import { useCallback, useState } from "react";
import { UseStepperReturn } from "../types";

const useStepper = (defaultActiveStep = 0): UseStepperReturn => {
  const [activeStep, setActiveStep] = useState(Math.max(0, defaultActiveStep));
  const [stepData, setStepDataState] = useState<Partial<Record<number, Record<string, unknown>>>>({});

  const setStepData = useCallback(
    (index: number, data: Record<string, unknown>) => setStepDataState(prev => ({ ...prev, [index]: { ...prev[index], ...data } })),
    [],
  );
  const goToStep = useCallback((index: number) => setActiveStep(Math.max(0, index)), []);
  const goToNextStep = useCallback(() => setActiveStep(prev => prev + 1), []);
  const goToPrevStep = useCallback(() => setActiveStep(prev => Math.max(0, prev - 1)), []);

  return { activeStep, stepData, setStepData, goToStep, goToNextStep, goToPrevStep };
};

export default useStepper;
