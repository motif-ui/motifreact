import { InputValidation } from "./validation/validations";
import { FileType } from "../Upload/types";
import { Size4SM } from "../../types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export type FormProps<T> = {
  onSubmit: (data: FormSubmitData<T>, event: FormEvent<HTMLFormElement>) => void;
  title?: string;
} & FormDefaultableProps;

export type FormDefaultableProps = {
  size?: InputSize;
  formOrientation?: Orientation;
  labelOrientation?: Orientation;
  submitButtonLabel?: string;
  buttonPosition?: "left" | "center" | "right";
  enableClearButton?: boolean;
  clearButtonLabel?: string;
  dontClearOnSubmit?: boolean;
};

//////////////////////////////
//////// HELPER TYPES ////////
//////////////////////////////

export type InputValue = string | boolean | object | [] | FileType | number | undefined;
export type InputSize = Size4SM;
export type Orientation = "horizontal" | "vertical";
export type NameInputValue = Record<string, InputValue>;
// Common props for all input types. This should be extended or omitted for the specific input types.
export type InputCommonProps = {
  name?: string;
  value?: InputValue;
  onChange?: (value?: InputValue) => void;
  disabled?: boolean;
  readOnly?: boolean;
  success?: boolean;
  error?: boolean;
  size?: InputSize;
};

////////////////////////////////////////
////// UseRegisterFormField Types //////
////////////////////////////////////////

// The input props that are passed to the useRegisterFormField hook
type UseRegisterFormFieldInputProps = {
  props: InputCommonProps & {
    onError?: (errors: string[]) => void;
  };
  defaultValue: InputValue;
  defaultValidations?: InputValidation[];
  dontRegister?: boolean; // This is sometimes required if there is a nested input usage and the children inputs should not be registered
  nonClearable?: boolean;
  suppressSelfErrorDisplay?: boolean;
  // eslint-disable-next-line
  valueStateSetter?: Dispatch<SetStateAction<any>>;
};

// The return type of the useRegisterFormField hook
type UseRegisterFormFieldReturnType = {
  size: InputSize;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  success?: boolean;
  error?: boolean;
  onChange?: (value?: InputValue) => void;
  onError?: (errors: string[]) => void; // Only for components that can have their own errors like upload components
  onFormFieldValueUpdate?: (value?: InputValue) => void;
  inFormField?: boolean;
};

export type UseRegisterFormFieldType = (registerProps: UseRegisterFormFieldInputProps) => UseRegisterFormFieldReturnType;

////////////////////////////////////////
/////// FormProvider/State Types ///////
////////////////////////////////////////

export type FormProviderProps = {
  size: InputSize;
  formOrientation: Orientation;
  labelOrientation: Orientation;
};

// Type of the form state reference
export type FormStateRefProps = {
  fields: FieldsObject;
  values: NameInputValue;
  validationRules: { [name: string]: InputValidation[] | undefined };
  isValid: boolean;
};

// Props that are provided to the fields via FieldContext
export type FormContextType<T> = {
  notifyFormForFieldValueChange: (name: string, groupName: string | undefined, value?: InputValue) => void;
  notifyFormForFieldSelfError: (name: string, errors: string[], suppressDisplay?: boolean) => void;
  registerSingleField: (fieldInfo: ItemRegisterType, validations?: InputValidation[]) => void;
  registerGroupFieldItem: (groupInfo: ItemRegisterType, fieldInfo: ItemRegisterType, validations?: InputValidation[]) => void;
  unregisterSingleField: (name: string) => void;
  unregisterGroupFieldItem: (groupName: string, itemName: string) => void;
  size: InputSize;
  formOrientation: Orientation;
  labelOrientation: Orientation;
  validate: () => FormSubmitData<T>;
  resetValues: () => void;
};

// The type of the data returned when the form is submitted
export type FormSubmitData<T = NameInputValue> = {
  isValid: boolean;
  values: T;
};

type FieldsObject = { [name: string]: FormFieldInfo | undefined };

// The type used to register fields/inputs to form state
export type ItemRegisterType = {
  name: string;
  value: InputValue;
  defaultValue: InputValue;
  disabled?: boolean;
  readOnly?: boolean;
  success?: boolean;
  // This is used for inputs that should not be cleared when the form is reset. For example, file inputs.
  nonClearable?: boolean;
  // This is the callback which is provided by the inputs to call when form is cleared to clear their own values.
  clearValueCallback?: () => void;
  // This is used to set the error to the field from the form context.
  errorSetter?: (error?: string) => void;
  // This is used to set the self-error flag without showing the error message in the FormField helper.
  selfErrorSetter?: (hasSelfError: boolean) => void;
};

// The type of the fields object in FormStateProps
export type FormFieldInfo = {
  name: string;
  defaultValue: InputValue;
  disabled?: boolean;
  readOnly?: boolean;
  success?: boolean;
  nonClearable?: boolean;
  hasSelfError?: boolean;
  groupInputs?: FieldsObject;
  clearValueCallback?: () => void;
  errorSetter?: (error?: string) => void;
  selfErrorSetter?: (hasSelfError: boolean) => void;
};

/////////////////////////////////////////
/////// FieldProvider/State Types ///////
/////////////////////////////////////////

// Props for FormField and FormFieldProvider
export type FormFieldProps = {
  fieldName: string;
  groupName?: string;
  validations?: InputValidation[] | undefined;
  disabled?: boolean;
  readOnly?: boolean;
  success?: boolean;
  setFieldError?: (error?: string) => void;
  setSelfError?: (hasSelfError: boolean) => void;
  error?: boolean;
};

// Custom form ref type for the form component
export type FormRefType = {
  clearForm: () => void;
} & HTMLFormElement;
