import { Size5, Variants } from "../../types";

export type ProgressCircleProps = {
  progress?: number;
  maxProgress?: number;
  countdown?: { duration: number; paused?: boolean };
} & ProgressCircleDefaultableProps;

export type ProgressCircleDefaultableProps = {
  variant?: Variants;
  size?: Size5;
  indeterminate?: boolean;
  showPercentage?: boolean;
};
