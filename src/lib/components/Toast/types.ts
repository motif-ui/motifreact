import { ReactElement } from "react";
import { PropsWithRef } from "../../types";

export type ToastPosition = "topLeft" | "topRight" | "top" | "bottomLeft" | "bottomRight" | "bottom";

export type ToastVariant = "secondary" | "error" | "warning" | "info" | "success";

export type ToastProps = {
  id: string;
  onDismiss: (id: string, position: ToastPosition) => void;
  content: string;
  variant: ToastVariant;
  position: ToastPosition;
  duration: number;
  closable: boolean;
  title?: string;
  icon?: string;
  maxContentLength?: number;
};

export type AddToastOptions = PropsWithRef<ToastDefaultableProps>;

export type ToastDefaultableProps = {
  title?: string;
  position?: ToastPosition;
  icon?: string;
  duration?: number;
  closable?: boolean;
  maxContentLength?: number;
};

type AddToastType = (content: string, options?: AddToastOptions) => void;
export type UseToastProps = Record<ToastVariant, AddToastType> & {
  toasts: ReactElement;
};

export type DeleteToastActionPayload = { id: string; position: ToastPosition };

export type AddToastActionType = {
  type: string;
  payload: PropsWithRef<ToastProps>;
};

export type DeleteToastActionType = {
  type: string;
  payload: DeleteToastActionPayload;
};

export type ToastStateProps = {
  toasts: {
    topLeft?: ToastProps[];
    topRight?: ToastProps[];
    top?: ToastProps[];
    bottomLeft?: ToastProps[];
    bottomRight?: ToastProps[];
    bottom?: ToastProps[];
  };
};
