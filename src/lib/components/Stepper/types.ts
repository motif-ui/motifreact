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

export type StepperDefaultableProps = {
  variant?: StepperVariant;
  stepType?: StepperStepType;
  itemOrientation?: "vertical" | "horizontal";
  connectorAlign?: "start" | "center" | "end";
};

type StepperBaseProps = {
  /**
   * ```
   * {
   *   title?: string;
   *   icon?: string;
   *   variant?: "primary" | "secondary" | "success" | "warning" | "error";
   *   error?: boolean;
   *   disabled?: boolean;
   * }[]
   * ```
   */
  items: StepperItemProps[];
  activeStep?: number;
  showCount?: boolean;
  onStepClick?: (index: number) => void;
} & StepperDefaultableProps;

export type StepperProps = StepperBaseProps & {
  orientation?: "vertical" | "horizontal";
};

export type StepperItemComponentProps = Omit<StepperItemProps, "error"> & {
  stepType: StepperStepType;
  index: number;
  status: StepperItemStatus;
  itemOrientation?: "vertical" | "horizontal";
  onStepClick?: (index: number) => void;
  isClickable?: boolean;
};
