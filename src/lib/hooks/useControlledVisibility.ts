"use client";
import { useCallback, useEffect, useRef } from "react";
import useToggle, { type ToggleState } from "./useToggle";

type Options = {
  open?: boolean;
  onClose?: () => void;
  duration?: number;
};

type UseControlledVisibilityReturn = {
  visible: boolean;
  toggleState?: ToggleState;
  attached: boolean;
  hide: () => void;
  hideWithoutTransition: () => void;
};

const useControlledVisibility = ({ open, onClose, duration }: Options): UseControlledVisibilityReturn => {
  const { visible, toggleState, show, hide, hideWithoutTransition } = useToggle({ duration });
  const attached = visible || !!toggleState;
  const attachedRef = useRef(attached);
  attachedRef.current = attached;

  const prevToggleState = useRef(toggleState);
  useEffect(() => {
    if (prevToggleState.current === "hiding" && !toggleState) onClose?.();
    prevToggleState.current = toggleState;
  }, [toggleState, onClose]);

  const hideControlled = useCallback(() => {
    if (duration) prevToggleState.current = "hiding";
    hide();
  }, [duration, hide]);

  useEffect(() => {
    if (open) show();
    else if (attachedRef.current) hideControlled();
  }, [open, show, hideControlled]);

  const hideWithoutTransitionControlled = useCallback(() => {
    hideWithoutTransition();
    if (prevToggleState.current !== "hiding") onClose?.();
  }, [hideWithoutTransition, onClose]);

  return { visible, toggleState, attached, hide: hideControlled, hideWithoutTransition: hideWithoutTransitionControlled };
};

export default useControlledVisibility;
