"use client";

import styles from "./PinCode.module.scss";
import { ReactElement, useCallback, useRef, useState } from "react";
import PinCodeItemHOC from "./components/PinCodeItemHOC";
import PinCodeItem from "./components/PinCodeItem";
import { PinCodeItemHOCProps, PinCodeProps } from "./types";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import useDeepCompareEffect from "use-deep-compare-effect";
import { PropsWithRef } from "../../types";
import { PinCodeContext } from "@/components/PinCode/PinCodeContext";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const PinCodeComponent = (p: PropsWithRef<PinCodeProps, HTMLDivElement>) => {
  const defaultValue = p.value
    ? (p.value as string[]).map((val, idx) => (p.children[idx].props.disabled && p.children[idx].props.masked ? val : ""))
    : new Array<string>(p.children.length).fill("");
  const props = usePropsWithThemeDefaults("PinCode", p);
  const { children, circle, letterCase, maskType = "asterisks", value = defaultValue, onChange, ref, className, style } = props;

  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array<null>(children.length));
  const [inputValues, setInputValues] = useState<string[]>(value as string[]);

  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate } = useRegisterFormField({
    props,
    defaultValue,
    valueStateSetter: setInputValues,
  });

  const focusNextInput = useCallback(
    (index: number) => {
      const nextIndex = children.slice(index + 1).findIndex(child => !(child.props.disabled || child.props.space)) + index + 1;
      nextIndex !== -1 && inputRefs.current[nextIndex]?.focus();
    },
    [children],
  );

  const focusPreviousInput = useCallback(
    (index: number) => {
      const findPreviousEnabledIndex = (currIndex: number): number =>
        currIndex > 0
          ? children[currIndex - 1].props.disabled || children[currIndex - 1].props.space
            ? findPreviousEnabledIndex(currIndex - 1)
            : currIndex - 1
          : -1;

      const previousIndex = findPreviousEnabledIndex(index);
      previousIndex >= 0 && inputRefs.current[previousIndex]?.focus();
    },
    [children],
  );

  const onInputChange = useCallback(
    (index: number, value?: string) => {
      if (value !== inputValues[index]) {
        const newInputValues = [...inputValues];
        newInputValues[index] = value || "";
        setInputValues(newInputValues);
        onChange?.(newInputValues);
        onFormFieldValueUpdate?.(newInputValues);
      }
    },
    [inputValues, onChange, onFormFieldValueUpdate],
  );

  useDeepCompareEffect(() => {
    setInputValues([...(value as string)]);
    onFormFieldValueUpdate?.([...(value as string)]);
  }, [onFormFieldValueUpdate, value]);

  const contextValues = {
    size,
    circle,
    letterCase,
    maskType,
    error,
    success,
    disabled,
    readOnly,
    focusPreviousInput,
    focusNextInput,
    onChange: onInputChange,
  };

  const renderPinCodeItems = () =>
    children.reduce<ReactElement<PinCodeItemHOCProps>[]>((acc, input, index) => {
      const prevItem = acc[index - 1];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const indexByWord = prevItem?.props.space || index === 0 ? 0 : (prevItem?.props.indexByWord || 0) + 1;

      return [
        ...acc,
        <PinCodeItemHOC
          {...input.props}
          value={inputValues[index]}
          index={index}
          indexByWord={indexByWord}
          key={index}
          ref={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          }}
        />,
      ];
    }, []);

  const classNames = sanitizeModuleRootClasses(styles, className, [size, circle && "circle", error ? "error" : success && "success"]);

  return (
    <div className={classNames} style={style} ref={ref} data-testid="pinCode">
      <PinCodeContext value={contextValues}>{renderPinCodeItems()}</PinCodeContext>
    </div>
  );
};

const PinCode = Object.assign(PinCodeComponent, {
  Item: PinCodeItem,
  displayName: "PinCode",
});
export default PinCode;
