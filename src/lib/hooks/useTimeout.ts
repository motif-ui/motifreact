"use client";
import { useCallback, useEffect, useMemo, useRef } from "react";

const useTimeout = (callback: () => void, delay: number | undefined) => {
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined);
  const startTime = useRef<number>(undefined);
  const remainingTime = useRef<number | undefined>(delay);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = undefined;
  }, []);

  const pause = useCallback(() => {
    const elapsedSince = startTime.current;
    if (timeoutId.current === undefined || elapsedSince === undefined || remainingTime.current === undefined) return;
    stop();
    remainingTime.current -= Date.now() - elapsedSince;
    startTime.current = undefined;
  }, [stop]);

  const clear = useCallback(() => {
    stop();
    startTime.current = undefined;
    remainingTime.current = delay;
  }, [stop, delay]);

  const start = useCallback(() => {
    if (remainingTime.current === undefined || timeoutId.current !== undefined) return;
    timeoutId.current = setTimeout(() => {
      savedCallback.current();
      clear();
    }, remainingTime.current);
    startTime.current = Date.now();
  }, [clear]);

  return useMemo(() => ({ start, pause, clear }), [start, pause, clear]);
};

export default useTimeout;
