"use client";

import styles from "./Slider.module.scss";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateRealClickedValue, normalizeValueByStep } from "./helper";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import { PropsWithRef } from "../../types";
import { SliderBaseProps, SliderProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { isNotAvailable } from "src/utils/utils";

export const SliderComponent = (p: PropsWithRef<SliderBaseProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("Slider", p);
  const {
    start = 0,
    end = 100,
    step = 1,
    min = start,
    max = end,
    fill = "left",
    style,
    className,
    variant = "primary",
    hideTooltip,
    onChange,
    ref,
    inRangeSelector,
  } = props;
  const avgThumbWidth = 20;
  const maxSelectableValue = useMemo(() => normalizeValueByStep(max, step, min, "floor"), [max, min, step]);

  const getCorrectValue = useCallback(
    (val?: number) =>
      !isNotAvailable(val)
        ? Number(Math.max(min, Math.min(normalizeValueByStep(val as number, step, min), maxSelectableValue)).toFixed(1))
        : min,
    [maxSelectableValue, min, step],
  );
  const value = useMemo(() => getCorrectValue(props.value as number), [getCorrectValue, props.value]);

  if (start > end || min > max || min < start || max > end) {
    throw new Error("Range error! Invalid range value. min-max values should be in the range of start-end.");
  }

  const calculateTooltipPosition = useCallback(
    (val: number) => {
      const correctValue = getCorrectValue(val);
      const thumbPosition = ((correctValue - min) / (max - min || 1)) * 100;
      const offset = avgThumbWidth / 2 - thumbPosition * 0.2;
      return `calc(${thumbPosition}% + ${offset}px)`;
    },
    [getCorrectValue, min, max],
  );

  const [rangeValue, setRangeValue] = useState<number>(value);
  const { size, disabled, onFormFieldValueUpdate, name, inFormField } = useRegisterFormField({
    props: { ...props, value },
    defaultValue: min,
    valueStateSetter: setRangeValue,
    dontRegister: inRangeSelector,
  });

  useEffect(() => {
    setRangeValue(getCorrectValue(value));
    onFormFieldValueUpdate?.(getCorrectValue(value));
  }, [getCorrectValue, onFormFieldValueUpdate, value]);

  const handleValueChange = useCallback(
    (valueRetrieved: number) => {
      const correctValue = getCorrectValue(valueRetrieved);
      if (correctValue !== rangeValue) {
        setRangeValue(correctValue);
        onChange?.(correctValue);
        onFormFieldValueUpdate?.(correctValue);
      }
    },
    [getCorrectValue, onChange, onFormFieldValueUpdate, rangeValue],
  );

  const onClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (e.target instanceof HTMLInputElement) return;

      const clickedValue = calculateRealClickedValue(start, end, e);
      handleValueChange(clickedValue);
    },
    [handleValueChange, end, start],
  );

  const fillStyle = useMemo(() => {
    const rate = 100 / (end - start);
    if (fill === "left") {
      return { left: `${(min - start) * rate}%`, width: `${(rangeValue - min) * rate}%` };
    } else if (fill === "right") {
      return { left: `${(rangeValue - start) * rate}%`, width: `${(max - rangeValue) * rate}%` };
    } else {
      return { display: "none" };
    }
  }, [end, fill, max, min, rangeValue, start]);

  const rangeContainerStyle = useMemo(() => {
    const widthPerc = ((max - min) / (end - start)) * 100;
    const leftPerc = ((min - start) / (end - start)) * 100;
    return {
      width: "calc(" + widthPerc.toFixed(2) + "%" + " + " + avgThumbWidth + "px)",
      left: "calc(" + leftPerc.toFixed(2) + "%" + " - " + avgThumbWidth / 2 + "px)",
    };
  }, [end, max, min, start]);

  const classNames = sanitizeModuleRootClasses(styles, className, [variant, size, disabled && "disabled", inFormField && "inFormField"]);

  return (
    <div className={classNames} style={style} {...(!inRangeSelector && !disabled && { onClick })} data-testid="slider" ref={ref}>
      <div className={styles.track} />
      <div className={styles.fill} style={fillStyle} />
      <div className={styles.mRangeContainer} style={rangeContainerStyle}>
        <input
          name={name}
          className={styles.mRange}
          type="range"
          min={min}
          max={max}
          step={step}
          onChange={e => handleValueChange(Number(e.target.value))}
          value={rangeValue}
          disabled={disabled}
        />
        {!hideTooltip && (
          <div className={styles.tooltip} style={{ left: calculateTooltipPosition(rangeValue) }}>
            {rangeValue}
          </div>
        )}
      </div>
    </div>
  );
};

const Slider = (props: SliderProps) => <SliderComponent {...props} />;
Slider.displayName = "Slider";
export default Slider;
