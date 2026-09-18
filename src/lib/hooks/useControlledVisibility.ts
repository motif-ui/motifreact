"use client";
import { useEffect, useRef } from "react";
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
};

const useControlledVisibility = ({ open, onClose, duration }: Options): UseControlledVisibilityReturn => {
  const { visible, toggleState, show, hide } = useToggle({ duration });
  const attached = visible || !!toggleState;
  const attachedRef = useRef(attached);
  attachedRef.current = attached;

  const prevToggleState = useRef(toggleState);
  useEffect(() => {
    if (prevToggleState.current === "hiding" && !toggleState) onClose?.();
    prevToggleState.current = toggleState;
  }, [toggleState, onClose]);

  useEffect(() => {
    if (open) show();
    else if (attachedRef.current) hide();
  }, [open, show, hide]);

  return { visible, toggleState, attached, hide };
};

export default useControlledVisibility;
