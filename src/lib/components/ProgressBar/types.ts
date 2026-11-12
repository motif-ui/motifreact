import { Size5, VariantV2 } from "../../types";

export type ProgressBarProps = {
  progress?: number;
  maxProgress?: number;
  countdown?: { duration: number; paused?: boolean };
} & ProgressBarDefaultableProps;

export type ProgressBarDefaultableProps = {
  variant?: VariantV2;
  size?: Size5;
  indeterminate?: boolean;
  showPercentage?: boolean;
};
