export type AlertProps = {
  message?: string;
  title?: string;
  onClose?: () => void;
} & AlertDefaultableProps;

export type AlertDefaultableProps = {
  hideIcon?: boolean;
  closable?: boolean;
  variant?: "secondary" | "danger" | "warning" | "info" | "success";
};
