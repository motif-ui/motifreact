import { Size5, Variant } from "../../types";

export type ProgressBarProps = {
  progress?: number;
  maxProgress?: number;
  countdown?: { duration: number; paused?: boolean };
} & ProgressBarDefaultableProps;

export type ProgressBarDefaultableProps = {
  variant?: Variant;
  size?: Size5;
  indeterminate?: boolean;
  showPercentage?: boolean;
};
