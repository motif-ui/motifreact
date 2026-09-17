"use client";
import { useCallback, useMemo, useState } from "react";

type ToggleState = "showing" | "hiding";

type Options = {
  initialVisible?: boolean;
  duration?: number;
};

type UseToggleReturn = {
  visible: boolean;
  toggleState?: ToggleState;
  show: () => void;
  hide: () => void;
  toggle: (forceShow?: boolean) => void;
};

const useToggle = (options: Options = {}): UseToggleReturn => {
  const { initialVisible = false, duration } = options;
  const [visible, setVisible] = useState<boolean>(initialVisible);
  const [toggleState, setToggleState] = useState<ToggleState>();

  const show = useCallback(() => {
    if (duration) {
      setToggleState("showing");
      requestAnimationFrame(() =>
        // This nested call is needed to wait a frame so the browser paints the hidden state
        // before we flip to visible. This prevents enter-transition not-firing.
        requestAnimationFrame(() => {
          setVisible(true);
          setTimeout(() => setToggleState(undefined), duration);
        }),
      );
    } else {
      setVisible(true);
    }
  }, [duration]);

  const hide = useCallback(() => {
    setVisible(false);
    if (duration) {
      setToggleState("hiding");
      setTimeout(() => setToggleState(undefined), duration);
    }
  }, [duration]);

  const toggle = useCallback(
    (visibility?: boolean) => {
      (visibility === undefined ? visible : !visibility) ? hide() : show();
    },
    [visible, show, hide],
  );

  return useMemo(() => ({ visible, toggleState, show, hide, toggle }), [hide, show, toggle, toggleState, visible]);
};

export default useToggle;
