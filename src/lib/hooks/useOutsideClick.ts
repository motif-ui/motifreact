"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const useOutsideClick = <R = unknown>(
  callback: (event: MouseEvent | TouchEvent) => void,
  excludedRefs?: RefObject<HTMLElement | null>[],
) => {
  const ref = useRef<R>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const htmlRef = ref as unknown as RefObject<HTMLElement | null>;
      const clickedEl = event.target as Node;
      if (
        htmlRef.current &&
        !htmlRef.current.contains(clickedEl) &&
        !excludedRefs?.some(excludedRef => excludedRef.current?.contains(clickedEl))
      ) {
        callback(event);
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [callback, excludedRefs]);

  return ref;
};

export default useOutsideClick;
