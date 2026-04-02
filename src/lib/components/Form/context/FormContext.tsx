"use client";

import { createContext, PropsWithChildren, useCallback, useContext, useRef } from "react";
import {
  FormContextType,
  FormFieldInfo,
  FormStateRefProps,
  InputValue,
  NameInputValue,
  ItemRegisterType,
  FormProviderProps,
} from "../types";
import { InputValidation } from "../../Form/validation/validations";

const FormContext = createContext<FormContextType<NameInputValue> | undefined>(undefined);
export const useForm = () => useContext(FormContext);

export const FormProvider = (props: PropsWithChildren<FormProviderProps>) => {
  const { formOrientation, labelOrientation, size, children } = props;
  const formStateRef = useRef<FormStateRefProps>({
    fields: {},
    values: {},
    validationRules: {},
    isValid: true,
  });

  /**
   * Removes the values of disabled fields or child fields from the form state and returns the sanitized value prop
   *
   * @returns {NameInputValue}
   */
  const _sanitizeValuesForDisabledItems = useCallback(() => {
    type DisabledValuesReducerType = (
      valuesToSearch: NameInputValue,
    ) => (acc: NameInputValue, [name, itemInfo]: [string, FormFieldInfo | undefined]) => NameInputValue;

    const disabledValuesReducer: DisabledValuesReducerType =
      (valuesToSearch: NameInputValue) =>
      (acc, [name, itemInfo]) => {
        if (!itemInfo) return acc;

        const fieldValue = valuesToSearch[name];
        if (itemInfo.disabled) {
          return acc;
        } else if (!itemInfo.groupInputs) {
          return {
            ...acc,
            [name]: fieldValue,
          };
        } else {
          const sanitizedChildValues = Object.entries(itemInfo.groupInputs).reduce(disabledValuesReducer(fieldValue as NameInputValue), {});
          return {
            ...acc,
            ...(Object.keys(sanitizedChildValues).length && { [name]: sanitizedChildValues }),
          };
        }
      };

    return Object.entries(formStateRef.current.fields).reduce(disabledValuesReducer(formStateRef.current.values), {});
  }, []);

  /**
   * This is used to pass all the input information along with their default values and validation rules to the form
   *
   * @param {InputCommonProps} item - The information of the input item to register
   * @param {InputValidation[]} validations - The validation rules of the input item
   */
  const registerSingleField = useCallback((item: ItemRegisterType, validations?: InputValidation[]) => {
    const { value, name, ...rest } = item;

    formStateRef.current.fields[name] = { name, ...rest };
    formStateRef.current.values[name] = value;
    if (validations) {
      formStateRef.current.validationRules[name] = validations;
    }
  }, []);

  /**
   * This is used to pass all the group input information along with their default values and validation rules to the form
   *
   * @param {InputCommonProps} item - The information of the input item to register
   * @param {InputValidation[]} groupValidations - The validation rules of the input item
   * @param {string} groupName - The name of the group to register the input
   */
  const registerGroupFieldItem = useCallback(
    (groupInfo: ItemRegisterType, item: ItemRegisterType, groupValidations?: InputValidation[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name: groupName, value: NOT_USED, ...groupRestInfo } = groupInfo;
      const { name, value, ...rest } = item;

      // if any group item registered the group before, then just add the new item to the group
      if (formStateRef.current.fields[groupName]?.groupInputs) {
        formStateRef.current.fields[groupName].groupInputs[name] = { name, ...rest };
        (formStateRef.current.values[groupName] as Record<string, InputValue>)[name] = value;
      } else {
        formStateRef.current.fields[groupName] = {
          name: groupName,
          ...groupRestInfo,
          groupInputs: {
            [name]: { name, ...rest },
          },
        };
        formStateRef.current.values[groupName] = { [name]: value };
      }

      // if group validation rules are not provided before, then add them once
      if (!formStateRef.current.validationRules[groupName] && !!groupValidations?.length) {
        formStateRef.current.validationRules[groupName] = groupValidations;
      }
    },
    [],
  );

  /**
   * This is used to remove the input information from the form state when the input is unmounted
   *
   * @param {string} name - The name of the input to remove from the form state
   */
  const unregisterSingleField = useCallback((name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: fieldToRemove, ...restFields } = formStateRef.current.fields;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: valueToRemove, ...restValues } = formStateRef.current.values;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [name]: validationToRemove, ...restValidations } = formStateRef.current.validationRules;

    formStateRef.current = {
      ...formStateRef.current,
      fields: restFields,
      values: restValues,
      validationRules: restValidations,
    };
  }, []);

  /**
   * This is used to remove the group input information from the form state when the input is unmounted
   *
   * @param {string} groupName - The name of the group to unmount the input item from
   * @param {string} itemName - The name of the input item to remove from group inputs
   */
  const unregisterGroupFieldItem = useCallback(
    (groupName: string, itemName: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [itemName]: inputToRemove, ...restInputs } = formStateRef.current.fields[groupName]?.groupInputs || {};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [itemName]: valueToRemove, ...restValues } = formStateRef.current.values[groupName]
        ? (formStateRef.current.values[groupName] as Record<string, InputValue>)
        : {};

      formStateRef.current = {
        ...formStateRef.current,
        fields: {
          ...formStateRef.current.fields,
          ...(formStateRef.current.fields[groupName] && {
            [groupName]: {
              ...formStateRef.current.fields[groupName],
              groupInputs: restInputs,
            },
          }),
        },
        values: {
          ...formStateRef.current.values,
          [groupName]: restValues,
        },
      };

      !Object.keys(restInputs).length && unregisterSingleField(groupName);
    },
    [unregisterSingleField],
  );

  /**
   * Validates the form by checking the values that are passed to form state by onChange event of the inputs
   * using the validation rules. It sets the form state with the latest info after the validation and returns
   * the values and error status.
   *
   * Since the form handles everything itself, values of disabled items are removed from the form state here.
   *
   * @returns {FormSubmitData}
   */
  const validate = useCallback(() => {
    let isValid = true;

    const sanitizedValues = _sanitizeValuesForDisabledItems();
    const { validationRules, fields, values } = formStateRef.current;

    for (const name of Object.keys(validationRules)) {
      const rules = validationRules[name] || [];
      for (const validation of rules) {
        if (!fields[name]?.disabled && !validation.validate(values[name])) {
          isValid = false;
          fields[name]?.errorSetter?.(validation.errorMessage);
          break;
        }
      }
    }

    // 3. Final check for self-reported errors from components
    if (isValid) {
      const hasAnySelfError = Object.values(fields).some(field => field?.hasInternalError);
      if (hasAnySelfError) {
        isValid = false;
      }
    }

    return { isValid, values: sanitizedValues };
  }, [_sanitizeValuesForDisabledItems]);
  /**
   * This callback is used in the inputs the lift the value state up to the form by updating the form state. It also
   * removes the error state of the input if it has any
   *
   * @param {string} name - name of the input
   * @param {string} groupName - name of the group if the input is in a group
   * @param {InputValue} value - value to update
   */
  const notifyFormForFieldValueChange = useCallback((name: string, groupName: string | undefined, value?: InputValue) => {
    const nameToUpdate = groupName ?? name;
    formStateRef.current.values[nameToUpdate] = groupName
      ? { ...(formStateRef.current.values[nameToUpdate] as object), [name]: value }
      : value;
    const field = formStateRef.current.fields[nameToUpdate];
    if (field) {
      field.errorSetter?.(undefined);
      field.hasInternalError = undefined;
    }
  }, []);

  /**
   * This callback is used to lift the error state of inputs up to the form by updating the form state
   *
   * @param {string} name - name of the input
   * @param {string[]} errors - list of errors to pass to the form
   */
  const notifyFormForFieldSelfError = useCallback((name: string, errors: string[]) => {
    const field = formStateRef.current.fields[name];
    if (field && errors.length) {
      field.hasInternalError = true;
      field.errorSetter?.("Lütfen bu alandaki hatayı giderin.");
    }
  }, []);

  /**
   * This callback is used to reset the values of the form to their null values
   */
  const resetValues = useCallback(() => {
    const clearCallbackToFire: (() => void)[] = [];

    formStateRef.current.values = Object.entries(formStateRef.current.fields).reduce(
      (acc, [name, field]) => {
        if (!field) return acc;

        // Handle clearValueCallback for top-level fields
        !field.nonClearable && field.clearValueCallback && clearCallbackToFire.push(field.clearValueCallback);
        if (field.disabled) {
          return acc;
        }

        if (field.groupInputs) {
          // Handle grouped inputs
          const groupValues = Object.entries(field.groupInputs).reduce(
            (groupAcc, [groupItemName, groupItem]) => {
              if (!groupItem) return groupAcc;
              // Execute clearValueCallback for group items if available
              !groupItem.nonClearable && groupItem.clearValueCallback && clearCallbackToFire.push(groupItem.clearValueCallback);

              return {
                ...groupAcc,
                [groupItemName]: groupItem.nonClearable
                  ? (formStateRef.current.values[name] as Record<string, InputValue> | undefined)?.[groupItemName]
                  : groupItem.defaultValue,
              };
            },
            {} as Record<string, InputValue>,
          );

          return { ...acc, [name]: groupValues };
        }

        // Handle regular fields
        return {
          ...acc,
          [name]: field.nonClearable ? formStateRef.current.values[name] : field.defaultValue,
        };
      },
      {} as Record<string, InputValue>,
    );

    clearCallbackToFire.forEach(cb => cb());
  }, []);

  return (
    <FormContext
      value={{
        notifyFormForFieldValueChange,
        registerSingleField,
        registerGroupFieldItem,
        notifyFormForFieldSelfError,
        size,
        formOrientation,
        labelOrientation,
        validate,
        unregisterSingleField,
        unregisterGroupFieldItem,
        resetValues,
      }}
    >
      {children}
    </FormContext>
  );
};
