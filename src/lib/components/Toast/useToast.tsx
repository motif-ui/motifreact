"use client";

import { memo, useReducer } from "react";
import { ToastReducer } from "@/components/Toast/ToastReducer";
import { generateUUIDV4, isSmallScreen } from "../../../utils/utils";
import Toast from "@/components/Toast/Toast";
import { ToastPosition, UseToastProps, ToastVariant, ToastProps, AddToastOptions } from "./types";
import styles from "./Toast.module.scss";
import { createPortal } from "react-dom";
import { sanitizeModuleClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const smallScreenPositionsMapping: Record<ToastPosition, ToastPosition> = {
  bottom: "bottom",
  bottomLeft: "bottom",
  bottomRight: "bottom",
  top: "top",
  topLeft: "top",
  topRight: "top",
};

export const useToast: () => UseToastProps = () => {
  const [state, dispatch] = useReducer(ToastReducer, { toasts: {} });
  const themeDefaults = usePropsWithThemeDefaults("Toast", {} as AddToastOptions);

  const addToast = (variant: ToastVariant, content: string, options?: AddToastOptions) => {
    const { position = "topRight", duration = 3000, closable = true, ...rest } = { ...themeDefaults, ...options };
    const id = generateUUIDV4();
    dispatch({
      type: "ADD_TOAST",
      payload: {
        id: generateUUIDV4(),
        onDismiss: removeFromState,
        content,
        variant,
        position: isSmallScreen ? smallScreenPositionsMapping[position] : position,
        duration,
        closable,
        ...rest,
      },
    });
    return { id };
  };

  const removeFromState = (id: string, position: ToastPosition) => {
    dispatch({
      type: "DELETE_TOAST",
      payload: { id, position },
    });
  };

  const createToast = (variant: ToastVariant) => (content: string, options?: AddToastOptions) => addToast(variant, content, options);
  const { top, bottom, topRight, topLeft, bottomRight, bottomLeft } = state.toasts;

  return {
    success: createToast("success"),
    warning: createToast("warning"),
    info: createToast("info"),
    error: createToast("error"),
    secondary: createToast("secondary"),
    toasts: (
      <>
        <ToastsInPosition toasts={topRight} position="topRight" />
        <ToastsInPosition toasts={top} position="top" />
        <ToastsInPosition toasts={topLeft} position="topLeft" />
        <ToastsInPosition toasts={bottomRight} position="bottomRight" />
        <ToastsInPosition toasts={bottom} position="bottom" />
        <ToastsInPosition toasts={bottomLeft} position="bottomLeft" />
      </>
    ),
  };
};

const ToastsInPosition = memo(
  ({ toasts, position }: { position: ToastPosition; toasts?: ToastProps[] }) =>
    toasts &&
    toasts.length > 0 &&
    createPortal(
      <div className={sanitizeModuleClasses(styles, "Container", position)}>
        {toasts.map(props => (
          <Toast key={props.id} {...props} />
        ))}
      </div>,
      document.body,
    ),
  (prevProps, nextProps) => prevProps.toasts?.map(t => t.id).join("") === nextProps.toasts?.map(t => t.id).join(""),
);
