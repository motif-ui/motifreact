import { useCallback, useEffect, useRef, useState } from "react";

export const useSelectExpand = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const outsideClickHandler = useCallback((e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) {
      setExpanded(false);
    }
  }, []);

  useEffect(() => {
    if (expanded) {
      document.addEventListener("mouseup", outsideClickHandler);
    } else {
      document.removeEventListener("mouseup", outsideClickHandler);
    }
    return () => {
      document.removeEventListener("mouseup", outsideClickHandler);
    };
  }, [expanded, outsideClickHandler]);

  const toggle = useCallback(() => setExpanded(!expanded), [expanded]);

  return { ref, expanded, toggle };
};
