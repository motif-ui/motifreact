export type StepperVariant = "primary" | "secondary" | "success" | "warning" | "error";
export type StepperStepType = "dot" | "number" | "icon" | "none";
export type StepperItemStatus = "completed" | "active" | "upcoming" | "error";

export type StepperItemProps = {
  title?: string;
  icon?: string;
  variant?: StepperVariant;
  error?: boolean;
  disabled?: boolean;
};

export type StepperItemOrientation = "vertical" | "horizontal";

export type StepperConnectorAlign = "start" | "center" | "end";

export type StepperDefaultableProps = {
  variant?: StepperVariant;
  stepType?: StepperStepType;
  itemOrientation?: StepperItemOrientation;
  connectorAlign?: StepperConnectorAlign;
};

type StepperBaseProps = {
  items: StepperItemProps[];
  activeStep?: number;
  showCount?: boolean;
  onStepClick?: (index: number) => void;
} & StepperDefaultableProps;

export type StepperProps = StepperBaseProps & {
  orientation?: "vertical" | "horizontal";
};
