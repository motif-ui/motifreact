"use client";

import styles from "./Select.module.scss";
import Icon from "@/components/Icon";
import type { MouseEvent } from "react";
import { Fragment, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useSelectExpand } from "@/components/Select/useSelectExpand";
import { SelectGroupItem, SelectItem, SelectProps } from "./types";
import SelectLi from "@/components/Select/SelectLi";
import SelectedItem from "@/components/Select/components/SelectedItem";
import { filterItems, getFilterableValue } from "@/components/Select/helper";
import { useRegisterFormField } from "@/components/Form/context/useRegisterFormField";
import useDeepCompareEffect from "use-deep-compare-effect";
import { PropsWithRef } from "../../types";
import { MotifIcon } from "@/components/Motif/Icon";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import ProgressCircle from "@/components/ProgressCircle";
import { hasOwn, isNotAvailable } from "../../../utils/utils";
import { useMotifContext } from "src/lib/motif/context/MotifProvider";

const loaderSizeMap = {
  xs: "xs",
  sm: "sm",
  md: "sm",
  lg: "sm",
} as const;

const Select = (p: PropsWithRef<SelectProps, HTMLDivElement>) => {
  const { t } = useMotifContext();
  const props = usePropsWithThemeDefaults("Select", p);
  const {
    data = [],
    icon,
    placeholder = t("select.placeholder"),
    multiple,
    loading,
    filterable,
    className,
    style,
    value = multiple ? [] : undefined,
    onChange,
    ref: outerRef,
  } = props;
  const [selectedItems, setSelectedItems] = useState<SelectItem[]>();
  const { size, error, readOnly, success, disabled, onFormFieldValueUpdate, name, inFormField } = useRegisterFormField({
    props,
    defaultValue: multiple ? [] : undefined,
    valueStateSetter: setSelectedItems,
  });

  const { ref, expanded, toggle } = useSelectExpand();
  useImperativeHandle(outerRef, () => ref.current!, [ref]);

  const [query, setQuery] = useState<string>("");
  const [dataFiltered, setDataFiltered] = useState<(SelectItem | SelectGroupItem)[]>([]);

  const changeHandler = useCallback(
    (item: SelectItem) => {
      const isAlreadySelected = selectedItems?.some(s => s.value === item.value);
      const updatedSelectedItems = multiple
        ? isAlreadySelected
          ? selectedItems?.filter(s => s.value !== item.value)
          : [...(selectedItems || []), item]
        : isAlreadySelected
          ? []
          : [item];

      setSelectedItems(updatedSelectedItems);
      const val = multiple ? updatedSelectedItems : updatedSelectedItems?.[0];
      onChange?.(val);
      onFormFieldValueUpdate?.(val);

      filterable && setQuery(multiple || !updatedSelectedItems?.length ? "" : getFilterableValue(item));
      !multiple && toggle();
    },
    [filterable, multiple, onChange, onFormFieldValueUpdate, selectedItems, toggle],
  );

  useDeepCompareEffect(() => {
    if (!isNotAvailable(value)) {
      const flatData = data.flatMap(item => ("groupLabel" in item ? item.items : item));
      if (multiple) {
        const val = (value as SelectItem[]).map(v => (hasOwn(v, "value") ? v.value : v));
        const itemsToSet = flatData.filter(item => val.some(v => v == item.value));
        setSelectedItems(itemsToSet);
        onFormFieldValueUpdate?.(itemsToSet);
      } else {
        const val = hasOwn(value, "value") ? (value as SelectItem).value : value;
        const itemsToSet = flatData.filter(item => item.value == val);
        setSelectedItems(itemsToSet);
        onFormFieldValueUpdate?.(itemsToSet[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, multiple, value]);

  useEffect(
    // Filters data when query changes
    () => {
      filterable && setDataFiltered(query ? filterItems(data, query) : data);
    },
    [data, query, filterable],
  );

  useEffect(() => {
    expanded ? setDataFiltered(data) : setQuery(multiple || !selectedItems?.length ? "" : getFilterableValue(selectedItems[0]));
  }, [data, expanded, multiple, selectedItems]);

  const inputOnClickHandler = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      if (readOnly) return;
      if (filterable) {
        const input = e.currentTarget.getElementsByTagName("input")[0];
        expanded ? requestAnimationFrame(() => input.blur()) : input.select();
      }
      toggle();
    },
    [expanded, filterable, toggle, readOnly],
  );

  const renderInputButton = () => {
    return (
      <div
        className={styles.input}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls={name}
        aria-readonly={readOnly}
        onClick={inputOnClickHandler}
        tabIndex={0}
      >
        {icon && <Icon name={icon} className={styles.iconLeft} size={size} />}
        <div className={styles.inputTextAndItemsContainer}>
          {multiple &&
            filterable &&
            selectedItems?.map(item => <SelectedItem key={item.value} item={item} size={size} removeHandler={changeHandler} />)}
          <input
            disabled={disabled}
            className={styles.inputText}
            placeholder={placeholder}
            onChange={e => setQuery(e.target.value)}
            value={filterable ? query : selectedItems?.map(s => s.label).join(", ") || ""}
            readOnly={readOnly || !filterable}
          />
        </div>
        <div className={styles.rightContainer}>
          {loading ? (
            <ProgressCircle size={loaderSizeMap[size]} indeterminate variant="primary" className={styles.loader} />
          ) : (
            <MotifIcon name="arrow_drop_down" className={`${styles.iconRight} ${styles.arrowDown}`} size={size} />
          )}
        </div>
      </div>
    );
  };

  const renderGroupLabel = (groupItem: SelectGroupItem) => (
    <Fragment key={groupItem.groupKey}>
      <li className={styles.optionGroup}>
        <label>{groupItem.groupLabel}</label>
      </li>
      {groupItem.items.map(item => (
        <SelectLi
          key={item.value}
          item={item}
          size={size}
          isSelected={!!selectedItems?.some(s => s.value === item.value)}
          onChange={changeHandler}
        />
      ))}
    </Fragment>
  );

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    !readOnly && expanded && "expanded",
    inFormField && "inFormField",
    loading && "loading",
    expanded && "active",
    disabled || readOnly || loading ? "disabled" : error ? "error" : success && "success",
  ]);
  return (
    <div ref={ref} className={classNames} data-testid="selectItem" style={style}>
      {renderInputButton()}
      {expanded && !disabled && !readOnly && !loading && (
        <ul className={styles.dropdown} role="listbox" id={name}>
          {dataFiltered.length ? (
            dataFiltered.map(item =>
              "groupLabel" in item ? (
                renderGroupLabel(item)
              ) : (
                <SelectLi
                  size={size}
                  key={item.value}
                  item={item}
                  isSelected={!!selectedItems?.some(s => s.value === item.value)}
                  onChange={changeHandler}
                />
              ),
            )
          ) : (
            <li className={styles.noData}>
              <label>{t("select.noData")}</label>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

Select.displayName = "Select";
export default Select;
