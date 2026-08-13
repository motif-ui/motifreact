import { Size5, Variants } from "../../types";

export type ProgressBarProps = {
  progress?: number;
  maxProgress?: number;
  countdown?: { duration: number; paused?: boolean };
} & ProgressBarDefaultableProps;

export type ProgressBarDefaultableProps = {
  variant?: Variants;
  size?: Size5;
  indeterminate?: boolean;
  showPercentage?: boolean;
};
