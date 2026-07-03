"use client";

import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef } from "react";
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
import { useMotifContext } from "src/lib/motif/context/MotifProvider";

const FormContext = createContext<FormContextType<NameInputValue> | undefined>(undefined);
export const useForm = () => useContext(FormContext);

export const FormProvider = (props: PropsWithChildren<FormProviderProps>) => {
  const { t } = useMotifContext();
  const { formOrientation, labelOrientation, size, children, validateOnChange, preview, externalErrors } = props;
  const formStateRef = useRef<FormStateRefProps>({
    fields: {},
    values: {},
    validationRules: {},
    isValid: true,
    pendingInitFields: new Set(),
    externalErrors: externalErrors || {},
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
    formStateRef.current.pendingInitFields.add(name);
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
      formStateRef.current.pendingInitFields.add(groupName);
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
   * Validates a single field by name: runs its validation rules and checks for self-reported errors.
   * Disabled fields are always considered valid. Sets the field's error via errorSetter on failure.
   *
   * @param {string} name - key in fields/validationRules (group name for group fields)
   * @returns {boolean} true if the field is valid
   */
  const _validateField = useCallback(
    (name: string): boolean => {
      const { fields, validationRules, values } = formStateRef.current;
      const field = fields[name];

      if (!field || field.disabled) return true;

      const hasRuleError = (validationRules[name] || []).some(validation => {
        if (validation.validate(values[name])) return false;
        field.errorSetter?.(t(validation.errorMessage, validation.errorParams));
        return true;
      });

      return !hasRuleError && !field.hasInternalError;
    },
    [t],
  );

  const validate = useCallback(() => {
    const sanitizedValues = _sanitizeValuesForDisabledItems();
    const { fields } = formStateRef.current;
    const isValid = Object.keys(fields).reduce((acc, name) => _validateField(name) && acc, true);

    return { isValid, values: sanitizedValues };
  }, [_sanitizeValuesForDisabledItems, _validateField]);

  /**
   * This callback is used in the inputs the lift the value state up to the form by updating the form state. It also
   * removes the error state of the input if it has any.
   *
   * Some inputs (e.g. Checkbox) echo their initial value on mount via their own effect. That echo always carries the
   * same value already captured at registration, so it's identified by comparing against the field's previous value
   * rather than by a time window - that way an actual value change landing early (e.g. browser autofill firing right
   * after mount) still correctly clears a seeded error, instead of being mistaken for the echo.
   *
   * @param {string} name - name of the input
   * @param {string} groupName - name of the group if the input is in a group
   * @param {InputValue} value - value to update
   */
  const notifyFormForFieldValueChange = useCallback(
    (name: string, groupName: string | undefined, value?: InputValue) => {
      const nameToUpdate = groupName ?? name;
      const prevValue = formStateRef.current.values[nameToUpdate];
      const prevGroupValue = groupName ? (prevValue as Record<string, InputValue> | undefined) : undefined;
      const isGenuineChange = groupName ? prevGroupValue?.[name] !== value : prevValue !== value;
      const field = formStateRef.current.fields[nameToUpdate];

      formStateRef.current = {
        ...formStateRef.current,
        values: {
          ...formStateRef.current.values,
          [nameToUpdate]: groupName ? { ...prevGroupValue, [name]: value } : value,
        },
        fields: {
          ...formStateRef.current.fields,
          ...(field && isGenuineChange && { [nameToUpdate]: { ...field, hasInternalError: undefined } }),
        },
      };

      if (field) {
        isGenuineChange && field.errorSetter?.(undefined);
        validateOnChange && !formStateRef.current.pendingInitFields.has(nameToUpdate) && _validateField(nameToUpdate);
      }
    },
    [_validateField, validateOnChange],
  );

  /**
   * Removes a field from the pending-init set, enabling validateOnChange for it going forward.
   * Called via a deferred setTimeout in useRegisterFormField after all mount effects have run.
   *
   * @param {string} name - field name (or group name) to release from the init quarantine
   */
  const clearFieldFromPendingInit = useCallback((name: string) => {
    formStateRef.current.pendingInitFields.delete(name);
  }, []);

  /**
   * Reads a field/group's externally-supplied error synchronously, for seeding a field's error state on its very
   * first render (avoids a flash of "no error" before an effect can push the value in after the initial paint).
   * Disabled fields never seed an error, same as the errors-sync effect skips them once registered.
   *
   * `disabled` must be passed in by the caller (FormField/FormFieldGroup) - registration hasn't happened yet at the
   * point this runs, so formStateRef doesn't know the field's disabled state until after this call.
   *
   * Note: a field that unmounts after dismissing its error (by being edited or reset) and later remounts with the
   * same name will show the error again if `errors` still has it - dismissal isn't remembered across a remount.
   * That's an accepted trade-off in exchange for not tracking a separate "dismissed" set alongside `externalErrors`.
   *
   * @param {string} name - field or group name
   * @param {boolean} disabled - the field's current disabled state
   * @returns {string | undefined} the error to seed, if any
   */
  const getInitialExternalError = useCallback(
    (name: string, disabled?: boolean) => (disabled ? undefined : formStateRef.current.externalErrors[name]),
    [],
  );

  /**
   * This callback is used to lift the error state of inputs up to the form by updating the form state
   *
   * @param {string} name - name of the input
   * @param {string[]} errors - list of errors to pass to the form
   */
  const notifyFormForFieldSelfError = useCallback(
    (name: string, errors: string[]) => {
      const field = formStateRef.current.fields[name];
      if (field && errors.length) {
        field.hasInternalError = true;
        field.errorSetter?.(t("form.fieldError"));
      }
    },
    [t],
  );

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
          // Handle grouped inputs. hasClearableItem tracks, in the same pass, whether at least one item's
          // value is actually reset - the group's displayed error should only clear when that's the case.
          const { values: groupValues, hasClearableItem } = Object.entries(field.groupInputs).reduce(
            (groupAcc, [groupItemName, groupItem]) => {
              if (!groupItem) return groupAcc;
              // Execute clearValueCallback for group items if available
              !groupItem.nonClearable && groupItem.clearValueCallback && clearCallbackToFire.push(groupItem.clearValueCallback);

              return {
                values: {
                  ...groupAcc.values,
                  [groupItemName]: groupItem.nonClearable
                    ? (formStateRef.current.values[name] as Record<string, InputValue> | undefined)?.[groupItemName]
                    : groupItem.defaultValue,
                },
                hasClearableItem: groupAcc.hasClearableItem || !groupItem.nonClearable,
              };
            },
            { values: {}, hasClearableItem: false } as { values: Record<string, InputValue>; hasClearableItem: boolean },
          );

          if (hasClearableItem) {
            field.errorSetter?.(undefined);
            field.hasInternalError = undefined;
          }

          return { ...acc, [name]: groupValues };
        }

        // Handle regular fields
        if (!field.nonClearable) {
          field.errorSetter?.(undefined);
          field.hasInternalError = undefined;
        }

        return {
          ...acc,
          [name]: field.nonClearable ? formStateRef.current.values[name] : field.defaultValue,
        };
      },
      {} as Record<string, InputValue>,
    );

    clearCallbackToFire.forEach(cb => cb());
  }, []);

  /**
   * Syncs `externalErrors` prop into the fields.
   * Disabled fields are skipped, same as `_validateField` never sets an error on a disabled field.
   * A field with an active internal error (e.g. Upload components) keeps it on screen instead of being overridden
   */
  useEffect(() => {
    const nextErrors = externalErrors || {};
    const prevErrors = formStateRef.current.externalErrors;
    const allNames = new Set([...Object.keys(prevErrors), ...Object.keys(nextErrors)]);

    allNames.forEach(name => {
      const field = formStateRef.current.fields[name];
      if (prevErrors[name] !== nextErrors[name] && !field?.disabled && !field?.hasInternalError) {
        field?.errorSetter?.(nextErrors[name] || undefined);
      }
    });

    formStateRef.current.externalErrors = nextErrors;
  }, [externalErrors]);

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
        clearFieldFromPendingInit,
        getInitialExternalError,
        preview,
      }}
    >
      {children}
    </FormContext>
  );
};
