"use client";

import styles from "./SliderRange.module.scss";

import { SliderComponent } from "@/components/Slider/Slider";
import type { MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { calculateRealClickedValue, normalizeValueByStep } from "../Slider/helper";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import useDeepCompareEffect from "use-deep-compare-effect";
import { PropsWithRef } from "../../types";
import { SliderRangeProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { isNotAvailable } from "src/utils/utils";

const SliderRange = (p: PropsWithRef<SliderRangeProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("SliderRange", p);
  const {
    start = 0,
    end = 100,
    step = 1,
    min = start,
    max = end,
    hideTooltip,
    variant = "primary",
    onChange,
    ref,
    style,
    className,
  } = props;

  const maxSelectableValue = useMemo(() => normalizeValueByStep(max, step, min, "floor"), [max, min, step]);

  const getCorrectValue = useCallback(
    (sliderIndex: 0 | 1, val?: number) =>
      !isNotAvailable(val)
        ? Math.max(min, Math.min(normalizeValueByStep(val as number, step, min), maxSelectableValue))
        : sliderIndex === 0
          ? min
          : maxSelectableValue,
    [maxSelectableValue, min, step],
  );
  const value = useMemo(() => {
    const arr = Array.isArray(props.value) ? (props.value as (number | undefined)[]) : [];
    return [getCorrectValue(0, arr[0]), getCorrectValue(1, arr[1])];
  }, [getCorrectValue, props.value]);

  const [rangeValue, setRangeValue] = useState<number[]>(value);
  const { size, disabled, onFormFieldValueUpdate, inFormField } = useRegisterFormField({
    props,
    defaultValue: [min, maxSelectableValue],
    valueStateSetter: setRangeValue,
  });

  const applyValueUpdates = useCallback(
    (newRangeValue: number[], maybeTriggerOnChange: boolean) => {
      setRangeValue(newRangeValue);
      onFormFieldValueUpdate?.(newRangeValue);
      maybeTriggerOnChange && onChange?.(newRangeValue);
    },
    [onChange, onFormFieldValueUpdate],
  );

  const onClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (e.target instanceof HTMLInputElement) return;

      const clickedValue = calculateRealClickedValue(start, end, e);
      if (clickedValue > rangeValue[1]) {
        const correctValue = getCorrectValue(1, clickedValue);
        if (correctValue !== rangeValue[1]) {
          applyValueUpdates([rangeValue[0], correctValue], true);
        }
      } else {
        const correctValue = getCorrectValue(0, clickedValue);
        if (correctValue !== rangeValue[0]) {
          applyValueUpdates([correctValue, rangeValue[1]], true);
        }
      }
    },
    [applyValueUpdates, getCorrectValue, end, start, rangeValue],
  );

  const changeHandler = useCallback(
    (val: number, firstSlider?: boolean) => {
      if (firstSlider) {
        applyValueUpdates([val, rangeValue[1]], true);
      } else {
        applyValueUpdates([rangeValue[0], val], true);
      }
    },
    [applyValueUpdates, rangeValue],
  );

  useDeepCompareEffect(() => {
    const firstVal = getCorrectValue(0, value[0]);
    const secondVal = getCorrectValue(1, value[1]);
    applyValueUpdates([firstVal, secondVal], false);
  }, [applyValueUpdates, getCorrectValue, max, min, value]);

  const classes = sanitizeModuleRootClasses(styles, className, [size, inFormField && "inFormField"]);

  return (
    <div className={classes} style={style} {...(!disabled && { onClick })} ref={ref}>
      <SliderComponent
        inRangeSelector
        start={start}
        end={end}
        min={min}
        max={rangeValue[1]}
        onChange={val => changeHandler(val as number, true)}
        fill="none"
        value={rangeValue[0]}
        {...(rangeValue[1] === min && { style: { visibility: "hidden" } })}
        hideTooltip={hideTooltip}
        variant={variant}
        size={size}
        disabled={disabled}
        step={step}
      />
      <SliderComponent
        inRangeSelector
        start={start}
        end={end}
        min={rangeValue[0]}
        max={max}
        onChange={val => changeHandler(val as number)}
        value={rangeValue[1]}
        hideTooltip={hideTooltip}
        variant={variant}
        size={size}
        disabled={disabled}
        step={step}
        style={{ ...(rangeValue[0] === rangeValue[1] && rangeValue[1] !== min && { visibility: "hidden" }) }}
      />
    </div>
  );
};

export default SliderRange;
