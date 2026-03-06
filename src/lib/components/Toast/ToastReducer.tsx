import { AddToastActionType, DeleteToastActionPayload, DeleteToastActionType, ToastProps, ToastStateProps } from "@/components/Toast/types";

type ActionTypes = AddToastActionType | DeleteToastActionType;

export const ToastReducer = (state: ToastStateProps, action: ActionTypes): ToastStateProps => {
  const { toasts } = state;
  switch (action.type) {
    case "ADD_TOAST": {
      const toast = action.payload as ToastProps;
      return {
        ...state,
        toasts: {
          ...toasts,
          [toast.position]: [...(toasts[toast.position] ?? []), toast],
        },
      };
    }
    case "DELETE_TOAST": {
      const { position } = action.payload as DeleteToastActionPayload;
      return {
        ...state,
        toasts: {
          ...toasts,
          [position]: toasts[position]?.filter(toast => toast.id !== action.payload.id),
        },
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
