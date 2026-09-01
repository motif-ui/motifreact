import { Size5, Variant } from "../../types";

export type ProgressCircleProps = {
  progress?: number;
  maxProgress?: number;
  countdown?: { duration: number; paused?: boolean };
} & ProgressCircleDefaultableProps;

export type ProgressCircleDefaultableProps = {
  variant?: Variant;
  size?: Size5;
  indeterminate?: boolean;
  showPercentage?: boolean;
};
