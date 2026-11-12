import { VariantV2, Size5 } from "../../types";

export type ProgressCircleProps = {
  progress?: number;
  maxProgress?: number;
  countdown?: { duration: number; paused?: boolean };
} & ProgressCircleDefaultableProps;

export type ProgressCircleDefaultableProps = {
  variant?: VariantV2;
  size?: Size5;
  indeterminate?: boolean;
  showPercentage?: boolean;
};
