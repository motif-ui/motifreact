"use client";
import { useCallback, useEffect, useMemo, useRef } from "react";

const useTimeout = (callback: () => void, delay: number) => {
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined);
  const startTime = useRef<number>(undefined);
  const remainingTime = useRef<number>(delay);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const pause = useCallback(() => {
    clearTimeout(timeoutId.current);
    if (startTime.current) {
      remainingTime.current -= new Date().getTime() - startTime.current;
    }
  }, []);

  const clear = useCallback(() => {
    timeoutId.current && clearTimeout(timeoutId.current);
    startTime.current = undefined;
    remainingTime.current = delay;
  }, [delay]);

  const start = useCallback(() => {
    timeoutId.current = setTimeout(() => {
      savedCallback.current();
      clear();
    }, remainingTime.current);
    startTime.current = new Date().getTime();
  }, [clear]);

  return useMemo(() => ({ start, pause, clear }), [start, pause, clear]);
};

export default useTimeout;
