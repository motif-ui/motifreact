import { Size5 } from "../../types";

export type ProgressCircleProps = {
  progress?: number;
  maxProgress?: number;
  countdown?: { duration: number; paused?: boolean };
} & ProgressCircleDefaultableProps;

export type ProgressCircleDefaultableProps = {
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
  size?: Size5;
  indeterminate?: boolean;
  showPercentage?: boolean;
};
