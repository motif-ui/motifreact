import { PropsWithChildren } from "react";

export type StepperVariant = "primary" | "secondary" | "success" | "warning" | "danger";
export type StepperStepType = "dot" | "number" | "icon" | "text";
export type StepperOrientation = "vertical" | "horizontal";

export type StepperItemProps = PropsWithChildren<{
  title?: string;
  icon?: string;
  variant?: StepperVariant;
  error?: boolean;
  disabled?: boolean;
}>;

export type StepperItemInternalProps = StepperItemProps & {
  index: number;
};

export type StepperDefaultableProps = {
  variant?: StepperVariant;
  stepType?: StepperStepType;
  orientation?: StepperOrientation;
  itemOrientation?: StepperOrientation;
  showCount?: boolean;
  finishButtonLabel?: string;
};

export type StepperProps = {
  activeStep?: number;
  onStepClick?: (index: number) => void;
  defaultActiveStep?: number;
  onStepChange?: (index: number) => void;
  onFinishClick?: () => void;
  onNextClick?: () => void;
  onPrevClick?: () => void;
  state?: UseStepperReturn;
} & StepperDefaultableProps;

export type StepperContextType = {
  activeStep: number;
  count: number;
  variant: StepperVariant;
  stepType: StepperStepType;
  itemOrientation: StepperOrientation;
  onStepClick?: (index: number) => void;
  goToStep: (index: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  disabledSteps: boolean[];
  stepData: Partial<Record<number, Record<string, unknown>>>;
  setStepData: (index: number, data: Record<string, unknown>) => void;
};

export type StepperNavigationProps = {
  onFinishClick?: () => void;
  finishButtonLabel?: string;
  onNextClick?: () => void;
  onPrevClick?: () => void;
};

export type UseStepperReturn = {
  activeStep: number;
  stepData: Partial<Record<number, Record<string, unknown>>>;
  setStepData: (index: number, data: Record<string, unknown>) => void;
  goToStep: (index: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
};
