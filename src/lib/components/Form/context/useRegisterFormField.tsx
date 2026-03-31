import { useCallback, useLayoutEffect } from "react";
import { useFormField } from "@/components/Form/context/FieldContext";
import { useForm } from "@/components/Form/context/FormContext";
import { InputValue, ItemRegisterType, UseRegisterFormFieldType } from "@/components/Form/types";

/**
 * This hook is used to register the form fields to the form context. It basically gets the props of the input and checks whether it is inside a form or used standalone.
 * If it is used standalone, it returns all the props as it is. If it is inside a form, it registers the field to the form context and returns the props with the form context values.
 *
 * @param registerProps
 *
 * @returns The props of the input with the form context values if it is inside a form or the props as it is if it is standalone.
 * */
export const useRegisterFormField: UseRegisterFormFieldType = registerProps => {
  const { dontRegister, defaultValidations, defaultValue, props, valueStateSetter, nonClearable } = registerProps;
  const { name, value = defaultValue, disabled, readOnly, success, size = "md", error, onError, onChange } = props;

  const fieldContext = useFormField();
  const formContext = useForm();

  // Some nested inputs like slider in slider range may not be registered to the form. dontRegister prop is used for this.
  const shouldRegister = !!(!dontRegister && fieldContext && formContext);

  if (shouldRegister) {
    if (fieldContext.groupName && !name) {
      throw new Error(
        `FormFieldGroup named "${fieldContext.groupName}" have some input children without a name.\n\nIf the input is within a FormFieldGroup, the name prop must be provided to the input component.`,
      );
    }
    if (!fieldContext.groupName && name && fieldContext.fieldName !== name) {
      throw new Error(
        `If name prop is used in an input, it should match with FormField's name.\n\nFormField name: "${fieldContext.fieldName}"\nInput name: "${name}"`,
      );
    }
  }

  useLayoutEffect(() => {
    if (shouldRegister) {
      const { registerSingleField, registerGroupFieldItem, unregisterSingleField, unregisterGroupFieldItem } = formContext;
      const { fieldName, groupName, validations } = fieldContext;
      const validationsFinal = validations?.concat(defaultValidations || []);

      const singleFieldInfo: ItemRegisterType = {
        name: fieldName,
        value,
        readOnly: fieldContext.readOnly,
        disabled: fieldContext.disabled,
        success: fieldContext.success,
        defaultValue,
        nonClearable,
        ...(!nonClearable && valueStateSetter && { clearValueCallback: () => valueStateSetter(defaultValue) }),
        errorSetter: fieldContext.setFieldError,
      };

      if (groupName) {
        const fieldInfo = {
          ...singleFieldInfo,
          name: name!,
          disabled: fieldContext.disabled ?? disabled,
          success: fieldContext.success ?? success,
        };
        const groupInfo: ItemRegisterType = {
          ...singleFieldInfo,
          name: groupName,
          defaultValue: {},
        };
        registerGroupFieldItem(groupInfo, fieldInfo, validationsFinal);

        return () => unregisterGroupFieldItem(groupName, name!);
      } else {
        registerSingleField(singleFieldInfo, validationsFinal);

        return () => unregisterSingleField(fieldName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFormFieldValueUpdate = useCallback(
    (value?: InputValue) => {
      fieldContext?.fieldName && formContext?.notifyFormForFieldValueChange(name ?? fieldContext.fieldName, fieldContext.groupName, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fieldContext?.fieldName, fieldContext?.groupName, name],
  );

  const onFormFieldSelfError = useCallback(
    (errors: string[]) => {
      if (shouldRegister) {
        formContext.notifyFormForFieldSelfError(name ?? fieldContext.fieldName, errors);
      }
      onError?.(errors);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fieldContext?.fieldName, name, onError, shouldRegister],
  );

  return shouldRegister
    ? {
        readOnly: fieldContext.readOnly,
        success: fieldContext.groupName ? (fieldContext.success ?? success) : fieldContext.success,
        disabled: fieldContext.groupName ? (fieldContext.disabled ?? disabled) : fieldContext.disabled,
        size: formContext.size,
        error: fieldContext.error,
        onError: onFormFieldSelfError,
        onFormFieldValueUpdate,
        inFormField: true,
        name: name ?? fieldContext.fieldName,
        onChange,
      }
    : {
        readOnly,
        success,
        disabled,
        size,
        error,
        onError,
        name,
        onChange,
      };
};
