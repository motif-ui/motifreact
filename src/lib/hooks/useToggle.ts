"use client";
import { useCallback, useMemo, useState } from "react";

type ToggleState = "showing" | "hiding";

type UseToggleReturn = {
  visible: boolean;
  toggleState?: ToggleState;
  show: () => void;
  hide: () => void;
  toggle: (forceShow?: boolean) => void;
};

const useToggle = (initialVisible = false, toggleTime?: number): UseToggleReturn => {
  const [visible, setVisible] = useState<boolean>(initialVisible);
  const [toggleState, setToggleState] = useState<ToggleState>();

  const show = useCallback(() => {
    if (toggleTime) {
      setToggleState("showing");
      setTimeout(() => {
        setToggleState(undefined);
        setVisible(true);
      }, toggleTime);
    } else {
      setVisible(true);
    }
  }, [toggleTime]);

  const hide = useCallback(() => {
    if (toggleTime) {
      setToggleState("hiding");
      setTimeout(() => {
        setToggleState(undefined);
        setVisible(false);
      }, toggleTime);
    } else {
      setVisible(false);
    }
  }, [toggleTime]);

  const toggle = useCallback(
    (visibility?: boolean) => {
      (visibility === undefined ? visible : !visibility) ? hide() : show();
    },
    [visible, show, hide],
  );

  return useMemo(() => ({ visible, toggleState, show, hide, toggle }), [hide, show, toggle, toggleState, visible]);
};

export default useToggle;
