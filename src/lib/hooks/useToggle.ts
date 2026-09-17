"use client";
import { useCallback, useMemo, useRef, useState } from "react";

export type ToggleState = "showing" | "hiding";

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

  const pendingRafRef = useRef<number[]>([]);
  const pendingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // To prevention quick show/hide that may change already settled frame
  const clearPending = useCallback(() => {
    pendingRafRef.current.forEach(id => cancelAnimationFrame(id));
    pendingRafRef.current = [];
    clearTimeout(pendingTimeoutRef.current);
  }, []);

  const show = useCallback(() => {
    clearPending();
    if (duration) {
      setToggleState("showing");
      const outerRaf = requestAnimationFrame(() => {
        // This nested call is needed to wait a frame so the browser paints the hidden state
        // before we flip to visible. This prevents enter-transition not-firing.
        const innerRaf = requestAnimationFrame(() => {
          setVisible(true);
          pendingTimeoutRef.current = setTimeout(() => setToggleState(undefined), duration);
        });
        pendingRafRef.current.push(innerRaf);
      });
      pendingRafRef.current.push(outerRaf);
    } else {
      setVisible(true);
    }
  }, [duration, clearPending]);

  const hide = useCallback(() => {
    clearPending();
    setVisible(false);
    if (duration) {
      setToggleState("hiding");
      pendingTimeoutRef.current = setTimeout(() => setToggleState(undefined), duration);
    }
  }, [duration, clearPending]);

  const toggle = useCallback(
    (visibility?: boolean) => {
      (visibility === undefined ? visible : !visibility) ? hide() : show();
    },
    [visible, show, hide],
  );

  return useMemo(() => ({ visible, toggleState, show, hide, toggle }), [hide, show, toggle, toggleState, visible]);
};

export default useToggle;
