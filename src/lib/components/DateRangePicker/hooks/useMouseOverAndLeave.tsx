import { RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import styles from "@/components/DateRangePicker/DateRangePicker.module.scss";

export const useMouseOverAndLeave = (containerRef: RefObject<HTMLDivElement | null>, partialSelection?: Date) => {
  const refPicker1 = useRef<HTMLDivElement>(null);
  const refPicker2 = useRef<HTMLDivElement>(null);

  const removeAllTempClasses = useCallback((button: Element) => {
    button.classList.remove(styles.isInRange, styles.isSelected, styles.toLeft, styles.toRight);
  }, []);

  const partialSelectionTimeless = useMemo(
    () =>
      partialSelection ? new Date(partialSelection.getFullYear(), partialSelection.getMonth(), partialSelection.getDate()).getTime() : 0,
    [partialSelection],
  );

  const onMouseOver = useCallback(
    (e: MouseEvent) => {
      if (!(e.target instanceof HTMLButtonElement) || !partialSelectionTimeless) return;

      const hoveredDayTime = parseInt(e.target.getAttribute("data-date")!);

      const days = [...(refPicker1.current?.children ?? []), ...(refPicker2.current?.children ?? [])];
      days.forEach(button => {
        removeAllTempClasses(button);
        const dateOfButton = parseInt(button.getAttribute("data-date")!);

        const direction =
          hoveredDayTime !== partialSelectionTimeless
            ? dateOfButton >= partialSelectionTimeless && dateOfButton <= hoveredDayTime
              ? "toRight"
              : dateOfButton <= partialSelectionTimeless && dateOfButton >= hoveredDayTime
                ? "toLeft"
                : undefined
            : undefined;

        direction && button.classList.add(styles.isInRange);

        const isSelected = dateOfButton === partialSelectionTimeless;
        if (isSelected) {
          button.classList.add(...(direction ? [styles.isSelected, styles[direction]] : [styles.isSelected]));
        }
      });
    },
    [partialSelectionTimeless, removeAllTempClasses],
  );

  const onMouseLeave = useCallback(() => {
    const days = [...(refPicker1.current?.children ?? []), ...(refPicker2.current?.children ?? [])];
    days.forEach(button => removeAllTempClasses(button));
  }, [removeAllTempClasses]);

  useEffect(() => {
    const container = containerRef.current;
    const pickers = [refPicker1.current, refPicker2.current];
    pickers.forEach(p => p?.addEventListener("mouseover", onMouseOver));
    container?.addEventListener("mouseleave", onMouseLeave);
    return () => {
      pickers.forEach(p => p?.removeEventListener("mouseover", onMouseOver));
      container?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [containerRef, onMouseLeave, onMouseOver]);

  return { refPicker1, refPicker2 };
};
