import { ReactNode } from "react";

export type StepperVariant = "primary" | "secondary" | "success" | "warning" | "danger";
export type StepperStepType = "dot" | "number" | "icon" | "text";
export type StepperOrientation = "vertical" | "horizontal";

export type StepperItemProps = {
  title?: string;
  icon?: string;
  variant?: StepperVariant;
  error?: boolean;
  disabled?: boolean;
  children?: ReactNode;
};

export type StepperItemInternalProps = Omit<StepperItemProps, "children"> & {
  index: number;
};

export type StepperDefaultableProps = {
  variant?: StepperVariant;
  stepType?: StepperStepType;
  orientation?: StepperOrientation;
  itemOrientation?: StepperOrientation;
  showCount?: boolean;
};

export type StepperProps = {
  activeStep?: number;
  onStepClick?: (index: number) => void;
} & StepperDefaultableProps;

export type StepperContextType = {
  activeStep: number;
  count: number;
  variant: StepperVariant;
  stepType: StepperStepType;
  itemOrientation: StepperOrientation;
  onStepClick?: (index: number) => void;
};
