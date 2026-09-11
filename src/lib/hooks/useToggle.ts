"use client";
import { useCallback, useMemo, useState } from "react";

type ToggleState = "showing" | "hiding";

type UseToggleOptions = {
  showTime?: number;
  hideTime?: number;
};

type UseToggleReturn = {
  visible: boolean;
  toggleState?: ToggleState;
  show: () => void;
  hide: () => void;
  toggle: (forceShow?: boolean) => void;
};

const useToggle = (initialVisible = false, options?: UseToggleOptions): UseToggleReturn => {
  const [visible, setVisible] = useState<boolean>(initialVisible);
  const [toggleState, setToggleState] = useState<ToggleState>();

  const showTime = options?.showTime;
  const hideTime = options?.hideTime;

  const show = useCallback(() => {
    if (showTime) {
      setToggleState("showing");
      setTimeout(() => {
        setToggleState(undefined);
        setVisible(true);
      }, showTime);
    } else {
      setVisible(true);
    }
  }, [showTime]);

  const hide = useCallback(() => {
    setVisible(false);
    if (hideTime) {
      setToggleState("hiding");
      setTimeout(() => setToggleState(undefined), hideTime);
    }
  }, [hideTime]);

  const toggle = useCallback(
    (visibility?: boolean) => {
      (visibility === undefined ? visible : !visibility) ? hide() : show();
    },
    [visible, show, hide],
  );

  return useMemo(() => ({ visible, toggleState, show, hide, toggle }), [hide, show, toggle, toggleState, visible]);
};

export default useToggle;
