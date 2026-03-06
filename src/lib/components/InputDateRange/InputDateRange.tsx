"use client";

import styles from "./InputDateRange.module.scss";
import { useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import useOutsideClick from "../../hooks/useOutsideClick";
import { PropsWithRef } from "../../types";
import DateRangePicker from "@/components/DateRangePicker";
import { formatDate } from "../InputDate/helper";
import { defaultDateFormat } from "../Motif/Pickers/types";
import useToggle from "../../hooks/useToggle";
import { areRangesEquals, sanitizeRange, validateRange } from "@/components/InputDateRange/helper";
import { orderDatesAndPutTimes } from "@/components/DateRangePicker/helper";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { InputDateRangeProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import MotifIcon from "../Motif/Icon/MotifIcon";
import MotifIconButton from "../Motif/Icon/MotifIconButton";
import InputText from "@/components/InputText";
import { LOCALE_DATE_RANGE_TR_TR } from "@/components/DateRangePicker/locale/tr_TR";

export type MaybeDateRange = (Date | undefined)[] | undefined;

export const RANGE_ARROW = "⮕";

export const pickerSizeMap = {
  xs: "xs",
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

const InputDateRange = (p: PropsWithRef<InputDateRangeProps, HTMLDivElement>) => {
  const props = usePropsWithThemeDefaults("InputDateRange", p);
  const { pill, value, onChange, locale = LOCALE_DATE_RANGE_TR_TR, ref, style, className } = props;
  const format = useMemo(() => ({ ...defaultDateFormat, ...props.format }), [props.format]);
  const datePlaceholder = format.order.map(part => format[`${part}Format`]?.replace(/[DMY]/g, "_")).join(` ${format.delimiter} `);
  const placeholder = useMemo(
    () => props.placeholder ?? `${datePlaceholder} ${RANGE_ARROW} ${datePlaceholder}`,
    [datePlaceholder, props.placeholder],
  );

  const formatRangeString = useCallback(
    (dates: MaybeDateRange) => {
      const [start, end] = orderDatesAndPutTimes(dates || []);
      const date1 = formatDate(start, format);
      const date2 = formatDate(end, format);
      return date1 || date2 ? `${date1 || datePlaceholder} ${RANGE_ARROW} ${date2 || datePlaceholder}`.trim() : "";
    },
    [datePlaceholder, format],
  );

  const { visible, show, hide } = useToggle(false);
  const [itemValue, setItemValue] = useState<MaybeDateRange>(sanitizeRange(value as Date[]));
  const [typedValue, setTypedValue] = useState<string | undefined>(formatRangeString(itemValue));
  const setTypedValueWithFormat = useCallback((val: MaybeDateRange) => setTypedValue(formatRangeString(val)), [formatRangeString]);

  const valueStateSetter = useCallback(
    (dates: MaybeDateRange) => {
      setItemValue(dates ?? []);
      setTypedValueWithFormat(dates);
    },
    [setTypedValueWithFormat],
  );

  const { size, error, success, readOnly, disabled, onFormFieldValueUpdate, name } = useRegisterFormField({
    props,
    defaultValue: itemValue,
    valueStateSetter,
  });

  const applyChanges = useCallback(
    (dates: MaybeDateRange) => {
      if (!areRangesEquals(dates, itemValue)) {
        setItemValue(dates);
        onFormFieldValueUpdate?.(dates);
        onChange?.(dates);
      }
    },
    [itemValue, onChange, onFormFieldValueUpdate],
  );

  const clearDateValues = useCallback(() => {
    applyChanges(undefined);
    setTypedValue("");
  }, [applyChanges]);

  const onClearClickInInput = useCallback(() => {
    clearDateValues();
    hide();
  }, [clearDateValues, hide]);

  const outsideClickHandler = useCallback(() => {
    hide();
    !validateRange(itemValue) && clearDateValues();
  }, [clearDateValues, hide, itemValue]);

  const innerRef = useOutsideClick<HTMLDivElement>(outsideClickHandler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useImperativeHandle(ref, () => innerRef.current!, []);

  const dateChangeHandler = useCallback(
    (dates: MaybeDateRange) => {
      setTypedValueWithFormat(dates);
      applyChanges(dates);
    },
    [applyChanges, setTypedValueWithFormat],
  );

  const pickerShowHandler = useCallback(() => {
    !readOnly && !disabled && show();
  }, [disabled, readOnly, show]);

  useEffect(() => {
    setTypedValueWithFormat(value as MaybeDateRange);
    applyChanges(value as MaybeDateRange);

    // Do not put "applyChanges" in dep. array!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTypedValueWithFormat, value]);

  const classNames = sanitizeModuleRootClasses(styles, className);

  return (
    <div ref={innerRef} className={classNames} style={style}>
      <InputText
        name={name}
        size={size}
        pill={pill}
        placeholder={placeholder}
        success={success}
        error={error}
        disabled={disabled}
        readOnlyWithEnabledLook
        value={typedValue}
        onClick={pickerShowHandler}
        onFocus={pickerShowHandler}
        iconLeft={<MotifIcon name="calendar_expand_horizontal" size={size} />}
        iconRight={itemValue && !disabled && <MotifIconButton name="cancel_outline" size={size} onClick={onClearClickInInput} />}
      />
      {visible && (
        <DateRangePicker
          variant="bordered"
          size={pickerSizeMap[size]}
          value={itemValue}
          onDateChange={dateChangeHandler}
          onOkClick={hide}
          className={styles.dateRangePicker}
          locale={locale}
        />
      )}
    </div>
  );
};

InputDateRange.displayName = "InputDateRange";
export default InputDateRange;
