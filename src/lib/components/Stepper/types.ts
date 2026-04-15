import { ReactNode } from "react";

export type StepperVariant = "primary" | "secondary" | "success" | "warning" | "error";
export type StepperStepType = "dot" | "number" | "icon" | "text";
export type StepperOrientation = "vertical" | "horizontal";

export type StepperItemProps = {
  index?: number;
  title?: string;
  icon?: string;
  variant?: StepperVariant;
  error?: boolean;
  disabled?: boolean;
  children?: ReactNode;
};

export type StepperDefaultableProps = {
  variant?: StepperVariant;
  stepType?: StepperStepType;
  orientation?: StepperOrientation;
  itemOrientation?: StepperOrientation;
  connectorAlign?: "start" | "center" | "end";
  showCount?: boolean;
};

export type StepperProps = {
  activeStep?: number;
  onStepClick?: (index: number) => void;
} & StepperDefaultableProps;

export type StepperCounterProps = {
  activeStep: number;
  count: number;
  orientation: StepperOrientation;
};

export type StepperContextType = {
  activeStep: number;
  variant?: StepperVariant;
  stepType: StepperStepType;
  itemOrientation: StepperOrientation;
  onStepClick?: (index: number) => void;
};
