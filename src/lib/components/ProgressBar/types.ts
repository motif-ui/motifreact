import { Size5 } from "../../types";

export type ProgressBarProps = {
  progress?: number;
  maxProgress?: number;
  countdown?: { duration: number; paused?: boolean };
} & ProgressBarDefaultableProps;

export type ProgressBarDefaultableProps = {
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "secondary";
  size?: Size5;
  indeterminate?: boolean;
  showPercentage?: boolean;
};
