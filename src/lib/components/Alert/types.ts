import { VariantV2 } from "src/lib/types";

export type AlertProps = {
  message?: string;
  title?: string;
  onClose?: () => void;
} & AlertDefaultableProps;

export type AlertDefaultableProps = {
  hideIcon?: boolean;
  closable?: boolean;
  variant?: VariantV2;
};
